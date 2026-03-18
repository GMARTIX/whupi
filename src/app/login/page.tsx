"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, ArrowRight, Loader2, Smartphone, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de login
    setTimeout(() => {
      window.location.href = "/dashboard/merchant";
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-premium">
      <div className="w-full max-w-md p-8 rounded-[40px] border border-white/10 glass bg-zinc-900/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-400"></div>
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white">Bienvenido</h1>
          <p className="text-zinc-500 text-sm mt-2">Ingresa con tu número de teléfono</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Celular / Móvil</label>
            <div className="relative">
              <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input 
                required
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+54 9..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-primary transition-all text-lg"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>ENTRAR <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
           <p className="text-zinc-500 text-sm">
             ¿No tienes cuenta? <Link href="/register" className="text-primary font-bold hover:underline">Regístrate gratis</Link>
           </p>
           <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-black uppercase tracking-widest">
             <ShieldCheck className="w-3 h-3" /> Conexión Segura
           </div>
        </div>
      </div>
    </div>
  );
}
