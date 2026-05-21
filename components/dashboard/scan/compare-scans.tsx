"use client";

import React, { useMemo, useState } from "react";
import { computeImprovementBetween } from "@/lib/analysis";
import type { Patient, Scan } from "@/lib/patients";
import { buildScan } from "@/lib/scan";
import { ResonanceGraph } from "@/components/dashboard/scan/resonance-graph";

export function CompareScans({ patient }: { patient: Patient }) {
  const scans = useMemo(() => patient.scans.slice().sort((a,b)=>a.date.localeCompare(b.date)), [patient]);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(Math.max(0, scans.length - 1));
  const [showCharts, setShowCharts] = useState(false);

  const from = scans[fromIdx] ?? scans[0];
  const to = scans[toIdx] ?? scans[scans.length - 1];
  const summary = useMemo(() => computeImprovementBetween(from, to), [from, to]);

  // Build lightweight shapes for live charting
  const fromShape = useMemo(() => buildScan({ callusPct: from.tsiPct, pressureN: from.pressureN ?? 3.5, implantLoose: !!from.implantLoose, week: from.week, fHealthy: 850 }), [from]);
  const toShape = useMemo(() => buildScan({ callusPct: to.tsiPct, pressureN: to.pressureN ?? 3.5, implantLoose: !!to.implantLoose, week: to.week, fHealthy: 850 }), [to]);

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      {/* LEFT: larger charts */}
      <div className="lg:w-2/3">
        {showCharts ? (
          <div className="flex flex-col gap-3">
            <div className="text-[12px] text-text-faint">Frequency response — older (left) vs newer (right)</div>
            <div className="flex gap-3">
              <div className="flex-1 surface p-3">
                <div className="text-[11px] text-text-faint">{from.date} · TSI {from.tsiPct}%</div>
                <ResonanceGraph shape={fromShape} progress={1} showHealthy={false} height={320} />
              </div>
              <div className="flex-1 surface p-3">
                <div className="text-[11px] text-text-faint">{to.date} · TSI {to.tsiPct}%</div>
                <ResonanceGraph shape={toShape} progress={1} showHealthy={false} height={320} />
              </div>
            </div>
          </div>
        ) : (
          <div className="surface p-6 flex items-center justify-center text-[13px] text-text-faint">
            Charts hidden — click "Show charts" to view comparison
          </div>
        )}
      </div>

      {/* RIGHT: info card */}
      <div className="lg:w-1/3">
        <div className="surface p-4 h-full flex flex-col">
          <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">Compare scans</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <select value={fromIdx} onChange={(e)=>setFromIdx(Number(e.target.value))} className="rounded border border-line px-2 py-1">
              {scans.map((s,i)=>(<option key={`${s.date}-${i}`} value={i}>{s.date} · {s.tsiPct}%</option>))}
            </select>
            <select value={toIdx} onChange={(e)=>setToIdx(Number(e.target.value))} className="rounded border border-line px-2 py-1">
              {scans.map((s,i)=>(<option key={`${s.date}-${i}`} value={i}>{s.date} · {s.tsiPct}%</option>))}
            </select>
          </div>

          <div className="mt-3">
            <div className="font-mono text-[20px] font-semibold" style={{ color: summary.deltaAbs >= 0 ? "var(--safe)" : "var(--danger)" }}>
              {summary.deltaAbs >= 0 ? `+${summary.deltaAbs}%` : `${summary.deltaAbs}%`}
            </div>
            <div className="text-[12px] text-text-faint mt-1">{summary.fromDate} → {summary.toDate} · {summary.weeksElapsed} weeks</div>
            <div className="mt-2 text-[13px]">{summary.advice}</div>
          </div>

          <div className="mt-4">
            <button className="text-[12px] text-text-muted hover:text-accent" onClick={()=>setShowCharts(v=>!v)}>
              {showCharts ? "Hide charts" : "Show charts"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CompareScans;
