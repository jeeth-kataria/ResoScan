"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, AlertTriangle, Check, Clock } from "lucide-react";

import { PATIENTS, statusColor, statusLabel, latestScan, type Patient } from "@/lib/patients";
import { predict, predictionHeadline } from "@/lib/prediction";
import { TrajectoryChart } from "@/components/dashboard/patients/trajectory-chart";
import { ResonanceGraph } from "@/components/dashboard/scan/resonance-graph";
import { buildScan } from "@/lib/scan";
import { computeImprovementBetween } from "@/lib/analysis";
import { cn } from "@/lib/utils";

export default function PatientsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-text-muted">Loading…</div>}>
      <PatientsInner />
    </Suspense>
  );
}

function PatientsInner() {
  const params = useSearchParams();
  const router = useRouter();
  const selectedKey = params.get("p") ?? "arjun";
  const selected = PATIENTS.find((p) => p.key === selectedKey) ?? PATIENTS[0];

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="px-1">
        <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint">
          Patient registry
        </div>
        <h1 className="mt-1 font-display text-2xl font-semibold text-text">
          Three patients, three trajectories
        </h1>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-text-muted">
          The same scan device used on three different patients tells three completely
          different stories. Click a card to open the full healing trajectory.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {PATIENTS.map((p) => (
          <PatientCard
            key={p.key}
            patient={p}
            selected={p.key === selectedKey}
            onSelect={() => {
              const next = new URLSearchParams(params.toString());
              next.set("p", p.key);
              router.push(`/dashboard/patients?${next.toString()}`, { scroll: false });
            }}
          />
        ))}
      </section>

      <PatientDetail patient={selected} />
    </div>
  );
}

function PatientCard({
  patient, selected, onSelect,
}: { patient: Patient; selected: boolean; onSelect: () => void; }) {
  const pred = predict(patient);
  const head = predictionHeadline(pred);
  const last = latestScan(patient);
  const ring = statusColor(patient.status);
  const Icon = patient.status === "cleared" ? Check : patient.status === "delayed" ? Clock : AlertTriangle;
  const statusText =
    patient.status === "cleared" ? "Cleared today"
      : pred.daysRemaining === null ? "Non-union risk"
      : `${pred.daysRemaining} days to walk`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border bg-bg-card p-5 text-left transition-all",
        selected
          ? "border-accent shadow-[0_0_40px_-10px_var(--accent-glow)]"
          : "border-line hover:border-accent/60"
      )}
    >
      {/* status ribbon */}
      <span
        className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider"
        style={{ background: `${ring}20`, color: ring, border: `1px solid ${ring}40` }}
      >
        <Icon size={11} strokeWidth={2.4} />
        {statusLabel(patient.status)}
      </span>

      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full text-[15px] font-semibold"
          style={{ background: ring, color: "#001619" }}
        >
          {patient.name.split(" ").map((s) => s[0]).join("")}
        </span>
        <div className="leading-tight">
          <div className="font-display text-base font-semibold text-text">{patient.name}</div>
          <div className="text-[11px] text-text-faint">
            {patient.id} · {patient.age} yr · {patient.sex} · {patient.fractureType}
          </div>
        </div>
      </div>

      {/* sparkline */}
      <div className="-mx-1">
        <TrajectoryChart patient={patient} sparkline width={300} height={88} />
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-text-faint">
            Bone stiffness
          </div>
          <div className="mt-0.5 font-mono text-xl font-semibold text-text">
            {Math.round(last.tsiPct)}<span className="text-base text-text-faint">%</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.16em] text-text-faint">
            Verdict
          </div>
          <div className="mt-0.5 text-[13px] font-medium" style={{ color: ring }}>
            {statusText}
          </div>
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1 text-[12px] text-text-muted transition-colors group-hover:text-accent">
        Open full chart <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}

