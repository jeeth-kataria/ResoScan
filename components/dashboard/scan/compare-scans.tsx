"use client";

import React, { useMemo, useState } from "react";
import { GitCompareArrows, BarChart3 } from "lucide-react";
import { computeImprovementBetween } from "@/lib/analysis";
import type { Patient } from "@/lib/patients";
import { buildScan } from "@/lib/scan";
import { ResonanceGraph } from "@/components/dashboard/scan/resonance-graph";
import { PsdOverlay } from "@/components/dashboard/scan/psd-overlay";

type ViewMode = "sidebyside" | "overlay";

export function CompareScans({ patient }: { patient: Patient }) {
  const scans = useMemo(
    () => patient.scans.slice().sort((a, b) => a.date.localeCompare(b.date)),
    [patient]
  );
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(Math.max(0, scans.length - 1));
  const [viewMode, setViewMode] = useState<ViewMode>("overlay");

  const from = scans[fromIdx] ?? scans[0];
  const to = scans[toIdx] ?? scans[scans.length - 1];
  const summary = useMemo(() => computeImprovementBetween(from, to), [from, to]);

  const fromShape = useMemo(
    () => buildScan({ callusPct: from.tsiPct, pressureN: 3.5, implantLoose: false, week: from.week, fHealthy: 850 }),
    [from]
  );
  const toShape = useMemo(
    () => buildScan({ callusPct: to.tsiPct, pressureN: 3.5, implantLoose: false, week: to.week, fHealthy: 850 }),
    [to]
  );

  const deltaColor = summary.deltaAbs >= 0 ? "var(--safe)" : "var(--danger)";

  // Per-metric delta rows
  const metricRows = [
    { label: "TSI",       from: `${from.tsiPct.toFixed(1)}%`,              to: `${to.tsiPct.toFixed(1)}%`,                  delta: to.tsiPct - from.tsiPct,         unit: "%" },
    { label: "f₀ (Hz)",  from: `${fromShape.metrics.fn.toFixed(0)}`,       to: `${toShape.metrics.fn.toFixed(0)}`,           delta: toShape.metrics.fn - fromShape.metrics.fn, unit: "Hz" },
    { label: "ζ",         from: `${fromShape.metrics.zeta.toFixed(3)}`,     to: `${toShape.metrics.zeta.toFixed(3)}`,         delta: toShape.metrics.zeta - fromShape.metrics.zeta, unit: "", lowerBetter: true },
    { label: "Q",         from: `${fromShape.metrics.qFactor.toFixed(1)}`,  to: `${toShape.metrics.qFactor.toFixed(1)}`,      delta: toShape.metrics.qFactor - fromShape.metrics.qFactor, unit: "" },
    { label: "RUST",      from: `${fromShape.metrics.rust}/12`,             to: `${toShape.metrics.rust}/12`,                delta: toShape.metrics.rust - fromShape.metrics.rust, unit: "" },
    { label: "BW (Hz)",  from: `${fromShape.metrics.bandwidthHz.toFixed(0)}`, to: `${toShape.metrics.bandwidthHz.toFixed(0)}`, delta: toShape.metrics.bandwidthHz - fromShape.metrics.bandwidthHz, unit: "Hz", lowerBetter: true },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Header + scan pickers */}
      <div className="surface p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">Compare scans</div>
          {/* View mode toggle */}
          <div className="flex items-center gap-1 rounded-full border border-line bg-bg-panel p-0.5">
            <button
              onClick={() => setViewMode("overlay")}
              title="Overlay view"
              className={`rounded-full p-1.5 transition-colors ${viewMode === "overlay" ? "bg-bg-elevated text-accent" : "text-text-faint hover:text-text"}`}
            >
              <GitCompareArrows size={12} strokeWidth={2} />
            </button>
            <button
              onClick={() => setViewMode("sidebyside")}
              title="Side-by-side view"
              className={`rounded-full p-1.5 transition-colors ${viewMode === "sidebyside" ? "bg-bg-elevated text-accent" : "text-text-faint hover:text-text"}`}
            >
              <BarChart3 size={12} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Scan selectors */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[9.5px] uppercase tracking-wider text-text-faint mb-1">Older scan</div>
            <select value={fromIdx} onChange={(e) => setFromIdx(Number(e.target.value))} className="w-full">
              {scans.map((s, i) => (
                <option key={`${s.date}-${i}`} value={i}>{s.date} · {s.tsiPct.toFixed(0)}%</option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[9.5px] uppercase tracking-wider text-text-faint mb-1">Newer scan</div>
            <select value={toIdx} onChange={(e) => setToIdx(Number(e.target.value))} className="w-full">
              {scans.map((s, i) => (
                <option key={`${s.date}-${i}`} value={i}>{s.date} · {s.tsiPct.toFixed(0)}%</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary delta */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-[22px] font-semibold" style={{ color: deltaColor }}>
            {summary.deltaAbs >= 0 ? `+${summary.deltaAbs}` : `${summary.deltaAbs}`}%
          </span>
          <span
            className="font-mono text-[12px] rounded-full px-2 py-0.5"
            style={{ background: `${deltaColor}18`, color: deltaColor }}
          >
            {summary.deltaPct > 0 ? "+" : ""}{summary.deltaPct.toFixed(1)}% relative
          </span>
        </div>
        <div className="text-[11.5px] text-text-faint mt-0.5">
          {summary.fromDate} → {summary.toDate} · {summary.weeksElapsed} wk ·{" "}
          <span className="font-mono">{summary.weeklyRate > 0 ? "+" : ""}{summary.weeklyRate}%</span>/wk
        </div>
        <p className="mt-2 text-[12.5px] text-text-muted">{summary.advice}</p>
      </div>

      {/* Chart */}
      {viewMode === "overlay" ? (
        <div className="surface p-4">
          <div className="text-[10px] uppercase tracking-[0.16em] text-text-faint mb-2">
            PSD overlay — green = gain, red = loss
          </div>
          <PsdOverlay
            older={fromShape}
            newer={toShape}
            olderLabel={from.date}
            newerLabel={to.date}
            height={200}
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 surface p-3">
            <div className="text-[10px] text-text-faint mb-1">{from.date} · TSI {from.tsiPct.toFixed(0)}%</div>
            <ResonanceGraph shape={fromShape} progress={1} showHealthy={false} height={180} />
          </div>
          <div className="flex-1 surface p-3">
            <div className="text-[10px] text-text-faint mb-1">{to.date} · TSI {to.tsiPct.toFixed(0)}%</div>
            <ResonanceGraph shape={toShape} progress={1} showHealthy={false} height={180} />
          </div>
        </div>
      )}

      {/* Per-metric delta table */}
      <div className="surface p-4">
        <div className="text-[10px] uppercase tracking-[0.16em] text-text-faint mb-2">Metric changes</div>
        <div className="divide-y divide-line">
          {metricRows.map((row) => {
            const improved = row.lowerBetter ? row.delta < 0 : row.delta > 0;
            const unchanged = Math.abs(row.delta) < 0.001;
            const rowColor = unchanged ? "var(--text-faint)" : improved ? "var(--safe)" : "var(--danger)";
            const sign = row.delta > 0 ? "+" : "";
            const deltaStr = Math.abs(row.delta) < 0.001
              ? "—"
              : `${sign}${row.delta.toFixed(row.unit === "Hz" ? 0 : row.unit === "%" ? 1 : 3)}${row.unit}`;
            return (
              <div key={row.label} className="flex items-center justify-between py-1.5 text-[12px]">
                <span className="text-text-muted w-16 shrink-0">{row.label}</span>
                <span className="font-mono text-text-faint">{row.from}</span>
                <span className="text-text-faint text-[10px] mx-1">→</span>
                <span className="font-mono text-text">{row.to}</span>
                <span className="font-mono ml-auto pl-2 font-semibold" style={{ color: rowColor }}>
                  {deltaStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CompareScans;
