"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Users, Sparkles, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/",                     label: "Home",     icon: Home },
  { href: "/dashboard/scan",       label: "Scan",     icon: Activity },
  { href: "/dashboard/patients",   label: "Patients", icon: Users },
  { href: "/dashboard/model",      label: "Model",    icon: Sparkles },
  { href: "/dashboard/settings",   label: "Settings", icon: Settings },
];

export function MobileNav() {
  const path = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex items-center justify-around border-t border-line bg-bg-panel/95 backdrop-blur-sm pb-safe">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? path === "/" : path?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-3 text-[10px] uppercase tracking-wider transition-colors",
              active ? "text-accent" : "text-text-muted"
            )}
          >
            <Icon size={19} strokeWidth={1.6} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
