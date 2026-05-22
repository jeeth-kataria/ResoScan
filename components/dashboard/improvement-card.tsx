"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { computeImprovement } from "@/lib/analysis";
import type { Patient } from "@/lib/patients";

export function ImprovementCard({ patient }: { patient: Patient }) {
  const s = computeImprovement(patient);
  const positive = s.deltaAbs > 0;
  const neutral  = s.deltaAbs === 0;

  const TrendIcon = positive ? TrendingUp : neutral ? Minus : TrendingDown;
  const trendColor = positive
    ? "var(--safe)"
    : neutral
    ? "var(--text-muted)"
    : "var(--danger)";

  const weeklyPct = Math.abs(s.weeklyRate);
  const barWidth  = Math.min(100, weeklyPct * 20); // scale for display

  return (
    <div className="surface card-hover flex flex-col gap-4 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">
          Improvement
        </div>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md"
          style={{ background: `${trendColor}18` }}
        >
          <TrendIcon size={14} style={{ color: trendColor }} strokeWidth={2} />
        </span>
      </div>

      {/* Delta */}
      <div className="flex items-end gap-3">
        <div
          className="font-mono text-[32px] font-semibold leading-none"
          style={{ color: trendColor }}
        >
          {s.deltaAbs >= 0 ? `+${s.deltaAbs}` : `${s.deltaAbs}`}%
        </div>
        <div className="mb-1 text-[12px] leading-snug text-text-faint">
          since {s.fromDate}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] text-text-faint">
          <span>Weekly rate</span>
          <span className="font-mono" style={{ color: trendColor }}>
            {s.weeklyRate > 0 ? "+" : ""}{s.weeklyRate} %/wk
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${barWidth}%`, background: trendColor }}
          />
        </div>
      </div>

      {/* Weeks elapsed */}
      <div className="text-[12px] text-text-muted">
        {s.weeksElapsed.toFixed(1)} weeks elapsed
      </div>

      {/* Advice */}
      <div
        className="rounded-md px-3 py-2 text-[12.5px] font-medium leading-snug"
        style={{ background: `${trendColor}10`, color: trendColor }}
      >
        {s.advice}
      </div>
    </div>
  );
}

export default ImprovementCard;
