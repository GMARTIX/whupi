"use client";

import { Bell, Search, User } from "lucide-react";

export function Header() {
  return (
    <header className="h-20 border-b border-white/5 glass sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5 w-96 transition-all focus-within:border-primary/50 group">
        <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-primary" />
        <input 
          type="text" 
          placeholder="Buscar pedido o cadete..." 
          className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-600 w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-500 uppercase">Sistema Operativo</span>
        </div>

        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">Lodejacinto</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">Comercio Premium</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
            LJ
          </div>
        </div>
      </div>
    </header>
  );
}
