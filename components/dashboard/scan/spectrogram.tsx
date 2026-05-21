"use client";

import { useMemo } from "react";
import type { Spectrogram as SpectrogramData } from "@/lib/scan";

/** Colormap: navy -> cyan -> white-ish, matching brand */
function colorForValue(v: number): string {
  const t = Math.max(0, Math.min(1, v));
  if (t < 0.5) {
    const k = t * 2;
    const r = Math.round(10 + (6 - 10) * k);
    const g = Math.round(14 + (182 - 14) * k);
    const b = Math.round(23 + (212 - 23) * k);
    return `rgb(${r},${g},${b})`;
  }
  const k = (t - 0.5) * 2;
  const r = Math.round(6 + (240 - 6) * k);
  const g = Math.round(182 + (240 - 182) * k);
  const b = Math.round(212 + (210 - 212) * k);
  return `rgb(${r},${g},${b})`;
}

export function Spectrogram({
  data,
  width = 360,
  height = 220,
  peakHz,
}: {
  data: SpectrogramData;
  width?: number;
  height?: number;
  /** Optional: overlay a horizontal marker at this frequency */
  peakHz?: number;
}) {
  const grid = data.data;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  // Layout constants — leave room for y-axis on the left and x-axis on the bottom
  const padL = 38; // width for freq axis labels
  const padB = 28; // height for time axis
  const plotW = width - padL;
  const plotH = height - padB;

  // Frequency range from data
  const fMin = data.fMin;
  const fMax = data.fMax;

  // Frequency ticks to draw (choose nice round numbers within range)
  const freqTicks = [100, 200, 400, 600, 800, 1000].filter(f => f >= fMin && f <= fMax);

  const fToY = (f: number) => {
    // rows go top=fMax to bottom=fMin
    return ((fMax - f) / (fMax - fMin)) * plotH;
  };

  const tiles = useMemo(() => {
    const cellW = plotW / cols;
    const cellH = plotH / rows;
    const out: React.ReactNode[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = grid[r][c];
        if (v < 0.06) continue;
        const opacity = +Math.min(1, 0.4 + 0.8 * v).toFixed(3);
        out.push(
          <rect
            key={`${r}-${c}`}
            x={+(padL + c * cellW).toFixed(2)}
            y={+(r * cellH).toFixed(2)}
            width={+(cellW + 0.5).toFixed(2)}
            height={+(cellH + 0.5).toFixed(2)}
            fill={colorForValue(v)}
            opacity={opacity}
          />
        );
      }
    }
    return out;
  }, [grid, rows, cols, plotW, plotH, padL]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label="Spectrogram — frequency over time"
    >
      {/* ── plot area background ── */}
      <rect x={padL} y={0} width={plotW} height={plotH} fill="var(--bg-primary)" opacity="0.6" />

      {/* ── tiles ── */}
      {tiles}

      {/* ── frequency gridlines + y-axis labels ── */}
      {freqTicks.map((f) => {
        const y = fToY(f);
        return (
          <g key={f}>
            <line
              x1={padL} x2={width}
              y1={y} y2={y}
              stroke="var(--line)" strokeOpacity="0.35" strokeDasharray="2 3"
            />
            <text
              x={padL - 4} y={y + 3.5}
              fontFamily="var(--font-mono)" fontSize="9.5"
              fill="var(--text-faint)" textAnchor="end"
            >
              {f >= 1000 ? `${f / 1000}k` : f}
            </text>
          </g>
        );
      })}

      {/* ── y-axis border line ── */}
      <line x1={padL} x2={padL} y1={0} y2={plotH} stroke="var(--line)" />

      {/* ── peak frequency overlay line ── */}
      {peakHz !== undefined && peakHz >= fMin && peakHz <= fMax && (
        <g>
          <line
            x1={padL} x2={width}
            y1={fToY(peakHz)} y2={fToY(peakHz)}
            stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.8"
            strokeDasharray="4 3"
          />
          <text
            x={padL + 4} y={fToY(peakHz) - 4}
            fontFamily="var(--font-mono)" fontSize="9.5"
            fill="var(--accent)"
          >
            f₀ {Math.round(peakHz)} Hz
          </text>
        </g>
      )}

      {/* ── y-axis label ── */}
      <text
        x={9} y={plotH / 2}
        fontFamily="var(--font-mono)" fontSize="9.5"
        fill="var(--text-faint)"
        textAnchor="middle"
        transform={`rotate(-90, 9, ${plotH / 2})`}
      >
        Hz
      </text>

      {/* ── x-axis (time) ── */}
      <line x1={padL} x2={width} y1={plotH} y2={plotH} stroke="var(--line)" />
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <text
          key={i}
          x={padL + t * plotW}
          y={height - 10}
          fontFamily="var(--font-mono)"
          fontSize="9.5"
          fill="var(--text-faint)"
          textAnchor={t === 0 ? "start" : t === 1 ? "end" : "middle"}
        >
          {(t * data.tSec * 1000).toFixed(0)} ms
        </text>
      ))}

      {/* ── color scale legend ── */}
      <defs>
        <linearGradient id="spec-legend" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor={colorForValue(0.05)} />
          <stop offset="50%" stopColor={colorForValue(0.5)} />
          <stop offset="100%" stopColor={colorForValue(1.0)} />
        </linearGradient>
      </defs>
      <rect x={width - 10} y={4} width={7} height={plotH - 8} fill="url(#spec-legend)" rx="2" />
      <text x={width - 12} y={8} fontFamily="var(--font-mono)" fontSize="8.5" fill="var(--text-faint)" textAnchor="end">hi</text>
      <text x={width - 12} y={plotH - 4} fontFamily="var(--font-mono)" fontSize="8.5" fill="var(--text-faint)" textAnchor="end">lo</text>
    </svg>
  );
}
