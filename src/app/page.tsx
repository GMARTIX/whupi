"use client";

import { MapPin, ShoppingBag, Truck, Smartphone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      {/* Navbar Minimalista */}
      <nav className="w-full max-w-7xl flex items-center justify-between p-6 z-50">
        <div className="text-2xl font-black tracking-widest text-white">WHUPI</div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-zinc-400 hover:text-white font-bold transition-colors">Entrar</Link>
          <Link href="/register" className="bg-primary text-white px-6 py-2 rounded-xl font-black hover:bg-blue-600 transition-all shadow-lg shadow-primary/20">Crear cuenta</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center mt-20 px-4"
      >
        <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium border rounded-full glass border-white/10 text-primary">
          <span className="flex w-2 h-2 mr-2 rounded-full bg-primary animate-pulse" />
          Whupi.shop está llegando
        </div>
        
        <h1 className="mb-6 text-6xl font-black tracking-tight sm:text-8xl">
          <span className="text-white">El mayor invento de</span> <br />
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent italic">la humanidad</span>
        </h1>
        
        <p className="mb-10 text-xl leading-relaxed text-zinc-400 max-w-2xl mx-auto">
          Transformamos el caos del WhatsApp en una plataforma logística premium. 
          Envíos rápidos para comercios, gestión inteligente para cadetes y tracking real para clientes.
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <button className="px-10 py-5 font-black text-white transition-all bg-primary rounded-2xl hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-2xl shadow-primary/40">
            Comenzar ahora
          </button>
          <button className="px-10 py-5 font-bold text-white transition-all border rounded-2xl glass border-white/10 hover:bg-white/5">
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
