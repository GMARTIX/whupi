"use client";

import { useState, useEffect, use } from "react";
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Search, 
  ShoppingBasket,
  ArrowRight,
  Package,
  Loader2,
  MapPin,
  Phone
} from "lucide-react";

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    fetch(`/api/products?merchantId=${id}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
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
      if (existing?.quantity === 1) {
        return prev.filter(item => item.id !== productId);
      }
      return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Create Order
    const orderRes = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: id,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        total_amount: cartTotal,
        payment_method: "CASH",
        items: cart.map(item => ({ id: item.id, quantity: item.quantity, price: item.price }))
      })
    });
    
    const orderData = await orderRes.json();
    
    if (orderData.success) {
      // Redirect to tracking page
      window.location.href = `/track/${orderData.id}`;
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pb-32">
      {/* Dynamic Header */}
      <div className="p-8 bg-gradient-to-b from-primary/10 to-transparent flex flex-col items-center border-b border-white/5">
        <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-primary/30 flex items-center justify-center mb-4 overflow-hidden">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-widest text-white">Lodejacinto</h1>
        <p className="text-zinc-500 text-xs font-bold mt-1">Abierto ahora • Envío Express</p>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map(product => (
            <div key={product.id} className="p-4 rounded-3xl border border-white/5 glass bg-zinc-900/40 hover:border-primary/20 transition-all flex gap-4 group">
              <div className="w-24 h-24 rounded-2xl bg-zinc-800 flex-shrink-0 border border-white/5 overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700">
                    <Package className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-white group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-black text-white">${product.price}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-lg z-50 animate-in slide-in-from-bottom-8 duration-500">
          <button 
            onClick={() => setShowCheckout(true)}
            className="w-full p-4 rounded-3xl bg-primary text-white flex items-center justify-between shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 px-3 py-1 rounded-full font-black text-xs">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </div>
              <span className="font-black uppercase tracking-widest text-sm">Ver mi Pedido</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl">${cartTotal}</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* Checkout Sheet */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-zinc-900 rounded-t-[40px] border-t border-white/10 p-8 space-y-8 animate-in slide-in-from-bottom-full duration-500 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Finalizar Pedido</h2>
              <button onClick={() => setShowCheckout(false)} className="p-2 text-zinc-500">Ocultar</button>
            </div>

            <div className="space-y-4">
               {cart.map(item => (
                 <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <span className="font-black text-primary text-lg">{item.quantity}x</span>
                      <span className="font-bold text-white">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeFromCart(item.id)} className="p-1 text-zinc-500 hover:text-white"><Minus className="w-4 h-4" /></button>
                      <span className="font-black">${item.price * item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="p-1 text-zinc-500 hover:text-white"><Plus className="w-4 h-4" /></button>
                    </div>
                 </div>
               ))}
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Nombre Completo</label>
                <div className="relative">
                  <input 
                    required 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary transition-all outline-none"
                    placeholder="¿A quién le entregamos?"
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Domicilio de Entrega</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <input 
                    required 
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary transition-all outline-none"
                    placeholder="Calle, Número, Departamento..."
                    value={customerInfo.address}
                    onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">WhatsApp / Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <input 
                    required 
                    type="tel"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary transition-all outline-none"
                    placeholder="Tu celular para avisarte"
                    value={customerInfo.phone}
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-primary text-white font-black rounded-3xl mt-4 shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>CONFIRMAR PEDIDO ${cartTotal}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
