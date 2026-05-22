"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calendar, Plus, Sparkles, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fnFromTsi, zetaFromTsi } from "@/lib/patients";
import type { Scan } from "@/lib/patients";

export function AddScanForm({ onAdd }: { onAdd: (s: Scan) => void }) {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [tsi, setTsi] = useState<number>(50);
  const [adding, setAdding] = useState(false);

  // Derive dynamic classification
  const classification = tsi >= 75 ? "Stable" : tsi >= 40 ? "Delayed Union" : "Non-Union";
  const badgeClass =
    tsi >= 75
      ? "badge-safe"
      : tsi >= 40
      ? "badge-caution"
      : "badge-danger";

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const tsiVal = Number(tsi);
    if (isNaN(tsiVal) || tsiVal < 0.5 || tsiVal > 99.9) {
      toast.error("TSI must be between 0.5 and 99.9 %");
      return;
    }
    if (!date) {
      toast.error("Please enter a scan date");
      return;
    }
    setAdding(true);
    const clamped = Math.max(0.5, Math.min(99.9, tsiVal));
    const scan: Scan = {
      date,
      week: 0, // caller recalcs from fracture date
      fnHz: +fnFromTsi(clamped).toFixed(1),
      tsiPct: +clamped.toFixed(1),
      zeta: +zetaFromTsi(clamped).toFixed(3),
      classification,
    };
    onAdd(scan);
    setAdding(false);
    toast.success(`Scan added — TSI ${clamped.toFixed(1)}% · ${classification}`, {
      description: `Recorded on ${date}. Timeline and prediction updated.`,
    });
  }

  return (
    <form onSubmit={submit} className="surface card-hover p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <Plus size={16} className="text-accent" />
          <span className="text-[11px] uppercase tracking-[0.18em] text-text-faint font-semibold">
            Add new patient scan
          </span>
        </div>
        <span className={`badge ${badgeClass} transition-colors duration-200`}>
          {classification}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Date picker */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="add-scan-date" className="text-[11.5px] font-medium text-text flex items-center gap-1.5">
            <Calendar size={13} className="text-text-muted" />
            Scan Date
          </label>
          <input
            id="add-scan-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-bg-elevated border border-line rounded-lg px-3 py-2 text-[13px] text-text font-mono focus:border-accent focus:outline-none"
          />
        </div>

        {/* TSI Slider & Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <label htmlFor="add-scan-tsi" className="text-[11.5px] font-medium text-text">
              Tibial Stiffness Index (TSI)
            </label>
            <div className="flex items-center gap-1 bg-bg-elevated border border-line rounded-lg px-2 py-0.5">
              <input
                id="add-scan-tsi"
                type="number"
                value={tsi}
                onChange={(e) => setTsi(Math.max(0.5, Math.min(99.9, Number(e.target.value))))}
                min={0.5}
                max={99.9}
                step={0.1}
                className="w-14 text-right bg-transparent text-[13px] font-mono text-text font-semibold border-none focus:outline-none p-0"
              />
              <span className="text-[11px] text-text-faint">%</span>
            </div>
          </div>

          {/* Range Slider for UX */}
          <input
            type="range"
            min={0.5}
            max={99.9}
            step={0.1}
            value={tsi}
            onChange={(e) => setTsi(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--accent)]"
            style={{
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${
                ((tsi - 0.5) / (99.9 - 0.5)) * 100
              }%, var(--line) ${((tsi - 0.5) / (99.9 - 0.5)) * 100}%, var(--line) 100%)`,
            }}
          />

          {/* Quick guidelines */}
          <div className="mt-1 flex flex-col gap-1 text-[11px] text-text-muted leading-relaxed">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-safe" />
              <span>&ge; 75%: Stable / Safe to bear weight</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-caution" />
              <span>40% - 74%: Delayed Union / Partial weight</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-danger" />
              <span>&lt; 40%: Non-Union / Stalled healing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={adding}>
        {adding ? (
          "Recording scan..."
        ) : (
          <>
            <Sparkles size={14} className="mr-1" />
            Add scan to history
          </>
        )}
      </Button>
    </form>
  );
}

export default AddScanForm;
