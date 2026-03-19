"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  User, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Share2,
  Printer
} from "lucide-react";
import Link from "next/link";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrder({ ...order, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  if (!order) return <div className="p-20 text-center text-white">No se encontró el pedido.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
         <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-bold">
            <ChevronLeft className="w-5 h-5" /> Volver
         </button>
         <div className="flex gap-4">
            {order.status === 'PENDING' && (
               <button 
                 onClick={() => handleStatusUpdate('ACCEPTED')}
                 className="px-6 py-2 bg-primary text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
               >
                 <CheckCircle2 className="w-4 h-4" /> Aceptar Pedido
               </button>
            )}
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all">
               <Printer className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-8">
            {/* Header Info */}
            <div className="p-8 rounded-[40px] border border-white/5 glass bg-zinc-900/50 space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">ID del Pedido</p>
                     <h1 className="text-3xl font-black text-white">#{order.id.slice(0,8)}</h1>
                  </div>
                  <StatusBadge status={order.status} />
               </div>
               
               <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                     <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                     <p className="text-xs text-zinc-500 font-bold">Fecha del Pedido</p>
                     <p className="text-sm font-black text-white">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
               </div>
            </div>

            {/* Items */}
            <div className="p-8 rounded-[40px] border border-white/5 glass bg-zinc-900/50 space-y-6">
               <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> Productos
               </h2>
               <div className="space-y-4">
                  {/* Since details are in JSON usually, we'd parse here. Mocking for now from total description if available */}
                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                     <span className="text-sm text-zinc-400">Ver detalles en el mensaje de WhatsApp</span>
                     <span className="font-black text-white">${parseFloat(order.total_amount).toLocaleString()}</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            {/* Customer */}
            <div className="p-8 rounded-[40px] border border-white/5 glass bg-zinc-900/50 space-y-6">
               <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Cliente
               </h2>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <Phone className="w-4 h-4 text-zinc-600" />
                     <span className="text-sm font-bold text-white">{order.customer_phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <MapPin className="w-4 h-4 text-zinc-600" />
                     <span className="text-xs text-zinc-400">{order.customer_address || 'Retiro en tienda'}</span>
                  </div>
               </div>
            </div>

            {/* Logistics */}
            <div className="p-8 rounded-[40px] border border-white/5 glass bg-zinc-900/50 space-y-6">
               <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" /> Logística
               </h2>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[10px] font-black text-zinc-500 uppercase">Costo envío</p>
                  <p className="text-xl font-black text-white">${parseFloat(order.shipping_cost || 0).toLocaleString()}</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
   const styles: any = {
      'PENDING': { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
      'ACCEPTED': { color: 'text-primary', bg: 'bg-primary/10', icon: CheckCircle2 },
      'DELIVERING': { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: AlertCircle },
      'COMPLETED': { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2 },
      'CANCELLED': { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle },
   };

   const s = styles[status] || styles['PENDING'];
   const Icon = s.icon;

   return (
      <span className={`inline-flex items-center gap-2 px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-tighter ${s.bg} ${s.color}`}>
         <Icon className="w-4 h-4" />
         {status}
      </span>
   );
}