function PatientDetail({ patient }: { patient: Patient }) {
  const pred = predict(patient);
  const head = predictionHeadline(pred);
  const last = latestScan(patient);
  const ring = statusColor(patient.status);
  const recent = patient.scans.slice(-6).reverse();

  const risks: string[] = [];
  if (patient.smoker)  risks.push("Smoker");
  if (patient.diabetic) risks.push("Diabetic");
  if (patient.age >= 65) risks.push("Age over 65");

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="surface flex flex-col p-6">
        <header className="mb-3 flex items-baseline justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint">
              Healing trajectory
            </div>
            <div className="mt-0.5 font-display text-lg font-semibold text-text">
              {patient.name}'s recovery curve
            </div>
          </div>
          <div className="text-[11px] text-text-muted">
            {patient.scans.length} scans · since {patient.fractureDate}
          </div>
        </header>

        <TrajectoryChart patient={patient} height={340} />

        {/* ==================== Large comparison panel ==================== */}
        <div className="mt-6 border-t border-line pt-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint">Scan comparison</div>
              <div className="mt-0.5 font-display text-lg font-semibold text-text">Compare two scans in detail</div>
            </div>
            <div className="text-[11px] text-text-muted">Interactive · large view</div>
          </div>

          <LargeCompare patient={patient} />
        </div>

        {/* legend strip */}
        <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-line pt-3 text-[11px] text-text-muted">
          <LegendDot color="var(--text-faint)" dashed label="Population average" />
          <LegendDot color={ring} label="Personal prediction" />
          <LegendDot color="var(--text)" label="Actual scan readings" />
          <LegendDot color="var(--safe)" dashed label="Safe-to-walk threshold (80%)" />
        </div>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="surface p-5" style={{ borderLeft: `3px solid ${ring}` }}>
          <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">
            Time to walk
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-4xl font-semibold leading-none" style={{ color: ring }}>
              {head.daysText}
            </span>
            {pred.daysRemaining !== null && pred.daysRemaining > 0 && (
              <span className="font-mono text-base text-text-faint">days</span>
            )}
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-text-muted">
            {head.message}
          </p>
        </div>

        {risks.length > 0 && (
          <div className="surface p-5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">
              Things slowing healing
            </div>
            <ul className="mt-2 flex flex-col gap-1.5">
              {risks.map((r) => (
                <li key={r} className="flex items-center gap-2 text-[13px] text-text">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--caution)" }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="surface p-5">
          <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">
            Recent scans
          </div>
          <div className="mt-3 divide-y divide-line text-[12px]">
            {recent.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-text">{formatDate(s.date)}</div>
                  <div className="text-text-faint">week {s.week.toFixed(1)}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium text-text">
                    {s.tsiPct.toFixed(0)}%
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-text-faint">
                    {s.classification}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function LargeCompare({ patient }: { patient: Patient }) {
  const scans = patient.scans.slice().sort((a,b)=>a.date.localeCompare(b.date));
  const [fromIdx, setFromIdx] = useState(Math.max(0, scans.length - 2));
  const [toIdx, setToIdx] = useState(Math.max(0, scans.length - 1));

  const from = scans[fromIdx] ?? scans[0];
  const to = scans[toIdx] ?? scans[scans.length - 1];
  const summary = computeImprovementBetween(from, to);

  const fromShape = buildScan({ callusPct: from.tsiPct, pressureN: 3.5, implantLoose: false, week: from.week, fHealthy: 850 });
  const toShape = buildScan({ callusPct: to.tsiPct, pressureN: 3.5, implantLoose: false, week: to.week, fHealthy: 850 });

  return (
    <div className="grid gap-4 lg:grid-cols-3 items-start">
      <div className="lg:col-span-2">
        <div className="flex gap-3">
          <div className="flex-1 surface p-4">
            <div className="text-[11px] text-text-faint mb-2">Older scan · {from.date} · TSI {from.tsiPct}%</div>
            <ResonanceGraph shape={fromShape} progress={1} height={420} showHealthy={false} />
          </div>
          <div className="flex-1 surface p-4">
            <div className="text-[11px] text-text-faint mb-2">Newer scan · {to.date} · TSI {to.tsiPct}%</div>
            <ResonanceGraph shape={toShape} progress={1} height={420} showHealthy={false} />
          </div>
        </div>
      </div>

      <div className="surface p-4">
        <div className="text-[10px] uppercase tracking-[0.16em] text-text-faint">Compare</div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          <select value={fromIdx} onChange={(e)=>setFromIdx(Number(e.target.value))}>
            {scans.map((s,i)=>(<option key={`${s.date}-${i}`} value={i}>{s.date} · {s.tsiPct}%</option>))}
          </select>
          <select value={toIdx} onChange={(e)=>setToIdx(Number(e.target.value))}>
            {scans.map((s,i)=>(<option key={`${s.date}-${i}`} value={i}>{s.date} · {s.tsiPct}%</option>))}
          </select>

          <div className="mt-2">
            <div className="font-mono text-[28px] font-semibold" style={{ color: summary.deltaAbs >= 0 ? "var(--safe)" : "var(--danger)" }}>
              {summary.deltaAbs >= 0 ? `+${summary.deltaAbs}%` : `${summary.deltaAbs}%`}
            </div>
            <div className="text-[12px] text-text-faint mt-1">{summary.fromDate} → {summary.toDate} · {summary.weeksElapsed} weeks</div>
            <div className="mt-3 text-[13px]">{summary.advice}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label, dashed = false }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block h-[2px] w-5"
        style={{
          background: dashed ? "transparent" : color,
          borderTop: dashed ? `2px dashed ${color}` : "none",
        }}
      />
      {label}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
