"use client";

import React, { useMemo, useState } from "react";
import { computeImprovementBetween } from "@/lib/analysis";
import type { Patient, Scan } from "@/lib/patients";

export function CompareScans({ patient }: { patient: Patient }) {
  const scans = useMemo(() => patient.scans.slice().sort((a,b)=>a.date.localeCompare(b.date)), [patient]);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(Math.max(0, scans.length - 1));

  const from = scans[fromIdx] ?? scans[0];
  const to = scans[toIdx] ?? scans[scans.length - 1];
  const summary = useMemo(() => computeImprovementBetween(from, to), [from, to]);

  return (
    <div className="surface p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">Compare scans</div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <select value={fromIdx} onChange={(e)=>setFromIdx(Number(e.target.value))} className="rounded border border-line px-2 py-1">
          {scans.map((s,i)=>(<option key={s.date} value={i}>{s.date} · {s.tsiPct}%</option>))}
        </select>
        <select value={toIdx} onChange={(e)=>setToIdx(Number(e.target.value))} className="rounded border border-line px-2 py-1">
          {scans.map((s,i)=>(<option key={s.date} value={i}>{s.date} · {s.tsiPct}%</option>))}
        </select>
      </div>

      <div className="mt-3">
        <div className="font-mono text-[20px] font-semibold" style={{ color: summary.deltaAbs >= 0 ? "var(--safe)" : "var(--danger)" }}>
          {summary.deltaAbs >= 0 ? `+${summary.deltaAbs}%` : `${summary.deltaAbs}%`}
        </div>
        <div className="text-[12px] text-text-faint mt-1">{summary.fromDate} → {summary.toDate} · {summary.weeksElapsed} weeks</div>
        <div className="mt-2 text-[13px]">{summary.advice}</div>
      </div>
    </div>
  );
}

export default CompareScans;
