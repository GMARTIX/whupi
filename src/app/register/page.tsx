"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, ArrowRight, Loader2, Store, Phone } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ storeName: "", phone: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        // En un sistema real usaríamos cookies/session. 
        // Para el MVP redirigimos al dashboard.
        window.location.href = "/dashboard/merchant";
      } else {
        alert("Error al registrarse");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-premium">
      <div className="w-full max-w-md p-8 rounded-[40px] border border-white/10 glass bg-zinc-900/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-400"></div>
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white">Crea tu cuenta</h1>
          <p className="text-zinc-500 text-sm mt-2">Empieza a gestionar tus pedidos hoy gratis</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Nombre del Comercio</label>
            <div className="relative">
              <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input 
                required
                value={formData.storeName}
                onChange={e => setFormData({...formData, storeName: e.target.value})}
                placeholder="Ej: Lo de Jacinto"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">WhatsApp / Celular</label>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input 
                required
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+54 9..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg mt-4"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>COMENZAR <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
           <p className="text-zinc-500 text-sm">
             ¿Ya tienes cuenta? <Link href="/login" className="text-primary font-bold hover:underline">Inicia sesión</Link>
           </p>
        </div>
      </div>
    </div>
  );
}
