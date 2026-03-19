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
  Phone
} from "lucide-react";
import MapPicker from "@/components/shared/MapPicker";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

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

  // We only call this ONCE in the entire application tree for this page
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script', // Fixed ID to prevent multiple injections
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

  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TRANSFER" | "MP">("CASH");

  const calculateShipping = (custLat: number, custLng: number) => {
    if (!merchant?.lat || !merchant?.lng || !window.google) return;
    
    const origin = new google.maps.LatLng(Number(merchant.lat), Number(merchant.lng));
    const destination = new google.maps.LatLng(custLat, custLng);
    const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(origin, destination);

    const baseCost = Number(merchant.base_shipping_cost) || 1400;
    const per100m = 90;
    const rawCost = baseCost + (distanceMeters / 100) * per100m;
    
    // REDONDEO: Siempre hacia arriba al centenar más cercano
    const roundedCost = Math.ceil(rawCost / 100) * 100;
    setShippingCost(roundedCost);
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
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

  const handleWhatsAppOrder = () => {
    const itemsText = cart.map(item => `- ${item.quantity}x ${item.name}`).join('%0A');
    const deliveryText = deliveryType === "DELIVERY" 
      ? `🛵 Envío a: ${orderForm.address}%0A💰 Costo Envío: $${shippingCost}` 
      : `🏪 Retiro en local`;
    const paymentOptions: any = { "CASH": "💵 Efectivo", "TRANSFER": "🏦 Transferencia", "MP": "💳 Mercado Pago" };
    let paymentText = `💳 Pago: ${paymentOptions[paymentMethod]}`;
    
    if (paymentMethod === "TRANSFER" || paymentMethod === "MP") {
      const bankInfo = `%0A%0A📌 *Datos de Pago:*%0AAlias: ${merchant?.bank_alias || 'N/A'}%0A${merchant?.bank_details || ''}%0A%0A⚠️ *Por favor envía el comprobante por aquí para confirmar tu pedido.*`;
      paymentText += bankInfo;
    }

    const message = `¡Hola! Quiero hacer un pedido:%0A%0A${itemsText}%0A%0A${deliveryText}%0A${paymentText}%0A%0A⭐ Total: $${total}%0A%0A👤 Nombre: ${orderForm.name}%0A📱 Tel: +54 9 ${orderForm.phone}`;
    const cleanNumber = (merchant?.whatsapp_number || "5492966227301").replace(/\D/g, "");
    
    // Guardar en base de datos primero
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: id,
        customer_phone: orderForm.phone,
        customer_address: orderForm.address,
        total_amount: total,
        payment_method: paymentMethod,
        items: cart.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))
      })
    });

    window.open(`https://wa.me/${cleanNumber}?text=${message}`);
  };

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
          <div className="w-full max-w-lg bg-zinc-900 rounded-[40px] p-8 space-y-6 max-h-[90vh] overflow-y-auto pb-12">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black">Finalizar Pedido</h2>
              <button onClick={() => setShowCheckout(false)} className="text-zinc-500 text-sm">Cerrar</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setDeliveryType("DELIVERY")} className={`py-4 rounded-3xl border-2 font-black transition-all ${deliveryType === "DELIVERY" ? 'border-primary bg-primary/10 text-white' : 'border-white/5 text-zinc-600'}`}>ENVÍO</button>
               <button onClick={() => setDeliveryType("PICKUP")} className={`py-4 rounded-3xl border-2 font-black transition-all ${deliveryType === "PICKUP" ? 'border-primary bg-primary/10 text-white' : 'border-white/5 text-zinc-600'}`}>RETIRO</button>
            </div>

            {deliveryType === "DELIVERY" && (
              <div className="space-y-4 animate-in fade-in">
                {loadError ? (
                  <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl text-xs text-center">
                     Error al cargar Mapas. Por favor verifica las credenciales.
                  </div>
                ) : !isLoaded ? (
                  <div className="h-48 flex flex-col items-center justify-center bg-zinc-800/50 rounded-[32px] border border-white/5 gap-3">
                     <Loader2 className="w-8 h-8 animate-spin text-primary" />
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cargando Mapa...</p>
                  </div>
                ) : (
                  <>
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
                       <span className="text-sm font-bold opacity-60 uppercase tracking-tighter">Costo de Envío</span>
                       <span className="text-2xl font-black text-primary">${shippingCost}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-white/5">
                <input 
                  placeholder="Tu nombre completo" 
                  className="w-full px-6 py-4 rounded-3xl bg-white/5 border border-white/10 focus:border-primary outline-none" 
                  value={orderForm.name} 
                  onChange={e => setOrderForm({...orderForm, name: e.target.value})} 
                />
                
                <div className="flex gap-3">
                   <div className="flex items-center gap-2 px-5 bg-white/5 border border-white/10 rounded-3xl">
                      <span className="text-xl">🇦🇷</span>
                      <span className="font-bold text-xs text-zinc-400">+54 9</span>
                   </div>
                   <input 
                      placeholder="WhatsApp (ej: 2966123456)"
                      value={orderForm.phone}
                      onChange={e => setOrderForm({...orderForm, phone: e.target.value})}
                      className="flex-1 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all"
                   />
                </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">¿Cómo quieres pagar?</p>
                  <div className="grid grid-cols-1 gap-3">
                     {merchant?.accepts_cash && (
                       <button 
                          onClick={() => setPaymentMethod("CASH")}
                          className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${paymentMethod === "CASH" ? 'border-primary bg-primary/10' : 'border-white/5 opacity-40'}`}
                       >
                         <span className="font-black">EFECTIVO</span>
                         {paymentMethod === "CASH" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                       </button>
                     )}
                     {merchant?.accepts_transfer && (
                       <button 
                          onClick={() => setPaymentMethod("TRANSFER")}
                          className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${paymentMethod === "TRANSFER" ? 'border-primary bg-primary/10' : 'border-white/5 opacity-40'}`}
                       >
                         <span className="font-black">TRANSFERENCIA</span>
                         {paymentMethod === "TRANSFER" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                       </button>
                     )}
                     {merchant?.accepts_mercadopago && (
                       <button 
                          onClick={() => setPaymentMethod("MP")}
                          className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${paymentMethod === "MP" ? 'border-primary bg-primary/10' : 'border-white/5 opacity-40'}`}
                       >
                         <span className="font-black">MERCADO PAGO</span>
                         {paymentMethod === "MP" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                       </button>
                     )}
                  </div>
               </div>

               <div className="bg-black/40 p-6 rounded-[35px] border border-white/5 space-y-2">
                   <div className="flex justify-between items-center text-sm text-zinc-500">
                      <span>Subtotal</span>
                      <span>${subtotal}</span>
                   </div>
                   {deliveryType === "DELIVERY" && (
                    <div className="flex justify-between items-center text-sm text-primary">
                       <span>Envío</span>
                       <span>+ ${shippingCost}</span>
                    </div>
                   )}
                   <div className="flex justify-between items-center text-2xl font-black pt-2 border-t border-white/10 mt-2">
                      <span>TOTAL</span>
                      <span>${total}</span>
                   </div>
                </div>

                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full py-5 bg-primary text-white font-black rounded-[30px] shadow-xl hover:scale-[1.01] active:scale-95 transition-all text-lg"
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
