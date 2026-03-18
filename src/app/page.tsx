"use client";

import { MapPin, ShoppingBag, Truck, Smartphone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium border rounded-full glass border-white/10 text-primary">
          <span className="flex w-2 h-2 mr-2 rounded-full bg-primary animate-pulse" />
          Whupi.shop está llegando
        </div>
        
        <h1 className="mb-6 text-6xl font-bold tracking-tight text-white sm:text-7xl">
          El mayor invento de <br />
          <span className="text-primary italic">la humanidad</span>
        </h1>
        
        <p className="mb-10 text-lg leading-relaxed text-zinc-400">
          Transformamos el caos del WhatsApp en una plataforma logística premium. 
          Envíos rápidos para comercios, gestión inteligente para cadetes y tracking real para clientes.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="px-8 py-4 font-semibold text-white transition-all bg-primary rounded-xl hover:bg-blue-600 hover:scale-105 active:scale-95">
            Comenzar ahora
          </button>
          <button className="px-8 py-4 font-semibold text-white transition-all border rounded-xl glass border-white/10 hover:bg-white/5">
            Saber más
          </button>
        </div>
      </motion.div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 gap-6 mt-24 sm:grid-cols-3 max-w-5xl">
        <FeatureCard 
          icon={<ShoppingBag className="w-6 h-6" />}
          title="Para Comercios"
          description="Carga tus productos y gestiona tus envíos desde un portal web inteligente."
        />
        <FeatureCard 
          icon={<Smartphone className="w-6 h-6" />}
          title="Para Cadetes"
          description="Acepta pedidos con un clic, optimiza tus rutas y gana más dinero."
        />
        <FeatureCard 
          icon={<MapPin className="w-6 h-6" />}
          title="Para Clientes"
          description="Sigue tu envío en tiempo real y conoce el costo exacto al instante."
        />
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 text-left transition-all border glass rounded-2xl border-white/5 hover:border-white/10 group">
      <div className="flex items-center justify-center w-12 h-12 mb-6 transition-colors rounded-xl bg-white/5 text-primary group-hover:bg-primary group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm text-zinc-500 line-clamp-3">{description}</p>
    </div>
  );
}
