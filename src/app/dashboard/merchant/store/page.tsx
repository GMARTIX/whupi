"use client";

import { useState, useEffect } from "react";
import { 
  ExternalLink, 
  Copy, 
  QrCode, 
  Share2,
  CheckCircle2,
  Store,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function MerchantStorePage() {
  const [copied, setCopied] = useState(false);
  const merchantId = "m-lodejacinto"; // Hardcoded for demo
  const storeUrl = `https://whupi.shop/store/${merchantId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Mi Tienda Digital</h1>
          <p className="text-zinc-500 text-sm">Este es el link que debes compartir con tus clientes</p>
        </div>
        <Link 
          href={`/store/${merchantId}`}
          target="_blank"
          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/10"
        >
          Ver Tienda <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Link Card */}
        <div className="p-8 rounded-[40px] border border-white/5 glass bg-zinc-900/50 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Share2 className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-white">Comparte tu Link</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Copia este link y pégalo en tu biografía de Instagram o envíalo por WhatsApp a tus clientes.
          </p>
          
          <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/5">
            <span className="flex-1 px-4 text-zinc-400 text-sm truncate uppercase tracking-tight font-medium">
              {storeUrl}
            </span>
            <button 
              onClick={copyToClipboard}
              className="p-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg"
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* QR Card */}
        <div className="p-8 rounded-[40px] border border-white/5 glass bg-zinc-900/50 flex flex-col items-center text-center space-y-4">
          <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-2xl">
            {/* Mock QR Code */}
            <QrCode className="w-full h-full text-zinc-900" strokeWidth={1} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Código QR</h2>
            <p className="text-zinc-500 text-sm mt-1">Imprime este código para tu local físico</p>
          </div>
          <button className="text-primary font-bold hover:underline text-sm">Descargar QR</button>
        </div>
      </div>

      <div className="p-8 rounded-[40px] border border-white/5 glass bg-primary/5 flex items-center justify-between group cursor-pointer border-dashed border-primary/30">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
             <Store className="w-6 h-6 text-primary" />
           </div>
           <div>
             <h3 className="font-bold text-white">Personalizar Apariencia</h3>
             <p className="text-zinc-500 text-xs">Cambia colores, logos y banners de tu tienda</p>
           </div>
        </div>
        <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-all group-hover:translate-x-1" />
      </div>
    </div>
  );
}
