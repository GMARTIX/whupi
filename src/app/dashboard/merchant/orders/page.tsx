"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Historial de Pedidos</h1>
          <p className="text-zinc-500 mt-1">Consulta y gestiona todos tus envíos realizados.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                placeholder="Buscar pedido..."
                className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2 text-sm text-white outline-none focus:border-primary transition-all w-64"
              />
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-zinc-400 hover:text-white transition-all">
              <Filter className="w-4 h-4" /> Filtrar
           </button>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-white/5 rounded-[32px] overflow-hidden glass">
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Acción</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {loading ? (
                  <tr>
                     <td colSpan={6} className="py-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                     </td>
                  </tr>
               ) : orders.length === 0 ? (
                  <tr>
                     <td colSpan={6} className="py-20 text-center text-zinc-500">No hay pedidos registrados.</td>
                  </tr>
               ) : (
                  orders.map(order => (
                     <tr key={order.id} className="hover:bg-white/5 transition-all group">
                        <td className="px-8 py-5">
                           <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">#{order.id.slice(0,6)}</span>
                        </td>
                        <td className="px-8 py-5">
                           <p className="text-sm font-bold text-white">{order.customer_phone}</p>
                           <p className="text-[10px] text-zinc-500">{order.customer_name || 'Sin nombre'}</p>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2 text-xs text-zinc-400">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.created_at).toLocaleDateString()}
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-sm font-black text-white">${parseFloat(order.total_amount).toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-5">
                           <StatusBadge status={order.status} />
                        </td>
                        <td className="px-8 py-5 text-right">
                           <Link href={`/dashboard/merchant/orders/${order.id}`} className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-all">
                              Ver Detalle <ChevronRight className="w-3 h-3" />
                           </Link>
                        </td>
                     </tr>
                  ))
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
   const styles: any = {
      'PENDING': { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
      'DELIVERING': { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: AlertCircle },
      'COMPLETED': { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2 },
      'CANCELLED': { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle },
   };

   const s = styles[status] || styles['PENDING'];
   const Icon = s.icon;

   return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${s.bg} ${s.color}`}>
         <Icon className="w-3 h-3" />
         {status}
      </span>
   );
}
