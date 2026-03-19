"use client";

import { useState, useEffect } from "react";
import { 
  Store, 
  MapPin, 
  Phone, 
  Image as ImageIcon, 
  Save, 
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag,
  AtSign,
  Truck,
  DollarSign,
  Bell,
  Trash2,
  Link as LinkIcon,
  Clock,
  ExternalLink
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [expandedSection, setExpandedSection] = useState<string | null>("business");

  const [merchant, setMerchant] = useState<any>({
    id: "m-lodejacinto",
    store_name: "",
    category: "",
    address: "",
    city: "",
    whatsapp_number: "",
    email: "",
    logo_url: "",
    base_shipping_cost: 1400,
    per_meter_cost: 0.9,
    accepts_cash: true,
    accepts_transfer: true,
    accepts_mercadopago: true,
    enable_delivery: true,
    enable_pickup: true,
    stock_display_mode: "SHOW",
    enable_tips: false,
    tip_percentage: 0,
    tax_mode: "NONE",
    notify_cash_drawer: false,
    sound_on_sale: true,
    service_hours: {}
  });

  useEffect(() => {
    fetch(`/api/merchants/${merchant.id}`)
      .then(res => res.json())
      .then(data => {
        setMerchant(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/merchants/${merchant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merchant)
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Configuraciones</h1>
          <p className="text-zinc-500 text-sm mt-1">Gestiona los detalles de tu negocio y la experiencia de tus clientes</p>
        </div>
        <div className="flex gap-4">
          <button className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'general' ? 'bg-primary text-white' : 'text-zinc-500 hover:text-white'}`} onClick={() => setActiveTab('general')}>General</button>
          <button className="px-6 py-2 rounded-full text-sm font-bold text-zinc-600 cursor-not-allowed">Tu plan</button>
          <button className="px-6 py-2 rounded-full text-sm font-bold text-zinc-600 cursor-not-allowed">Impresión</button>
        </div>
      </div>

      <div className="space-y-4 pb-20">
        
        {/* SECCION: DATOS DEL NEGOCIO */}
        <div className="rounded-[32px] border border-white/5 bg-zinc-900/30 overflow-hidden transition-all">
           <button onClick={() => toggleSection('business')} className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-xl font-bold text-white">Datos del negocio</h2>
                    <p className="text-zinc-500 text-xs">Nombre, dirección, categoría y contacto</p>
                 </div>
              </div>
              {expandedSection === 'business' ? <ChevronUp className="w-6 h-6 text-zinc-500" /> : <ChevronDown className="w-6 h-6 text-zinc-500" />}
           </button>
           
           {expandedSection === 'business' && (
              <div className="p-8 pt-0 border-t border-white/5 space-y-8 animate-in slide-in-from-top-4 duration-300">
                 <div className="flex items-center gap-8 py-6">
                    <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-primary cursor-pointer transition-all group">
                       <ImageIcon className="w-6 h-6 text-zinc-500 group-hover:text-primary" />
                       <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center px-2">Cargar logo</span>
                    </div>
                    <div className="flex-1 space-y-1">
                       <h3 className="font-bold text-white">Imagen de marca</h3>
                       <p className="text-zinc-500 text-xs">Se mostrará en tu tienda y tickets. Formato recomendado: PNG o JPG cuadrado.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Tipo de negocio*</label>
                       <select 
                         value={merchant.category || ""}
                         onChange={e => setMerchant({...merchant, category: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary transition-all appearance-none"
                       >
                          <option value="">Elige una categoría</option>
                          <option value="Restaurante">Restaurante</option>
                          <option value="Cafetería">Cafetería</option>
                          <option value="Indumentaria">Indumentaria</option>
                          <option value="Otros">Otros</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Nombre del negocio*</label>
                       <input 
                         value={merchant.store_name || ""}
                         onChange={e => setMerchant({...merchant, store_name: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Dirección del negocio</label>
                       <div className="relative">
                          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input 
                            placeholder="Escribe la dirección"
                            value={merchant.address || ""}
                            onChange={e => setMerchant({...merchant, address: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:border-primary transition-all"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Ciudad donde se ubica</label>
                       <input 
                         value={merchant.city || ""}
                         onChange={e => setMerchant({...merchant, city: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Número de celular</label>
                       <div className="flex gap-2">
                          <div className="flex items-center gap-2 px-4 bg-white/5 border border-white/10 rounded-2xl">
                             <span>🇦🇷</span>
                             <span className="text-sm font-bold">+54</span>
                          </div>
                          <input 
                            value={merchant.whatsapp_number || ""}
                            onChange={e => setMerchant({...merchant, whatsapp_number: e.target.value})}
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary transition-all"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Correo electrónico</label>
                       <div className="relative">
                          <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input 
                            placeholder="Escribe el correo"
                            value={merchant.email || ""}
                            onChange={e => setMerchant({...merchant, email: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:border-primary transition-all"
                          />
                       </div>
                    </div>
                 </div>
                 <div className="flex justify-end pt-4">
                    <button onClick={() => handleSave()} disabled={saving} className="bg-white/10 text-white px-8 py-3 rounded-2xl font-black hover:bg-white/20 transition-all flex items-center gap-2">
                       {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                       Guardar cambios
                    </button>
                 </div>
              </div>
           )}
        </div>

        {/* SECCION: CATALOGO VIRTUAL */}
        <div className="rounded-[32px] border border-white/5 bg-zinc-900/30 overflow-hidden transition-all">
           <button onClick={() => toggleSection('catalog')} className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Tag className="w-6 h-6 text-blue-500" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-xl font-bold text-white">Catálogo virtual</h2>
                    <p className="text-zinc-500 text-xs">Horarios, stock y link de tu tienda</p>
                 </div>
              </div>
              {expandedSection === 'catalog' ? <ChevronUp className="w-6 h-6 text-zinc-500" /> : <ChevronDown className="w-6 h-6 text-zinc-500" />}
           </button>

           {expandedSection === 'catalog' && (
              <div className="p-8 pt-0 border-t border-white/5 space-y-8 animate-in slide-in-from-top-4 duration-300">
                 
                 {/* Horarios Sub-section */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Clock className="w-5 h-5 text-zinc-600" />
                       <h3 className="font-bold text-white">Horarios de atención</h3>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                       {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                          <div key={day} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl bg-zinc-900/50">
                             <div className="flex items-center gap-3">
                                <input type="checkbox" className="w-5 h-5 accent-primary" />
                                <span className="text-sm font-bold">{day}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <input placeholder="12:00" className="w-16 bg-transparent text-center text-xs font-bold text-primary outline-none" />
                                <span className="text-zinc-700 text-xs">/</span>
                                <input placeholder="22:00" className="w-16 bg-transparent text-center text-xs font-bold text-primary outline-none" />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Stock Mode */}
                 <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3">
                       <Store className="w-5 h-5 text-zinc-600" />
                       <h3 className="font-bold text-white">Productos sin stock</h3>
                    </div>
                    <div className="space-y-3">
                       {[
                          { id: 'SHOW', label: 'Exhibir normalmente', desc: 'Los productos se verán igual aunque no tengan stock' },
                          { id: 'HIDE', label: 'No mostrar en el catálogo', desc: 'Los productos se ocultarán automáticamente' },
                          { id: 'UNAVAILABLE', label: 'Mostrar "No disponible"', desc: 'Aparecerá una etiqueta de Sin Stock' }
                       ].map(mode => (
                          <label key={mode.id} className={`flex items-start gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer ${merchant.stock_display_mode === mode.id ? 'border-primary bg-primary/10' : 'border-white/5 opacity-50 hover:opacity-80'}`}>
                             <input 
                               type="radio" 
                               name="stock_mode" 
                               checked={merchant.stock_display_mode === mode.id}
                               onChange={() => setMerchant({...merchant, stock_display_mode: mode.id})}
                               className="mt-1 w-5 h-5 accent-primary" 
                             />
                             <div>
                                <span className="font-black text-sm block">{mode.label}</span>
                                <span className="text-xs text-zinc-500">{mode.desc}</span>
                             </div>
                          </label>
                       ))}
                    </div>
                 </div>

                 {/* Store Link */}
                 <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3">
                       <LinkIcon className="w-5 h-5 text-zinc-600" />
                       <h3 className="font-bold text-white">URL del menú</h3>
                    </div>
                    <div className="space-y-4">
                       <div className="relative">
                          <input 
                            value={`whupi.shop/store/${merchant.id}`}
                            readOnly
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-zinc-500 pr-32 font-medium"
                          />
                          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 px-4 py-2 rounded-xl text-xs font-black hover:bg-white/20">Cambiar slug</button>
                       </div>
                       <button className="w-full py-4 bg-zinc-800 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-zinc-700">
                          <ExternalLink className="w-4 h-4" /> Ver mi tienda online
                       </button>
                    </div>
                 </div>

              </div>
           )}
        </div>

        {/* SECCION: METODOS DE ENTREGA */}
        <div className="rounded-[32px] border border-white/5 bg-zinc-900/30 overflow-hidden transition-all">
           <button onClick={() => toggleSection('delivery')} className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-green-500" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-xl font-bold text-white">Métodos de entrega</h2>
                    <p className="text-zinc-500 text-xs">Retiro en local, envío a domicilio y costos</p>
                 </div>
              </div>
              {expandedSection === 'delivery' ? <ChevronUp className="w-6 h-6 text-zinc-500" /> : <ChevronDown className="w-6 h-6 text-zinc-500" />}
           </button>

           {expandedSection === 'delivery' && (
              <div className="p-8 pt-0 border-t border-white/5 space-y-8 animate-in slide-in-from-top-4 duration-300">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${merchant.enable_pickup ? 'border-primary bg-primary/10' : 'border-white/5 opacity-40'}`}>
                       <div className="flex items-center gap-4">
                          <Store className="w-5 h-5 text-zinc-500" />
                          <span className="font-bold">Retiro en tienda</span>
                       </div>
                       <input type="checkbox" checked={!!merchant.enable_pickup} onChange={e => setMerchant({...merchant, enable_pickup: e.target.checked})} className="w-6 h-6 accent-primary" />
                    </label>
                    <label className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${merchant.enable_delivery ? 'border-primary bg-primary/10' : 'border-white/5 opacity-40'}`}>
                       <div className="flex items-center gap-4">
                          <Truck className="w-5 h-5 text-zinc-500" />
                          <span className="font-bold">Entrega a domicilio</span>
                       </div>
                       <input type="checkbox" checked={!!merchant.enable_delivery} onChange={e => setMerchant({...merchant, enable_delivery: e.target.checked})} className="w-6 h-6 accent-primary" />
                    </label>
                 </div>

                 <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-3">
                       <DollarSign className="w-5 h-5 text-zinc-600" />
                       <h3 className="font-bold text-white">Configuración de costos envío</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Costo Base ($)</label>
                          <input 
                            type="number"
                            value={merchant.base_shipping_cost || ""}
                            onChange={e => setMerchant({...merchant, base_shipping_cost: Number(e.target.value)})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Costo cada 100 metros ($)</label>
                          <input 
                            type="number"
                            value={merchant.per_meter_cost || ""}
                            onChange={e => setMerchant({...merchant, per_meter_cost: Number(e.target.value)})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary transition-all"
                          />
                       </div>
                    </div>
                 </div>
              </div>
           )}
        </div>

        {/* SECCION: RECORDATORIOS Y ADICIONALES */}
        <div className="rounded-[32px] border border-white/5 bg-zinc-900/30 overflow-hidden transition-all">
           <button onClick={() => toggleSection('extra')} className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-orange-500" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-xl font-bold text-white">Recordatorios y Ajustes</h2>
                    <p className="text-zinc-500 text-xs">Alertas de caja, sonidos y eliminación de cuenta</p>
                 </div>
              </div>
              {expandedSection === 'extra' ? <ChevronUp className="w-6 h-6 text-zinc-500" /> : <ChevronDown className="w-6 h-6 text-zinc-500" />}
           </button>

           {expandedSection === 'extra' && (
              <div className="p-8 pt-0 border-t border-white/5 space-y-6 animate-in slide-in-from-top-4 duration-300">
                 <label className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div>
                       <span className="font-bold block">Apertura de caja</span>
                       <span className="text-xs text-zinc-500">Recordar abrir caja al realizar la primera venta del día</span>
                    </div>
                    <input type="checkbox" checked={!!merchant.notify_cash_drawer} onChange={e => setMerchant({...merchant, notify_cash_drawer: e.target.checked})} className="w-6 h-6 accent-primary" />
                 </label>
                 <label className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div>
                       <span className="font-bold block">Sonido al crear venta</span>
                       <span className="text-xs text-zinc-500">Reproducir sonido de caja registradora al confirmar pedido</span>
                    </div>
                    <input type="checkbox" checked={!!merchant.sound_on_sale} onChange={e => setMerchant({...merchant, sound_on_sale: e.target.checked})} className="w-6 h-6 accent-primary" />
                 </label>
                 
                 <div className="pt-12">
                    <button className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-all font-bold group">
                       <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20">
                          <Trash2 className="w-5 h-5 text-red-500" />
                       </div>
                       Eliminar negocio
                    </button>
                    <p className="text-zinc-600 text-[10px] mt-2 ml-14">Una vez eliminado el negocio no podrás recuperar la información registrada.</p>
                 </div>
              </div>
           )}
        </div>

      </div>

      {/* Floating Save Button */}
      {success && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-full font-black shadow-2xl flex items-center gap-2 animate-bounce">
           <CheckCircle2 className="w-5 h-5" /> CAMBIOS GUARDADOS
        </div>
      )}

      { merchant.id && (
        <div className="fixed bottom-10 right-10 z-[60]">
           <button 
             onClick={() => handleSave()}
             disabled={saving}
             className="bg-primary text-white h-16 px-10 rounded-[25px] font-black shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
           >
             {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> GUARDAR TODO</>}
           </button>
        </div>
      )}
    </div>
  );
}
