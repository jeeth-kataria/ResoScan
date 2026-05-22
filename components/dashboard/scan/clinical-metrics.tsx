"use client";

import type { ClinicalMetrics } from "@/lib/scan";

export function ClinicalMetricsGrid({ m }: { m: ClinicalMetrics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Metric
        label="Tibial Stiffness Index"
        value={m.tsi.toFixed(1)}
        unit="%"
        sub="Bone stiffness vs healthy reference"
        bar={{ value: m.tsi, max: 100, color: m.tsi >= 80 ? "var(--safe)" : m.tsi >= 40 ? "var(--caution)" : "var(--danger)" }}
        emphasis
      />
      <RustMetric m={m} />
      <Metric
        label="Resonant frequency"
        value={m.fn.toFixed(0)}
        unit="Hz"
        sub="Higher = stiffer bone"
        bar={{ value: Math.min(m.fn, 1200), max: 1200, color: "var(--accent)" }}
      />
      <Metric
        label="Damping ratio (ζ)"
        value={m.zeta.toFixed(3)}
        sub={
          m.zeta < 0.04 ? "Solid · healed energy retention"
          : m.zeta < 0.10 ? "Stable · still gaining stiffness"
          : "Soft callus · absorbs energy"
        }
        bar={{
          value: Math.max(0, 1 - m.zeta / 0.15) * 100,
          max: 100,
          color: m.zeta < 0.04 ? "var(--safe)" : m.zeta < 0.10 ? "var(--caution)" : "var(--danger)",
        }}
      />
      <Metric
        label="Q-Factor"
        value={m.qFactor.toFixed(1)}
        sub={m.qFactor > 14 ? "Sharp · stiff bone" : m.qFactor > 6 ? "Moderate" : "Broad · soft callus"}
        bar={{ value: Math.min(m.qFactor, 20), max: 20, color: m.qFactor > 14 ? "var(--safe)" : m.qFactor > 6 ? "var(--caution)" : "var(--danger)" }}
      />
      <Metric
        label="Half-power bandwidth"
        value={m.bandwidthHz.toFixed(0)}
        unit="Hz"
        sub="Width of the resonance at half-power"
        bar={{ value: Math.min(m.bandwidthHz, 400), max: 400, color: "var(--accent)" }}
      />
    </div>
  );
}

function Metric({
  label, value, unit, sub, emphasis = false, bar,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  emphasis?: boolean;
  bar?: { value: number; max: number; color: string };
}) {
  const fillPct = bar ? Math.min(100, (bar.value / bar.max) * 100) : 0;

  return (
    <div className="surface card-hover flex flex-col gap-3 p-5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">{label}</div>

      <div className="flex items-baseline gap-1.5 font-mono leading-none">
        <span className={emphasis ? "text-4xl font-semibold text-text" : "text-2xl font-semibold text-text"}>
          {value}
        </span>
        {unit && <span className="text-base text-text-faint">{unit}</span>}
      </div>

      {/* Progress bar */}
      {bar && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${fillPct}%`, background: bar.color }}
          />
        </div>
      )}

      {sub && (
        <p className="text-[11.5px] leading-snug text-text-muted">{sub}</p>
      )}
    </div>
  );
}

function RustMetric({ m }: { m: ClinicalMetrics }) {
  const cortexColor = (s: number) =>
    s >= 3 ? "var(--safe)" : s >= 2 ? "var(--caution)" : "var(--danger)";

  const labelOf = (n: number) => (n >= 9 ? "Bridging callus" : n >= 6 ? "Early callus" : "No callus");
  const totalPct = Math.round((m.rust / 12) * 100);

  return (
    <div className="surface card-hover flex flex-col gap-3 p-5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">
        RUST score (cortex)
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold text-text">{m.rust}</span>
        <span className="font-mono text-base text-text-faint">/ 12</span>
        <span className="ml-1 text-[11px] text-text-muted">{labelOf(m.rust)}</span>
      </div>

      {/* Bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${totalPct}%`,
            background: m.rust >= 9 ? "var(--safe)" : m.rust >= 6 ? "var(--caution)" : "var(--danger)",
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <CortexCell label="Anterior"  score={m.rustCortex.anterior}  color={cortexColor(m.rustCortex.anterior)} />
        <CortexCell label="Posterior" score={m.rustCortex.posterior} color={cortexColor(m.rustCortex.posterior)} />
        <CortexCell label="Medial"    score={m.rustCortex.medial}    color={cortexColor(m.rustCortex.medial)} />
        <CortexCell label="Lateral"   score={m.rustCortex.lateral}   color={cortexColor(m.rustCortex.lateral)} />
      </div>
    </div>
  );
}

function CortexCell({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div
      className="flex items-center justify-between rounded-md border border-line bg-bg-panel px-2.5 py-1.5"
      style={{ borderColor: `${color}40` }}
    >
      <span className="text-[11px] text-text-muted">{label}</span>
      <div className="flex items-center gap-1.5">
        {/* Mini dots */}
        {[1, 2, 3].map((dot) => (
          <span
            key={dot}
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: dot <= score ? color : "var(--line)" }}
          />
        ))}
        <span className="font-mono text-[12px] font-semibold" style={{ color }}>
          {score}/3
        </span>
      </div>
    </div>
  );
}
