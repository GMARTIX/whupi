"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PackagePlus, 
  ClipboardList, 
  Store, 
  Bike, 
  Settings, 
  LogOut 
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard/merchant", icon: LayoutDashboard },
  { name: "Nuevo Pedido", href: "/dashboard/merchant/new-order", icon: PackagePlus },
  { name: "Inventario", href: "/dashboard/merchant/inventory", icon: ClipboardList },
  { name: "Mi Tienda", href: "/dashboard/merchant/store", icon: Store },
  { name: "Riders en Red", href: "/dashboard/merchant/riders", icon: Bike },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/5 glass flex flex-col z-50">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white tracking-widest">WHUPI</h2>
        <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">Logistics Suite</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={clsx("w-5 h-5", isActive ? "text-white" : "group-hover:text-primary")} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
