"use client";

import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { computeImprovement } from "@/lib/analysis";
import type { Patient } from "@/lib/patients";

export function ImprovementCard({ patient }: { patient: Patient }) {
  const s = computeImprovement(patient);
  const positive = s.deltaAbs >= 0;
  return (
    <div className="surface p-5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">Improvement</div>
      <div className="mt-2 flex items-end gap-3">
        <div className="flex items-center gap-2">
          <div className="font-mono text-[28px] font-semibold" style={{ color: positive ? "var(--safe)" : "var(--danger)" }}>
            {s.deltaAbs >= 0 ? `+${s.deltaAbs}` : `${s.deltaAbs}`}%
          </div>
          <div className="text-[12px] text-text-faint">since {s.fromDate}</div>
        </div>
      </div>
      <div className="mt-3 text-[12px] text-text-muted">
        {s.weeksElapsed.toFixed(1)} weeks · {s.weeklyRate} %/week
      </div>
      <div className="mt-3 text-[13px] font-medium">{s.advice}</div>
    </div>
  );
}

export default ImprovementCard;
