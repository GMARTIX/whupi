"use client";

import { useState, useEffect } from "react";
import { 
  Bike, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Package
} from "lucide-react";
import Link from "next/link";

export default function RiderDashboard() {
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        // En un futuro esto filtraría por cercanía y solo ACCEPTED
        const accepted = (Array.isArray(data) ? data : []).filter(o => o.status === 'ACCEPTED');
        setAvailableOrders(accepted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleTakeOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DELIVERING", riderId: "rider-1" }) // Mock rider
      });
      if (res.ok) {
        setAvailableOrders(prev => prev.filter(o => o.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8 pb-32">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-black italic tracking-tighter">WHUPI <span className="text-primary italic">RIDER</span></h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Panel de Cadetes</p>
         </div>
         <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Bike className="w-6 h-6 text-primary" />
         </div>
      </div>

      <div className="space-y-6">
         <h2 className="text-lg font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-zinc-500" /> Pedidos Disponibles ({availableOrders.length})
         </h2>

         {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
         ) : availableOrders.length === 0 ? (
            <div className="p-12 text-center glass rounded-3xl border border-white/5 space-y-4">
               <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-zinc-700" />
               </div>
               <p className="text-sm text-zinc-500 font-bold">No hay pedidos disponibles en este momento.</p>
            </div>
         ) : (
            <div className="space-y-4">
               {availableOrders.map(order => (
                  <div key={order.id} className="p-6 rounded-[32px] border border-white/5 bg-zinc-900/50 glass space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Comercio</p>
                           <h3 className="text-lg font-bold text-white">{order.store_name || 'Tienda Whupi'}</h3>
                        </div>
                        <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase italic">NUEVO</span>
                     </div>

                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <MapPin className="w-4 h-4 text-zinc-600" />
                           <span className="text-sm text-zinc-400">{order.customer_address || 'Retiro en local'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Clock className="w-4 h-4 text-zinc-600" />
                           <span className="text-sm text-zinc-400">Hace 5 min</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-lg font-black text-white">${order.shipping_cost || 0} <span className="text-[10px] text-zinc-500 font-normal">Envío</span></div>
                        <button 
                          onClick={() => handleTakeOrder(order.id)}
                          className="px-8 py-3 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-tighter"
                        >
                          Tomar Pedido
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-6 left-6 right-6 p-4 glass rounded-[32px] border border-white/10 flex items-center justify-around shadow-2xl">
         <button className="flex flex-col items-center gap-1 text-primary">
            <Package className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase">Disponibles</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-zinc-600">
            <Bike className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase">Mis Viajes</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-zinc-600">
            <CheckCircle2 className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase">Perfil</span>
         </button>
      </div>
    </div>
  );
}
