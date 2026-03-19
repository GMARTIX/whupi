"use client";

import { useState, useEffect, use } from "react";
import { 
  ShoppingBag, 
  MapPin, 
  Store, 
  Plus, 
  Minus,
  Loader2, 
  Package, 
  ArrowRight,
  ChevronLeft,
  Search,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";
import MapPicker from "@/components/shared/MapPicker";

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [merchant, setMerchant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deliveryType, setDeliveryType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [shippingCost, setShippingCost] = useState(0);
  const [customerPos, setCustomerPos] = useState<{lat: number, lng: number} | null>(null);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "" });

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
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
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
    setCustomerPos({ lat, lng });
    setOrderForm(prev => ({ ...prev, address }));
    calculateShipping(lat, lng);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalShipping = deliveryType === "DELIVERY" ? shippingCost : 0;
  const total = subtotal + finalShipping;

  const handleWhatsAppOrder = () => {
    const itemsText = cart.map(item => `- ${item.quantity}x ${item.name}`).join('%0A');
    const deliveryText = deliveryType === "DELIVERY" 
      ? `🛵 Envío a: ${orderForm.address}%0A💰 Costo Envío: $${shippingCost}` 
      : `🏪 Retiro en local`;
    
    const message = `¡Hola! Quiero hacer un pedido:%0A%0A${itemsText}%0A%0A${deliveryText}%0A⭐ Total: $${total}%0A%0A👤 Nombre: ${orderForm.name}`;
    window.open(`https://wa.me/${merchant?.whatsapp_number?.replace(/\+/g, '')}?text=${message}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-950"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-40">
      {/* Header Premium */}
      <div className="relative h-64 bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
        {merchant?.logo_url ? (
          <img src={merchant.logo_url} className="w-full h-full object-cover opacity-40 blur-sm" />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
            <Store className="w-20 h-20 text-white/5" />
          </div>
        )}
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
           <div className="w-32 h-32 rounded-[40px] bg-zinc-900 border-4 border-zinc-950 shadow-2xl flex items-center justify-center overflow-hidden">
              {merchant?.logo_url ? <img src={merchant.logo_url} className="w-full h-full object-cover" /> : <ShoppingBag className="w-12 h-12 text-primary" />}
           </div>
        </div>
      </div>

      <div className="mt-16 text-center space-y-2">
         <h1 className="text-4xl font-black uppercase tracking-widest">{merchant?.store_name}</h1>
         <div className="flex items-center justify-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1 text-green-500"><CheckCircle2 className="w-3 h-3" /> ABIERTO</span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1 text-zinc-400"><Clock className="w-3 h-3" /> 15-30 MIN</span>
         </div>
      </div>

      <div className="max-w-xl mx-auto p-6 mt-8 space-y-4">
        <h2 className="text-xl font-black px-2">Categorías</h2>
        <div className="grid grid-cols-1 gap-4">
          {products.map(p => (
            <div key={p.id} className="p-4 rounded-[32px] border border-white/5 glass bg-zinc-900/40 flex items-center justify-between group">
               <div className="flex items-center gap-4">
                 <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-white/5 overflow-hidden">
                   {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-zinc-700 m-7" />}
                 </div>
                 <div className="space-y-1">
                   <h3 className="font-bold text-lg">{p.name}</h3>
                   <p className="text-xs text-zinc-500 line-clamp-1">{p.description}</p>
                   <p className="text-primary font-black text-xl">${p.price}</p>
                 </div>
               </div>
               <button onClick={() => addToCart(p)} className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-90 transition-all">
                 <Plus className="w-6 h-6" />
               </button>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md z-50">
          <button 
            onClick={() => setShowCheckout(true)}
            className="w-full h-20 rounded-[35px] bg-primary text-white flex items-center justify-between px-8 shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
               <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">{cart.reduce((a, b) => a + b.quantity, 0)}</div>
               <span className="font-black uppercase tracking-tighter text-lg">Ver mi pedido</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-2xl font-black">${subtotal}</span>
               <ArrowRight className="w-6 h-6" />
            </div>
          </button>
        </div>
      )}

      {/* Checkout Sheet */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-zinc-900 rounded-t-[50px] border-t border-white/10 p-8 space-y-8 animate-in slide-in-from-bottom-full duration-500 max-h-[95vh] overflow-y-auto pb-12">
            <div className="flex items-center justify-between sticky top-0 bg-zinc-900 py-2 z-10">
              <h2 className="text-3xl font-black">Finalizar Pedido</h2>
              <button onClick={() => setShowCheckout(false)} className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold text-zinc-500 hover:text-white">Cerrar</button>
            </div>

            <div className="space-y-3">
               {cart.map(item => (
                 <div key={item.id} className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4 text-lg">
                      <span className="font-black text-primary">{item.quantity}x</span>
                      <span className="font-bold">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><Minus className="w-4 h-4" /></button>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><Plus className="w-4 h-4" /></button>
                      </div>
                      <span className="font-black text-lg">${item.price * item.quantity}</span>
                    </div>
                 </div>
               ))}
            </div>

            <div className="space-y-6 pt-4">
               <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 px-2">¿Cómo recibes tu pedido?</p>
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => setDeliveryType("DELIVERY")}
                        className={`py-5 rounded-3xl border-2 font-black transition-all ${deliveryType === "DELIVERY" ? 'border-primary bg-primary/10 text-white' : 'border-white/5 text-zinc-600'}`}
                     >ENVÍO</button>
                     <button 
                        onClick={() => setDeliveryType("PICKUP")}
                        className={`py-5 rounded-3xl border-2 font-black transition-all ${deliveryType === "PICKUP" ? 'border-primary bg-primary/10 text-white' : 'border-white/5 text-zinc-600'}`}
                     >RETIRO</button>
                  </div>
               </div>

               {deliveryType === "DELIVERY" && (
                 <div className="space-y-4 animate-in fade-in duration-500">
                    <MapPicker 
                      initialCenter={{ lat: Number(merchant?.lat) || -51.62198, lng: Number(merchant?.lng) || -69.21334 }} 
                      onLocationSelect={handleLocationSelect} 
                    />
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Referencia de Domicilio</label>
                       <input 
                         required
                         value={orderForm.address}
                         onChange={e => setOrderForm({...orderForm, address: e.target.value})}
                         placeholder="Piso, Depto, Color de casa..."
                         className="w-full px-6 py-4 rounded-3xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all"
                       />
                    </div>
                 </div>
               )}

               <div className="space-y-4 pt-4 border-t border-white/5">
                  <input 
                    placeholder="Tu nombre completo"
                    value={orderForm.name}
                    onChange={e => setOrderForm({...orderForm, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-3xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all"
                  />
                  <input 
                    placeholder="Número de WhatsApp"
                    value={orderForm.phone}
                    onChange={e => setOrderForm({...orderForm, phone: e.target.value})}
                    className="w-full px-6 py-4 rounded-3xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all"
                  />
               </div>

               <div className="bg-black/40 p-8 rounded-[40px] border border-white/5 space-y-4">
                  <div className="flex justify-between text-zinc-500 font-bold">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  {deliveryType === "DELIVERY" && (
                    <div className="flex justify-between text-primary font-bold">
                      <span>Costo de Envío</span>
                      <span>+ ${shippingCost}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-3xl font-black text-white pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
               </div>

               <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full py-6 bg-primary text-white font-black rounded-[35px] shadow-2xl shadow-primary/40 hover:scale-[1.01] active:scale-95 transition-all text-xl"
               >
                  REALIZAR PEDIDO
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
