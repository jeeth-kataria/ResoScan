"use client";

/**
 * PsdOverlay — renders two PSD curves on a single SVG for direct comparison.
 * The "gain" region (where the newer scan is stronger) is filled in green,
 * the "loss" region in red, so the shift is immediately readable at a glance.
 */

import { useMemo } from "react";
import type { ScanShape } from "@/lib/scan";
import { pathFromPoints } from "@/lib/scan";

interface Props {
  older: ScanShape;
  newer: ScanShape;
  olderLabel?: string;
  newerLabel?: string;
  width?: number;
  height?: number;
}

export function PsdOverlay({
  older,
  newer,
  olderLabel = "Older",
  newerLabel = "Newer",
  width = 760,
  height = 280,
}: Props) {
  const padL = 8;
  const padR = 8;
  const padT = 24;
  const padB = 28;
  const W = width - padL - padR;
  const H = height - padT - padB;

  const olderLine = useMemo(
    () => pathFromPoints(older.spectrumInjured, W, H, 0, 0),
    [older.spectrumInjured, W, H]
  );
  const newerLine = useMemo(
    () => pathFromPoints(newer.spectrumInjured, W, H, 0, 0),
    [newer.spectrumInjured, W, H]
  );

  // Build delta fill: iterate x positions and classify gain vs loss
  const n = older.spectrumInjured.length;
  const gainPath = useMemo(() => {
    const o = older.spectrumInjured;
    const nw = newer.spectrumInjured;
    let path = "";
    // sweep and build filled regions where newer > older
    let inGain = false;
    let seg = "";
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * W;
      const yOld = (1 - o[i]) * H;
      const yNew = (1 - nw[i]) * H;
      if (nw[i] > o[i]) {
        if (!inGain) {
          seg = `M${x.toFixed(1)},${yOld.toFixed(1)}`;
          inGain = true;
        }
        seg += ` L${x.toFixed(1)},${yNew.toFixed(1)}`;
      } else if (inGain) {
        // close the current segment: trace back along older curve
        for (let j = i - 1; j >= 0 && newer.spectrumInjured[j] > older.spectrumInjured[j]; j--) {
          const bx = (j / (n - 1)) * W;
          const by = (1 - o[j]) * H;
          seg += ` L${bx.toFixed(1)},${by.toFixed(1)}`;
        }
        seg += " Z";
        path += seg;
        inGain = false;
        seg = "";
      }
    }
    if (inGain) {
      for (let j = n - 1; j >= 0 && newer.spectrumInjured[j] > older.spectrumInjured[j]; j--) {
        const bx = (j / (n - 1)) * W;
        const by = (1 - older.spectrumInjured[j]) * H;
        seg += ` L${bx.toFixed(1)},${by.toFixed(1)}`;
      }
      seg += " Z";
      path += seg;
    }
    return path;
  }, [older.spectrumInjured, newer.spectrumInjured, n, W, H]);

  const lossPath = useMemo(() => {
    const o = older.spectrumInjured;
    const nw = newer.spectrumInjured;
    let path = "";
    let inLoss = false;
    let seg = "";
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * W;
      const yOld = (1 - o[i]) * H;
      const yNew = (1 - nw[i]) * H;
      if (o[i] > nw[i]) {
        if (!inLoss) {
          seg = `M${x.toFixed(1)},${yNew.toFixed(1)}`;
          inLoss = true;
        }
        seg += ` L${x.toFixed(1)},${yOld.toFixed(1)}`;
      } else if (inLoss) {
        for (let j = i - 1; j >= 0 && older.spectrumInjured[j] > newer.spectrumInjured[j]; j--) {
          const bx = (j / (n - 1)) * W;
          const by = (1 - nw[j]) * H;
          seg += ` L${bx.toFixed(1)},${by.toFixed(1)}`;
        }
        seg += " Z";
        path += seg;
        inLoss = false;
        seg = "";
      }
    }
    if (inLoss) {
      for (let j = n - 1; j >= 0 && older.spectrumInjured[j] > newer.spectrumInjured[j]; j--) {
        const bx = (j / (n - 1)) * W;
        const by = (1 - newer.spectrumInjured[j]) * H;
        seg += ` L${bx.toFixed(1)},${by.toFixed(1)}`;
      }
      seg += " Z";
      path += seg;
    }
    return path;
  }, [older.spectrumInjured, newer.spectrumInjured, n, W, H]);

  // Peak Hz labels
  const olderPeakX = (older.peakHz - 20) / (1100 - 20) * W;
  const newerPeakX = (newer.peakHz - 20) / (1100 - 20) * W;

  const ticks = [100, 200, 400, 700, 1000];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label="PSD overlay comparison"
    >
      <g transform={`translate(${padL}, ${padT})`}>
        {/* gridlines */}
        {[0.25, 0.5, 0.75].map((y) => (
          <line key={y}
            x1={0} x2={W}
            y1={y * H} y2={y * H}
            stroke="var(--line)" strokeOpacity="0.4" strokeDasharray="2 4"
          />
        ))}

        {/* gain fill (newer > older) */}
        {gainPath && (
          <path d={gainPath} fill="var(--safe)" fillOpacity="0.18" />
        )}
        {/* loss fill (older > newer) */}
        {lossPath && (
          <path d={lossPath} fill="var(--danger)" fillOpacity="0.15" />
        )}

        {/* older curve */}
        <path
          d={olderLine}
          fill="none"
          stroke="var(--text-faint)"
          strokeWidth="1.6"
          strokeDasharray="5 3"
        />

        {/* newer curve */}
        <path
          d={newerLine}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        />

        {/* older peak marker */}
        <line
          x1={olderPeakX} x2={olderPeakX}
          y1={0} y2={H}
          stroke="var(--text-faint)" strokeOpacity="0.4" strokeDasharray="2 3"
        />

        {/* newer peak marker */}
        <line
          x1={newerPeakX} x2={newerPeakX}
          y1={0} y2={H}
          stroke="var(--accent)" strokeOpacity="0.5" strokeDasharray="2 3"
        />

        {/* Peak Hz annotations */}
        <text x={olderPeakX + 3} y={H - 4}
          fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--text-faint)">
          {Math.round(older.peakHz)} Hz
        </text>
        <text x={newerPeakX + 3} y={14}
          fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--accent)">
          {Math.round(newer.peakHz)} Hz
        </text>

        {/* x-axis */}
        <line x1={0} x2={W} y1={H} y2={H} stroke="var(--line)" />
        {ticks.map((hz) => {
          const x = ((hz - 20) / (1100 - 20)) * W;
          return (
            <g key={hz}>
              <line x1={x} x2={x} y1={H} y2={H + 4} stroke="var(--line)" />
              <text x={x} y={H + 16}
                fontFamily="var(--font-mono)" fontSize="9.5"
                fill="var(--text-faint)" textAnchor="middle">
                {hz}
              </text>
            </g>
          );
        })}
        <text x={W - 4} y={-6}
          fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--text-faint)" textAnchor="end">Hz</text>
      </g>

      {/* Legend */}
      <g transform={`translate(${padL + 6}, ${padT + 4})`}>
        <line x1={0} x2={14} y1={0} y2={0} stroke="var(--text-faint)" strokeWidth="1.6" strokeDasharray="4 2" />
        <text x={18} y={4} fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--text-muted)">{olderLabel}</text>
        <line x1={0} x2={14} y1={14} y2={14} stroke="var(--accent)" strokeWidth="2" />
        <text x={18} y={18} fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--text-muted)">{newerLabel}</text>
        <rect x={0} y={26} width={10} height={8} fill="var(--safe)" fillOpacity="0.4" rx="1" />
        <text x={14} y={33} fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--safe)">gain</text>
        <rect x={50} y={26} width={10} height={8} fill="var(--danger)" fillOpacity="0.4" rx="1" />
        <text x={64} y={33} fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--danger)">loss</text>
      </g>
    </svg>
  );
}
