"use client";

import { Eye, Banknote, AlertTriangle } from "lucide-react";

const PROBLEMS = [
  {
    icon: Eye,
    headline: "X-ray shows calcium, not strength.",
    body: "A fracture regains mechanical stiffness 3–4 weeks before it looks healed on a film. Surgeons make the weight-bearing decision by feel.",
    accent: "var(--caution)",
    accentBg: "rgba(234,179,8,0.08)",
    n: "01",
  },
  {
    icon: Banknote,
    headline: "₹25 lakh of equipment exists.",
    body: "The only devices that actually measure tissue stiffness cost between ₹15 and ₹35 lakh and live in major hospitals. Rural clinics see none of it.",
    accent: "var(--danger)",
    accentBg: "rgba(239,68,68,0.08)",
    n: "02",
  },
  {
    icon: AlertTriangle,
    headline: "1 in 5 fractures heal slowly.",
    body: "Delayed union or non-union affects 5–20% of fractures depending on bone and patient. Without a way to measure healing, surgeons learn too late.",
    accent: "var(--accent)",
    accentBg: "rgba(6,182,212,0.08)",
    n: "03",
  },
];

export function LandingProblem() {
  return (
    <section className="border-t border-line bg-bg-panel px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint">
            The problem
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            The bone heals weeks before{" "}
            <span className="text-accent">the X-ray catches up.</span>
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-text-muted">
            Orthopedic surgeons are making high-stakes decisions with 50-year-old technology.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <ProblemCard key={p.n} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  icon: Icon,
  headline,
  body,
  accent,
  accentBg,
  n,
}: {
  icon: React.ElementType;
  headline: string;
  body: string;
  accent: string;
  accentBg: string;
  n: string;
}) {
  return (
    <div
      className="surface card-hover flex flex-col gap-4 p-6"
      style={{ borderTop: `2px solid ${accent}` }}
    >
      {/* Top row: number + icon */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[11px] tracking-widest"
          style={{ color: accent }}
        >
          {n}
        </span>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: accentBg }}
        >
          <Icon size={17} style={{ color: accent }} strokeWidth={1.8} />
        </span>
      </div>

      {/* Text */}
      <div>
        <h3 className="font-display text-[16px] font-semibold leading-snug text-text">
          {headline}
        </h3>
        <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">
          {body}
        </p>
      </div>
    </div>
  );
}
