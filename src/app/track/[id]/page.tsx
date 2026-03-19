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
  TrendingUp,
  Store
} from "lucide-react";
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions = {
  disableDefaultUI: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
};

export default function TrackingPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  useEffect(() => {
    const pollTracking = setInterval(() => {
      fetch(`/api/track/${id}`)
        .then(res => res.json())
        .then(resData => {
          setData(resData);
          setLoading(false);
        })
        .catch(err => console.error(err));
    }, 10000); // Poll cada 10s

    return () => clearInterval(pollTracking);
  }, [id]);

  if (loading || !data) return (
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

  const currentIdx = statuses.findIndex(s => s.key === data.status);

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
            Orden #{data.id.slice(0,6)}
         </span>
      </div>

      <main className="p-6 space-y-8 max-w-lg mx-auto pb-40">
         {/* Map Section */}
         <div className="w-full h-80 rounded-[40px] border border-white/5 bg-zinc-900/50 glass relative overflow-hidden shadow-2xl shadow-primary/5">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={data.rider_location || data.customer_location || { lat: -51.621, lng: -69.217 }}
                zoom={14}
                options={mapOptions}
              >
                {/* Rider Marker */}
                {data.rider_location && (
                  <MarkerF 
                    position={data.rider_location}
                    icon={{
                      url: 'https://cdn-icons-png.flaticon.com/512/3198/3198336.png', // Moto icon
                      scaledSize: { width: 40, height: 40 } as any
                    }}
                  />
                )}
                
                {/* Destination Marker */}
                {data.customer_location && (
                  <MarkerF 
                    position={data.customer_location}
                    icon={{
                      url: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Pin icon
                      scaledSize: { width: 30, height: 30 } as any
                    }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-700" />
              </div>
            )}

            <div className="absolute bottom-6 left-6 right-6 glass p-4 rounded-3xl border border-white/10 flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Tu ubicación</p>
                  <p className="text-xs font-bold text-white truncate">{data.customer_address || 'Dirección no especificada'}</p>
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

      {/* Floating Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-8 glass-dark border-t border-white/5 z-50">
         <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center">
                  {data.rider_location ? (
                    <img src="https://ui-avatars.com/api/?name=Rider&background=0066FF&color=fff" className="w-full h-full object-cover" alt="Rider" />
                  ) : (
                    <Bike className="w-6 h-6 text-zinc-500" />
                  )}
               </div>
               <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Whupi Rider</p>
                  <p className="text-sm font-black text-white">{data.rider_location ? 'En camino' : 'Buscando...'}</p>
               </div>
            </div>
            <a 
              href={`https://wa.me/${data.customer_phone}`} 
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-tighter hover:bg-white/10 transition-all flex items-center gap-2"
            >
               Ayuda <ChevronRight className="w-4 h-4 text-zinc-500" />
            </a>
         </div>
      </div>
    </div>
  );
}
