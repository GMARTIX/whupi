"use client";

import { useState, useEffect } from "react";
import { 
  Store, 
  MapPin, 
  Phone, 
  Image as ImageIcon, 
  Save, 
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [merchant, setMerchant] = useState({
    id: "m-lodejacinto", // Hardcoded for demo
    store_name: "",
    address: "",
    whatsapp_number: "",
    logo_url: ""
  });

  useEffect(() => {
    fetch(`/api/merchants/${merchant.id}`)
      .then(res => res.json())
      .then(data => {
        setMerchant(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/merchants/${merchant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merchant)
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Ajustes del Comercio</h1>
        <p className="text-zinc-500 text-sm">Configura la identidad de tu tienda y datos de contacto</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store Info */}
          <div className="p-8 rounded-[40px] border border-white/5 glass bg-zinc-900/50 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" /> Perfil Público
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Nombre de la Tienda</label>
                <input 
                  value={merchant.store_name}
                  onChange={e => setMerchant({...merchant, store_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Dirección Principal</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    value={merchant.address}
                    onChange={e => setMerchant({...merchant, address: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3 text-white focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Brand */}
          <div className="p-8 rounded-[40px] border border-white/5 glass bg-zinc-900/50 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" /> Contacto y Marca
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">WhatsApp de Pedidos</label>
                <input 
                  value={merchant.whatsapp_number}
                  onChange={e => setMerchant({...merchant, whatsapp_number: e.target.value})}
                  placeholder="+54..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">URL del Logo (opcional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    value={merchant.logo_url}
                    onChange={e => setMerchant({...merchant, logo_url: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3 text-white focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          {success && (
            <span className="text-green-500 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="w-5 h-5" /> Cambios guardados
            </span>
          )}
          <button 
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Guardar Cambios</>}
          </button>
        </div>
      </form>
    </div>
  );
}
