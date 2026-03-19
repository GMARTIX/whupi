"use client";

import { useState } from "react";
import { 
  Clipboard, 
  MapPin, 
  Phone, 
  CreditCard, 
  User, 
  ChevronLeft,
  Loader2,
  Package, 
  Truck, 
  Clock, 
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { parseWhatsAppMessage } from "@/lib/utils/parser";

export default function NewOrderPage() {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    paymentMethod: "Efectivo",
    amount: "",
    deliveryPrice: "",
    prepTime: "15"
  });

  const handleParse = () => {
    const parsed = parseWhatsAppMessage(rawText);
    setFormData(prev => ({
      ...prev,
      address: parsed.address || prev.address,
      phone: parsed.phone || prev.phone,
      paymentMethod: parsed.paymentMethod || prev.paymentMethod,
      deliveryPrice: parsed.deliveryPrice?.toString() || prev.deliveryPrice
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          merchantId: "m-lodejacinto" // Temporario hasta tener Auth
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setSuccess(true);
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">¡Pedido Creado!</h2>
        <p className="text-zinc-500 mt-2 mb-8">El pedido ya está disponible para los cadetes.</p>
        <Link href="/dashboard/merchant" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all">
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/merchant" className="p-2 rounded-xl border border-white/5 glass text-zinc-400 hover:text-white transition-all">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight">Nuevo Envío</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Parsing Section */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/5 glass space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Clipboard className="w-5 h-5" />
              <h2 className="font-bold">Pegar desde WhatsApp</h2>
            </div>
            <p className="text-sm text-zinc-500">Pega el mensaje del grupo aquí y extraeremos los datos automáticamente.</p>
            <textarea 
              className="w-full h-40 bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/50 transition-all"
              placeholder="Ej: Dirección: Provincias Unidas 318..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
            <button 
              onClick={handleParse}
              type="button"
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-xl transition-all"
            >
              Procesar Mensaje
            </button>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-white/5 glass space-y-6 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="grid grid-cols-1 gap-4">
            <InputField 
              label="Nombre del Cliente" 
              icon={<User className="w-4 h-4" />} 
              placeholder="Ej: Agustin"
              value={formData.customerName}
              onChange={(v: string) => setFormData({...formData, customerName: v})}
            />
            <InputField 
              label="Teléfono" 
              icon={<Phone className="w-4 h-4" />} 
              placeholder="2966505558"
              value={formData.phone}
              onChange={(v: string) => setFormData({...formData, phone: v})}
            />
            <InputField 
              label="Dirección de Envío" 
              icon={<MapPin className="w-4 h-4" />} 
              placeholder="Provincias Unidas 318"
              value={formData.address}
              onChange={(v: string) => setFormData({...formData, address: v})}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="Total a Cobrar" 
                icon={<CreditCard className="w-4 h-4" />} 
                placeholder="$0.00"
                value={formData.amount}
                onChange={(v: string) => setFormData({...formData, amount: v})}
              />
              <InputField 
                label="Costo de Envío" 
                icon={<Truck className="w-4 h-4" />} 
                placeholder="$0.00"
                value={formData.deliveryPrice}
                onChange={(v: string) => setFormData({...formData, deliveryPrice: v})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Pago</label>
              <select 
                className="w-full bg-white/5 border border-white/5 rounded-xl p-[11px] text-sm text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Pagado">Ya pagado</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publicar Pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, icon, placeholder, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors">
          {icon}
        </div>
        <input 
          type="text" 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/50 transition-all"
        />
      </div>
    </div>
  );
}
