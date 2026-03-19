"use client";

import { useState, useEffect, use, useRef } from "react";
import { 
  ShoppingBag, 
  MapPin, 
  Store, 
  Plus, 
  Minus,
  Loader2, 
  Package, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Search
} from "lucide-react";
import MapPicker from "@/components/shared/MapPicker";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [merchant, setMerchant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deliveryType, setDeliveryType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [shippingCost, setShippingCost] = useState(0);
  const [customerPos, setCustomerPos] = useState<{lat: number, lng: number}>({ lat: -51.621, lng: -69.213 });
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "" });
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES
  });

  useEffect(() => {
    const loadStore = async () => {
      try {
        const [mRes, pRes] = await Promise.all([
          fetch(`/api/merchants/${id}`),
          fetch(`/api/products?merchantId=${id}`)
        ]);
        const mData = await mRes.json();
        const pData = await pRes.json();
        setMerchant(mData);
        setProducts(Array.isArray(pData) ? pData : []);
        if (mData.lat && mData.lng) {
          setCustomerPos({ lat: Number(mData.lat), lng: Number(mData.lng) });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadStore();
  }, [id]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing?.quantity === 1) return prev.filter(item => item.id !== productId);
      return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const calculateShipping = (custLat: number, custLng: number) => {
    if (!merchant?.lat || !merchant?.lng) return;
    
    const R = 6371e3; // metres
    const φ1 = merchant.lat * Math.PI/180;
    const φ2 = custLat * Math.PI/180;
    const Δφ = (custLat - merchant.lat) * Math.PI/180;
    const Δλ = (custLng - merchant.lng) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceMeters = R * c;

    const baseCost = Number(merchant.base_shipping_cost) || 1400;
    const per100m = 90;
    const extraCost = (distanceMeters / 100) * per100m;
    setShippingCost(Math.round(baseCost + extraCost));
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    console.log("Location selected:", lat, lng, address);
    setCustomerPos({ lat, lng });
    setOrderForm(prev => ({ ...prev, address }));
    calculateShipping(lat, lng);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || "";
        handleLocationSelect(lat, lng, address);
      }
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalShipping = deliveryType === "DELIVERY" ? shippingCost : 0;
  const total = subtotal + finalShipping;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-950"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-40">
      <div className="relative h-48 bg-zinc-900 flex items-center justify-center border-b border-white/5">
         <div className="text-center">
            <h1 className="text-3xl font-black uppercase tracking-widest">{merchant?.store_name}</h1>
            <p className="text-zinc-500 text-xs mt-1 flex items-center gap-1 justify-center"><Clock className="w-3 h-3" /> Abierto ahora • 15-30 min</p>
         </div>
      </div>

      <div className="max-w-xl mx-auto p-6 space-y-4">
        {products.map(p => (
          <div key={p.id} className="p-4 rounded-[32px] border border-white/5 glass bg-zinc-900/40 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/5 overflow-hidden">
                 {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-zinc-700 m-5" />}
               </div>
               <div>
                 <h3 className="font-bold">{p.name}</h3>
                 <p className="text-primary font-black">${p.price}</p>
               </div>
             </div>
             <button onClick={() => addToCart(p)} className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg"><Plus className="w-5 h-5" /></button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md z-50">
          <button onClick={() => setShowCheckout(true)} className="w-full h-20 rounded-[35px] bg-primary text-white flex items-center justify-between px-8 shadow-2xl">
            <span className="font-black">VER MI PEDIDO</span>
            <span className="text-2xl font-black">${subtotal}</span>
          </button>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="w-full max-w-lg bg-zinc-900 rounded-[40px] p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black">Finalizar Pedido</h2>
              <button onClick={() => setShowCheckout(false)} className="text-zinc-500 text-sm">Cerrar</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setDeliveryType("DELIVERY")} className={`py-4 rounded-3xl border-2 font-black ${deliveryType === "DELIVERY" ? 'border-primary bg-primary/10' : 'border-white/5 text-zinc-600'}`}>ENVÍO</button>
               <button onClick={() => setDeliveryType("PICKUP")} className={`py-4 rounded-3xl border-2 font-black ${deliveryType === "PICKUP" ? 'border-primary bg-primary/10' : 'border-white/5 text-zinc-600'}`}>RETIRO</button>
            </div>

            {deliveryType === "DELIVERY" && isLoaded && (
              <div className="space-y-4 animate-in fade-in">
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
                  <Autocomplete
                    onLoad={auto => autocompleteRef.current = auto}
                    onPlaceChanged={onPlaceChanged}
                  >
                    <input 
                      placeholder="Escribe tu dirección..."
                      className="w-full pl-14 pr-6 py-4 rounded-3xl bg-white/5 border border-white/10 outline-none focus:border-primary text-white"
                      value={orderForm.address}
                      onChange={e => setOrderForm({...orderForm, address: e.target.value})}
                    />
                  </Autocomplete>
                </div>
                
                <MapPicker center={customerPos} onLocationSelect={handleLocationSelect} />

                <div className="flex justify-between items-center p-6 bg-primary/10 rounded-3xl border border-primary/20">
                   <span className="text-sm font-bold opacity-60">COSTO DE ENVÍO</span>
                   <span className="text-2xl font-black text-primary">${shippingCost}</span>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-white/5">
                <input placeholder="Tu nombre" className="w-full px-6 py-4 rounded-3xl bg-white/5 border border-white/10" value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} />
                <input placeholder="WhatsApp" className="w-full px-6 py-4 rounded-3xl bg-white/5 border border-white/10" value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} />
                <div className="flex justify-between items-center text-2xl font-black pt-4">
                   <span>TOTAL</span>
                   <span>${total}</span>
                </div>
                <button className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl">PEDIR POR WHATSAPP</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
