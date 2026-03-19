"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  MapPin, 
  Bike, 
  CheckCircle2, 
  Clock, 
  Package, 
  Loader2, 
  ChevronRight,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

export default function TrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pollOrder = setInterval(() => {
      fetch(`/api/orders/${id}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(err => console.error(err));
    }, 5000);

    return () => clearInterval(pollOrder);
  }, [id]);

  if (loading) return (
     <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Localizando tu pedido...</p>
     </div>
  );

  const statuses = [
    { key: 'PENDING', label: 'Recibido', icon: Clock, desc: 'El local está revisando tu pedido' },
    { key: 'ACCEPTED', label: 'Preparando', icon: Package, desc: 'Ya casi está listo para despachar' },
    { key: 'DELIVERING', label: 'En Camino', icon: Bike, desc: 'Un Whupi Rider va a tu ubicación' },
    { key: 'COMPLETED', label: 'Entregado', icon: CheckCircle2, desc: '¡Que lo disfrutes!' }
  ];

  const currentIdx = statuses.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-primary selection:text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 p-6 glass border-b border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
               <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
               <h1 className="text-lg font-black italic tracking-tighter uppercase leading-none">Whupi <span className="text-primary italic">Live</span></h1>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Seguimiento en vivo</p>
            </div>
         </div>
         <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-tighter">
            Orden #{order.id.slice(0,6)}
         </span>
      </div>

      <main className="p-6 space-y-8 max-w-lg mx-auto pb-40">
         {/* Map Placeholder */}
         <div className="w-full h-80 rounded-[40px] border border-white/5 bg-zinc-900/50 glass relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-68.303,-54.806,12/600x400?access_token=none')] bg-cover opacity-40 grayscale" />
            
            {/* Rider Pulse if delivering */}
            {order.status === 'DELIVERING' && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                     <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 scale-[4]" />
                     <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/40 relative z-10 border-2 border-white/20">
                        <Bike className="w-5 h-5 text-white" />
                     </div>
                  </div>
               </div>
            )}

            <div className="absolute bottom-6 left-6 right-6 glass p-4 rounded-3xl border border-white/10 flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Tu ubicación</p>
                  <p className="text-xs font-bold text-white line-clamp-1">{order.customer_address || 'Dirección no especificada'}</p>
               </div>
            </div>
         </div>

         {/* Timeline */}
         <div className="space-y-4">
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest px-2">Estado del Envío</h2>
            <div className="space-y-2">
               {statuses.map((s, i) => {
                  const isPast = i < currentIdx;
                  const isCurrent = i === currentIdx;
                  const Icon = s.icon;
                  
                  return (
                     <div key={s.key} className={`p-5 rounded-[28px] border transition-all duration-500 flex items-center gap-4 ${
                        isCurrent ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' : 
                        isPast ? 'bg-zinc-900/30 border-white/5 opacity-60' : 'bg-transparent border-white/5 opacity-30 shadow-none'
                     }`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                           isCurrent ? 'bg-primary text-white scale-110' : 
                           isPast ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-zinc-500'
                        }`}>
                           {isPast ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                           <h3 className={`text-sm font-black uppercase tracking-tight leading-none mb-1 ${isCurrent ? 'text-white' : 'text-zinc-400'}`}>
                              {s.label}
                           </h3>
                           <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-tighter">
                              {s.desc}
                           </p>
                        </div>
                        {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Trust Card */}
         <div className="p-6 rounded-[32px] bg-primary/10 border border-primary/20 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <div>
               <p className="text-xs font-bold text-white">Whupi Safe Delivery</p>
               <p className="text-[10px] text-zinc-500">Tu envío está asegurado y monitoreado.</p>
            </div>
         </div>
      </main>

      {/* Floating Status Bar for other states */}
      <div className="fixed bottom-0 left-0 right-0 p-8 glass-dark border-t border-white/5 z-50">
         <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center">
                  <Bike className="w-6 h-6 text-zinc-500" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Whupi Rider</p>
                  <p className="text-sm font-black text-white">{order.rider_id ? 'Asignado' : 'Buscando...'}</p>
               </div>
            </div>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-tighter hover:bg-white/10 transition-all flex items-center gap-2">
               Contactar <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>
         </div>
      </div>
    </div>
  );
}
