"use client";

import { useState, useEffect } from "react";
import { 
  Bike, 
  Package, 
  MapPin, 
  DollarSign, 
  Loader2, 
  CheckCircle2, 
  PhoneCall,
  Navigation
} from "lucide-react";
import Link from "next/link";

export default function RiderDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling cada 10s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        const available = Array.isArray(data) ? data.filter(o => o.status === 'PENDING') : [];
        const active = Array.isArray(data) ? data.find(o => o.status === 'ACCEPTED' || o.status === 'PICKED_UP') : null;
        
        setOrders(available);
        setCurrentOrder(active);
        setLoading(false);
      });
  };

  const handleAccept = async (orderId: string) => {
    setLoading(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACCEPTED", riderId: "r-pedro" })
    });
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    setLoading(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8 max-w-lg mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Hola, Pedro</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Rider Premium</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase">
          Online
        </div>
      </div>

      {currentOrder ? (
        /* Active Order View */
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 rounded-3xl border border-primary/20 glass bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-lg bg-primary text-[10px] font-bold text-white uppercase">Pedido Activo</span>
              <span className="text-sm font-bold text-white">#{currentOrder.id.slice(0, 4)}</span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="mt-1"><MapPin className="w-4 h-4 text-primary" /></div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Destino</p>
                  <p className="text-sm text-white font-medium">{currentOrder.customer_address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><DollarSign className="w-4 h-4 text-green-500" /></div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Cobrar al Cliente</p>
                  <p className="text-lg text-white font-bold">${currentOrder.total_amount}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm">
                <PhoneCall className="w-4 h-4" /> Llamar
              </button>
              <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm">
                <Navigation className="w-4 h-4" /> Mapa
              </button>
            </div>
            
            <button 
              onClick={() => handleUpdateStatus(currentOrder.id, currentOrder.status === 'ACCEPTED' ? 'PICKED_UP' : 'DELIVERED')}
              className="w-full mt-4 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20"
            >
              {currentOrder.status === 'ACCEPTED' ? "Marcar Retirado" : "Confirmar Entrega"}
            </button>
          </div>
        </div>
      ) : (
        /* Available Orders List */
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">Pedidos Disponibles</h2>
          
          {loading ? (
             <div className="flex justify-center p-12">
               <Loader2 className="w-6 h-6 animate-spin text-primary" />
             </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center glass rounded-2xl border border-white/5 space-y-4">
              <Package className="w-12 h-12 text-zinc-800 mx-auto" />
              <p className="text-zinc-500 text-sm">Esperando nuevos pedidos en tu zona...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-6 rounded-3xl border border-white/5 glass hover:border-white/10 transition-all space-y-4 group animate-in slide-in-from-right-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Distancia aprox. 1.2km</p>
                      <p className="text-white font-bold text-lg">{order.customer_address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[20px] font-black text-primary">${order.total_amount}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Cobro</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAccept(order.id)}
                    className="w-full py-4 bg-white/5 group-hover:bg-primary transition-all text-white font-bold rounded-2xl border border-white/10 group-hover:border-primary shadow-lg shadow-black/20"
                  >
                    ACEPTAR PEDIDO
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-20 glass border-t border-white/5 px-8 flex items-center justify-around z-50 max-w-lg mx-auto">
        <button className="text-primary"><Bike className="w-6 h-6" /></button>
        <button className="text-zinc-500"><CheckCircle2 className="w-6 h-6" /></button>
        <button className="text-zinc-500"><PhoneCall className="w-6 h-6" /></button>
      </div>
    </div>
  );
}
