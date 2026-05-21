"use client";

/**
 * TsiHistoryChart — a compact Recharts line chart showing all scan TSI values
 * over time for the current patient. Gives immediate context about trajectory.
 */

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Dot,
} from "recharts";
import type { Patient } from "@/lib/patients";

interface Props {
  patient: Patient;
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getUTCDate()} ${m[d.getUTCMonth()]}`;
}

function classColor(c: string) {
  if (c === "Stable") return "var(--safe)";
  if (c === "Non-Union") return "var(--danger)";
  return "var(--caution)";
}

export function TsiHistoryChart({ patient }: Props) {
  const sorted = patient.scans.slice().sort((a, b) => a.date.localeCompare(b.date));

  const data = sorted.map((s) => ({
    label: formatDate(s.date),
    tsi: +s.tsiPct.toFixed(1),
    week: +s.week.toFixed(1),
    classification: s.classification,
    dot: s.tsiPct,
  }));

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = classColor(payload.classification);
    return <circle cx={cx} cy={cy} r={4} fill={color} stroke="var(--bg-card)" strokeWidth={1.5} />;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="rounded-lg border border-line bg-bg-card px-3 py-2 text-[12px] shadow-xl">
        <div className="font-medium text-text">{d.label} · wk {d.week}</div>
        <div className="mt-1 font-mono text-[14px]" style={{ color: classColor(d.classification) }}>
          {d.tsi}%
        </div>
        <div className="text-[10.5px] text-text-faint mt-0.5">{d.classification}</div>
      </div>
    );
  };

  return (
    <div className="surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.16em] text-text-faint">
          TSI history · all {sorted.length} scans
        </span>
        <div className="flex items-center gap-3 text-[10.5px] text-text-faint">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-safe" />Stable</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-caution" />Delayed</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-danger" />Non-union</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--line)" strokeOpacity={0.5} />
          <XAxis
            dataKey="label"
            tick={{ fontFamily: "var(--font-mono)", fontSize: 9.5, fill: "var(--text-faint)" }}
            axisLine={{ stroke: "var(--line)" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontFamily: "var(--font-mono)", fontSize: 9.5, fill: "var(--text-faint)" }}
            axisLine={false}
            tickLine={false}
            width={28}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* safe-to-walk threshold */}
          <ReferenceLine
            y={80}
            stroke="var(--safe)"
            strokeDasharray="4 3"
            strokeOpacity={0.6}
            label={{
              value: "80% walk",
              position: "insideTopRight",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--safe)",
            }}
          />
          <Line
            type="monotone"
            dataKey="tsi"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 6, stroke: "var(--accent)", strokeWidth: 2, fill: "var(--bg-card)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
