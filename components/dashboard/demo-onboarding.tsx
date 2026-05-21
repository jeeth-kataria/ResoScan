"use client";

import { useState, useEffect } from "react";
import { X, Activity, Users, Sparkles, Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "resoscan_onboarding_done_v1";

const STEPS = [
  {
    icon: Activity,
    color: "var(--accent)",
    title: "Live Scan Simulator",
    body: "Press \"Run scan\" to watch a resonance sweep happen in real time. Drag the sliders to see how callus stiffness, pressure, and healing week change the bone's frequency signature — and the AI verdict — instantly.",
  },
  {
    icon: Users,
    color: "var(--caution)",
    title: "Three real patient stories",
    body: "Switch between Arjun (cleared), Priya (delayed union), and Vikram (non-union risk) from the top-right picker. Each has a different fracture type and comorbidity profile — the AI responds differently to every one.",
  },
  {
    icon: Sparkles,
    color: "var(--safe)",
    title: "Transparent AI",
    body: "The Model page shows the confusion matrix, ROC curves, and feature importances from the actual Random Forest that powers every verdict. Nothing is a black box here.",
  },
  {
    icon: Play,
    color: "var(--accent)",
    title: "All data is synthetic",
    body: "Every scan, frequency, and prediction is computed in your browser from physics equations — no backend, no real patient data. Feel free to add scans, export CSVs, and explore without any risk.",
  },
];

export function DemoOnboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function finish() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
    setOpen(false);
  }

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else finish();
  }

  if (!open) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
        onClick={finish}
        aria-hidden
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-line bg-bg-card shadow-2xl">

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent breathe" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-text-faint">
              Welcome to ResoScan
            </span>
          </div>
          <button
            onClick={finish}
            className="rounded p-1 text-text-faint transition-colors hover:text-text"
            aria-label="Skip introduction"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Step content */}
        <div className="px-6 py-8">
          {/* Icon bubble */}
          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: `${current.color}18`, border: `1px solid ${current.color}35` }}
          >
            <Icon size={26} strokeWidth={1.5} style={{ color: current.color }} />
          </div>

          {/* Text */}
          <h2 className="font-display text-xl font-semibold text-text">{current.title}</h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">{current.body}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-4 bg-accent" : "w-1.5 bg-line hover:bg-text-faint"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isLast && (
              <button
                onClick={finish}
                className="text-[12px] text-text-faint hover:text-text-muted transition-colors"
              >
                Skip
              </button>
            )}
            <Button variant="primary" size="sm" onClick={next} className="gap-1.5">
              {isLast ? "Open dashboard" : "Next"}
              {!isLast && <ChevronRight size={13} strokeWidth={2.2} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
