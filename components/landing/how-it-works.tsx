"use client";

import { Zap, Ear, BrainCircuit } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Zap,
    title: "Tap",
    body: "A controlled vibration is sent through the skin into the bone using a precision voice-coil actuator.",
    accentBg: "rgba(6,182,212,0.08)",
  },
  {
    n: "02",
    icon: Ear,
    title: "Listen",
    body: "A medical-grade sensor on the opposite side records how the bone vibrates back — its unique resonant signature.",
    accentBg: "rgba(6,182,212,0.08)",
  },
  {
    n: "03",
    icon: BrainCircuit,
    title: "Predict",
    body: "The AI compares that signature to thousands of healing patterns and tells the surgeon exactly when the patient can walk.",
    accentBg: "rgba(6,182,212,0.08)",
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint">
            How it works
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Three steps,{" "}
            <span className="text-accent">twenty seconds.</span>
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-text-muted">
            No radiation. No expensive lab equipment. Just physics and AI working together.
          </p>
        </div>
        {/* Connector line on desktop */}
        <div className="relative">
          <div className="absolute top-[46px] left-[calc(16.6%+24px)] right-[calc(16.6%+24px)] hidden h-px border-t border-dashed border-line md:block" />
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <StepCard key={s.n} {...s} delay={i * 80} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  n,
  icon: Icon,
  title,
  body,
  accentBg,
  delay,
}: {
  n: string;
  icon: React.ElementType;
  title: string;
  body: string;
  accentBg: string;
  delay: number;
}) {
  return (
    <div
      className="surface card-hover flex flex-col gap-5 p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Step number + icon */}
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: accentBg }}
        >
          <Icon size={20} className="text-accent" strokeWidth={1.7} />
        </span>
        <span className="font-mono text-[13px] font-semibold tracking-widest text-accent">
          {n}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-display text-2xl font-semibold text-text">{title}</h3>
        <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">{body}</p>
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-8 bg-accent opacity-60" />
    </div>
  );
}
