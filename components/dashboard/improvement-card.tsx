"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { computeImprovement, computeImprovementBetween } from "@/lib/analysis";
import type { Patient } from "@/lib/patients";

export function ImprovementCard({ patient }: { patient: Patient }) {
  const [mode, setMode] = useState<"overall" | "recent">("overall");

  const sorted = patient.scans.slice().sort((a, b) => a.date.localeCompare(b.date));
  const overall = computeImprovement(patient);

  // "Recent" = last two scans
  const recentAvailable = sorted.length >= 2;
  const recent = recentAvailable
    ? computeImprovementBetween(sorted[sorted.length - 2], sorted[sorted.length - 1])
    : overall;

  const s = mode === "overall" ? overall : recent;
  const positive = s.deltaAbs > 0;
  const flat = s.deltaAbs === 0;
  const Icon = flat ? Minus : positive ? TrendingUp : TrendingDown;
  const color = flat ? "var(--text-muted)" : positive ? "var(--safe)" : "var(--danger)";

  return (
    <div className="surface p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">Improvement</div>
        {recentAvailable && (
          <div className="flex items-center gap-1 rounded-full border border-line bg-bg-panel p-0.5">
            <button
              onClick={() => setMode("overall")}
              className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors ${
                mode === "overall" ? "bg-bg-elevated text-text" : "text-text-faint hover:text-text-muted"
              }`}
            >
              Overall
            </button>
            <button
              onClick={() => setMode("recent")}
              className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors ${
                mode === "recent" ? "bg-bg-elevated text-text" : "text-text-faint hover:text-text-muted"
              }`}
            >
              Last scan
            </button>
          </div>
        )}
      </div>

      {/* Main delta */}
      <div className="flex items-center gap-2.5">
        <Icon size={20} strokeWidth={2} style={{ color, flexShrink: 0 }} />
        <div className="font-mono text-[28px] font-semibold leading-none" style={{ color }}>
          {s.deltaAbs >= 0 ? `+${s.deltaAbs}` : `${s.deltaAbs}`}%
        </div>
        <div className="flex flex-col text-[11px] text-text-faint leading-snug ml-1">
          <span>TSI points</span>
          <span>{s.deltaAbs >= 0 ? "gained" : "lost"}</span>
        </div>
      </div>

      {/* tsiFrom → tsiTo */}
      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[13px] text-text-muted">{s.tsiFrom.toFixed(1)}%</span>
        <span className="text-text-faint text-[12px]">→</span>
        <span className="font-mono text-[13px] text-text">{s.tsiTo.toFixed(1)}%</span>
        {s.deltaPct !== 0 && (
          <span
            className="ml-auto font-mono text-[11px] rounded-full px-2 py-0.5"
            style={{
              color: positive ? "var(--safe)" : "var(--danger)",
              background: positive ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
            }}
          >
            {s.deltaPct > 0 ? "+" : ""}{s.deltaPct.toFixed(1)}% relative
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="mt-2 flex items-center gap-4 text-[11.5px] text-text-muted">
        <span>{s.weeksElapsed.toFixed(1)} wk</span>
        <span className="h-3 w-px bg-line" />
        <span>
          <span className="font-mono">{s.weeklyRate > 0 ? "+" : ""}{s.weeklyRate}</span>
          {" "}%/wk
        </span>
        <span className="h-3 w-px bg-line" />
        <span className="text-text-faint truncate">{s.fromDate}</span>
      </div>

      {/* Advice */}
      <div className="mt-3 text-[12.5px] font-medium leading-snug" style={{ color: flat ? "var(--text-muted)" : color }}>
        {s.advice}
      </div>
    </div>
  );
}

export default ImprovementCard;
