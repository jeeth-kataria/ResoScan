"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type NotifLevel = "info" | "warn" | "success";

interface Notif {
  id: string;
  level: NotifLevel;
  title: string;
  body: string;
  time: string;
}

const DEMO_NOTIFS: Notif[] = [
  {
    id: "n1",
    level: "warn",
    title: "Vikram Singh — Non-union risk",
    body: "TSI has not improved over the past 4 weeks. Surgeon review recommended.",
    time: "Today",
  },
  {
    id: "n2",
    level: "success",
    title: "Arjun Mehta — Cleared",
    body: "TSI reached 83.2% — safe for full weight-bearing as of today.",
    time: "Today",
  },
  {
    id: "n3",
    level: "info",
    title: "Priya Iyer — Scan due",
    body: "Last scan was 7 days ago. Weekly scan cadence recommended for delayed union.",
    time: "Yesterday",
  },
];

const icon: Record<NotifLevel, React.ElementType> = {
  info: Clock,
  warn: AlertTriangle,
  success: CheckCircle,
};

const color: Record<NotifLevel, string> = {
  info: "var(--text-muted)",
  warn: "var(--caution)",
  success: "var(--safe)",
};

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  const active = DEMO_NOTIFS.filter(n => !dismissed.has(n.id));
  const unread = active.length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
      >
        <Bell size={17} strokeWidth={1.6} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[340px] overflow-hidden rounded-xl border border-line bg-bg-card shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-[12px] font-semibold text-text">Notifications</span>
            {active.length > 0 && (
              <button
                onClick={() => setDismissed(new Set(DEMO_NOTIFS.map(n => n.id)))}
                className="text-[11px] text-text-muted hover:text-accent transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* List */}
          {active.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-text-faint">
              <CheckCircle size={24} strokeWidth={1.4} />
              <span className="text-[12px]">All caught up</span>
            </div>
          ) : (
            <ul>
              {active.map(n => {
                const Icon = icon[n.level];
                return (
                  <li
                    key={n.id}
                    className="group flex items-start gap-3 border-b border-line px-4 py-3 last:border-b-0 hover:bg-bg-elevated transition-colors"
                  >
                    <span className="mt-0.5 shrink-0">
                      <Icon size={14} strokeWidth={1.8} style={{ color: color[n.level] }} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[12.5px] font-medium text-text leading-snug">{n.title}</span>
                        <span className="shrink-0 text-[10px] text-text-faint">{n.time}</span>
                      </div>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-text-muted">{n.body}</p>
                    </div>
                    <button
                      onClick={() => setDismissed(p => new Set([...p, n.id]))}
                      className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 text-text-faint hover:text-text transition-all"
                      aria-label="Dismiss"
                    >
                      <X size={12} strokeWidth={2} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
