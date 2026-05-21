"use client";

import { useState, useEffect } from "react";
import { FlaskConical, X } from "lucide-react";

const STORAGE_KEY = "resoscan_banner_dismissed";

export function DemoBanner() {
  const [visible, setVisible] = useState(false);

  // Only show if not already dismissed this session
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-caution/30 bg-caution/8 px-4 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <FlaskConical size={13} className="shrink-0 text-caution" strokeWidth={1.8} />
        <p className="text-[11.5px] leading-snug text-caution/90 truncate">
          <span className="font-semibold">Demo environment</span>
          {" — "}All patient data is synthetic and generated in-browser. Not for clinical use.
          No data is stored or transmitted.
        </p>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss demo notice"
        className="shrink-0 rounded p-0.5 text-caution/60 transition-colors hover:text-caution"
      >
        <X size={13} strokeWidth={2.2} />
      </button>
    </div>
  );
}
