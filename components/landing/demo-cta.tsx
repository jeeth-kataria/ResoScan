"use client";

import Link from "next/link";
import { ArrowRight, Activity, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "95%", label: "AI accuracy" },
  { value: "20 s", label: "Scan duration" },
  { value: "₹8k", label: "Bill of materials" },
];

export function LandingDemoCta() {
  return (
    <section className="border-y border-line bg-bg-panel px-6 py-24 md:px-12">
      <div className="mx-auto max-w-4xl">
        {/* Icon chip */}
        <div className="mb-6 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10">
            <Activity size={26} className="text-accent" strokeWidth={1.5} />
          </span>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold leading-tight text-text md:text-5xl">
            See the device{" "}
            <span className="text-accent">in your hands.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14.5px] leading-relaxed text-text-muted md:text-base">
            The clinical console is the live demo. Walk through a real scan, swap between
            three patients, watch the AI predict the day each can walk.
          </p>
        </div>

        {/* Stats row */}
        <div className="mx-auto mt-10 flex max-w-sm justify-around border border-line rounded-2xl bg-bg-card px-6 py-5">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-mono text-xl font-semibold text-text">{s.value}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-text-faint">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/scan">
            <Button variant="primary" size="xl" className="gap-2">
              Open the Clinical Dashboard
              <ArrowRight size={18} strokeWidth={2.2} />
            </Button>
          </Link>
          <Link href="/dashboard/patients" className="flex items-center gap-1.5 text-[14px] text-text-muted hover:text-text transition-colors">
            Browse patients
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
