"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  MapPin, 
  Bike, 
  CheckCircle2, 
  Clock, 
  Navigation,
  Loader2,
  Store,
  ShieldCheck
} from "lucide-react";

import { use } from "react";

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = () => {
      fetch(`/api/orders/${id}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 15000); // Polling cada 15s
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <h1 className="text-xl font-bold text-white">Localizando tu pedido...</h1>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Oops! Pedido no encontrado</h1>
        <p className="text-zinc-500 mt-2">Verifica el enlace o contacta al local.</p>
      </div>
    );
  }

  const steps = [
    { label: "Preparando", icon: Store, active: order.status === "PENDING" },
    { label: "Asignado", icon: Bike, active: order.status === "ACCEPTED" },
    { label: "En camino", icon: Navigation, active: order.status === "PICKED_UP" },
    { label: "Entregado", icon: CheckCircle2, active: order.status === "DELIVERED" },
  ];

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      {/* Header Premium */}
      <div className="px-6 py-12 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/20 rounded-3xl flex items-center justify-center mb-6 border border-primary/30">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">WHUPI TRACK</h1>
        <p className="text-zinc-500 text-sm font-medium">Seguimiento de orden #{id.slice(0, 6)}</p>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-8 space-y-6">
        {/* Status Card */}
        <div className="p-8 rounded-[32px] border border-white/5 glass bg-zinc-900/50 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Estado del Envío</h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase">
              Actualizado ahora
            </div>
          </div>

          {/* Stepper Vertical */}
          <div className="relative space-y-8">
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-zinc-800" />
            {steps.map((step, i) => (
              <div key={i} className="flex gap-6 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background z-10 ${step.active ? 'bg-primary text-white scale-110' : 'bg-zinc-800 text-zinc-600'}`}>
                   <step.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`font-bold ${step.active ? 'text-white' : 'text-zinc-600'}`}>{step.label}</p>
                  <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">{order.store_name || "Lodejacinto"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Card */}
        <div className="p-8 rounded-[32px] border border-white/5 glass space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Dirección de Entrega</p>
              <p className="text-sm font-bold truncate max-w-[200px]">{order.customer_address}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Pago Seguro</span>
            </div>
            <span className="text-lg font-black text-white">${order.total_amount}</span>
          </div>
        </div>

        {/* Support */}
        <p className="text-center text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] pt-4">
          Powered by Whupi.shop
        </p>
      </div>
    </div>
  );
}
