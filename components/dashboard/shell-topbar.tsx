"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { PatientPicker } from "./patient-picker";
import { NotificationsBell } from "./notifications-bell";
import { DemoBanner } from "./demo-banner";

function routeLabel(path: string): string {
  if (path.startsWith("/dashboard/scan")) return "Live Scan";
  if (path.startsWith("/dashboard/patients")) return "Patients";
  if (path.startsWith("/dashboard/model")) return "Model";
  if (path.startsWith("/dashboard/settings")) return "Settings";
  return "Dashboard";
}

export function ShellTopbar() {
  const path = usePathname();
  return (
    <div className="shrink-0">
      {/* Demo disclaimer banner (dismissible) */}
      <DemoBanner />

      {/* Main topbar row */}
      <header className="flex h-16 items-center justify-between border-b border-line bg-bg-panel px-6">
        {/* Left: wordmark (mobile) | breadcrumb (desktop) */}
        <div className="flex items-center gap-5 md:hidden">
          <Wordmark />
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.16em] text-text-faint">
            ResoScan Clinical Console
          </span>
          <span className="h-3 w-px bg-line" />
          <span className="text-[13px] text-text-muted">{routeLabel(path ?? "")}</span>
        </div>

        {/* Right: patient picker + notifications + settings */}
        <div className="flex items-center gap-2">
          <PatientPicker />
          <div className="hidden md:flex items-center gap-1 ml-2 pl-3 border-l border-line">
            <NotificationsBell />
            <Link
              href="/dashboard/settings"
              aria-label="Settings"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-bg-elevated ${
                path?.startsWith("/dashboard/settings")
                  ? "text-accent"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Settings size={17} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
