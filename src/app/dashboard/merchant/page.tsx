"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Map as MapIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Loader2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function MerchantDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  const totalEarnings = orders.reduce((acc, o) => acc + parseFloat(o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome & Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hola, Lodejacinto</h1>
          <p className="text-zinc-500 mt-1">Aquí tienes el resumen de tus envíos de hoy.</p>
        </div>
        <Link 
          href="/dashboard/merchant/new-order"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Nuevo Envío
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Envíos Hoy" value={orders.length.toString()} icon={<TrendingUp className="text-green-500" />} trend="Total hoy" />
        <StatCard title="Riders Activos" value="1" icon={<Users className="text-blue-500" />} trend="En tu zona" />
        <StatCard title="Ingresos" value={"$" + totalEarnings.toLocaleString()} icon={<DollarSign className="text-amber-500" />} trend="A liquidar" />
        <StatCard title="Pendientes" value={pendingOrders.toString()} icon={<Clock className="text-orange-500" />} trend="Urgente" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Pedidos Recientes</h2>
            <Link href="/dashboard/merchant/orders" className="text-sm text-primary hover:underline font-medium">Ver todos</Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center p-12 glass rounded-2xl border border-white/5">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center glass rounded-2xl border border-white/5">
                <p className="text-sm text-zinc-500">No hay pedidos registrados.</p>
              </div>
            ) : (
              orders.map((order: any) => (
                <Link key={order.id} href={`/dashboard/merchant/orders/${order.id}`}>
                  <OrderRow 
                    id={`#${order.id.slice(0,4)}`} 
                    status={order.status} 
                    customer={order.customer_phone} 
                  />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Live Map Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Seguimiento en Vivo</h2>
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <MapIcon className="w-4 h-4" />
              <span>Mapa Fullscreen</span>
            </div>
          </div>
          
          <div className="w-full h-[450px] rounded-3xl border border-white/5 bg-zinc-900/50 glass relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-68.303,-54.806,12/800x450?access_token=none')] bg-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 py-4 glass rounded-2xl border border-white/10 text-white font-medium flex flex-col items-center gap-4 text-center max-w-xs">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-sm">Configura tu Google Maps API Key para activar el rastreo en tiempo real.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="p-6 rounded-2xl border border-white/5 glass hover:border-white/10 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase">{trend}</span>
      </div>
      <p className="text-sm text-zinc-500">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-primary transition-colors">{value}</h3>
    </div>
  );
}

function OrderRow({ id, status, customer }: { id: string, status: string, customer: string }) {
  return (
    <div className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-500 group-hover:bg-primary/20 group-hover:text-primary transition-all">
          {id}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{customer}</p>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {status}
          </div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-all" />
    </div>
  );
}
