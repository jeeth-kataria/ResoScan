"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Prediction } from "@/lib/prediction";

interface Props {
  pred: Prediction;
}

export function PaceCard({ pred }: Props) {
  const { pace, paceDeltaDays, confidence, weeksRemaining, daysRemaining } = pred;

  const paceConfig = {
    ahead:      { icon: TrendingUp,   color: "var(--safe)",    label: "Ahead of average",   text: `${Math.abs(paceDeltaDays)} day${Math.abs(paceDeltaDays) !== 1 ? "s" : ""} faster than the population average` },
    "on pace":  { icon: Minus,        color: "var(--accent)",  label: "On pace",             text: "Healing at the expected population rate" },
    behind:     { icon: TrendingDown, color: "var(--caution)", label: "Behind average",      text: `${Math.abs(paceDeltaDays)} day${Math.abs(paceDeltaDays) !== 1 ? "s" : ""} slower than the population average` },
  } as const;

  const cfg = paceConfig[pace];
  const Icon = cfg.icon;

  const confBadge = {
    high:     { label: "High confidence", bg: "rgba(34,197,94,0.12)",   color: "var(--safe)" },
    moderate: { label: "Moderate confidence", bg: "rgba(234,179,8,0.12)", color: "var(--caution)" },
    low:      { label: "Low confidence",  bg: "rgba(239,68,68,0.12)",  color: "var(--danger)" },
  }[confidence];

  // Don't render if we can't make a prediction
  if (daysRemaining === null && weeksRemaining === null) {
    return (
      <div className="surface p-5">
        <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint mb-2">Healing pace</div>
        <p className="text-[12.5px] text-text-muted">
          Pace cannot be estimated — non-union risk or insufficient data.
        </p>
      </div>
    );
  }

  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">Healing pace</div>
        <span
          className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium"
          style={{ background: confBadge.bg, color: confBadge.color }}
        >
          {confBadge.label}
        </span>
      </div>

      {/* Pace indicator */}
      <div className="flex items-center gap-2.5 mb-3">
        <Icon size={20} strokeWidth={2} style={{ color: cfg.color, flexShrink: 0 }} />
        <div className="font-display text-[15px] font-semibold" style={{ color: cfg.color }}>
          {cfg.label}
        </div>
      </div>

      <p className="text-[12.5px] text-text-muted">{cfg.text}</p>

      {/* weeks remaining */}
      {weeksRemaining !== null && weeksRemaining > 0 && (
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-mono text-[22px] font-semibold text-text">
            {weeksRemaining.toFixed(1)}
          </span>
          <span className="text-[12px] text-text-faint">weeks remaining</span>
        </div>
      )}

      {/* Confidence explanation */}
      <p className="mt-2 text-[11px] leading-snug text-text-faint">
        {confidence === "high"
          ? "Fitted from 4+ scans — curve is well-constrained."
          : confidence === "moderate"
          ? "Fitted from 2–3 scans — add more scans to improve accuracy."
          : "Only 1 scan available — prediction is prior-based, not personalised."}
      </p>
    </div>
  );
}
