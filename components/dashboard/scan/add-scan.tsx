"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { fnFromTsi, zetaFromTsi } from "@/lib/patients";
import type { Scan } from "@/lib/patients";

export function AddScanForm({ onAdd }: { onAdd: (s: Scan) => void }) {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [tsi, setTsi] = useState<number>(50);
  const [adding, setAdding] = useState(false);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setAdding(true);
    const tsiVal = Math.max(0.5, Math.min(99.9, Number(tsi)));
    const scan: Scan = {
      date,
      week: 0, // caller may recalc; use 0 placeholder
      fnHz: +fnFromTsi(tsiVal).toFixed(1),
      tsiPct: +tsiVal.toFixed(1),
      zeta: +zetaFromTsi(tsiVal).toFixed(3),
      classification: tsiVal >= 75 ? "Stable" : tsiVal >= 40 ? "Delayed Union" : "Non-Union",
    };
    onAdd(scan);
    setAdding(false);
  }

  return (
    <form onSubmit={submit} className="surface p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">Add new scan</div>
      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="add-scan-date" className="text-[11px] text-text-muted">
            Scan date
          </label>
          <input
            id="add-scan-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded border border-line px-2 py-1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="add-scan-tsi" className="text-[11px] text-text-muted">
            Tibial Stiffness Index — TSI{" "}
            <span className="text-text-faint">(0.5 – 99.9 %)</span>
          </label>
          <input
            id="add-scan-tsi"
            type="number"
            value={tsi}
            onChange={(e) => setTsi(Number(e.target.value))}
            min={0.5}
            max={99.9}
            step={0.1}
            placeholder="e.g. 65.0"
            className="w-full rounded border border-line px-2 py-1"
          />
          <p className="text-[10.5px] text-text-faint">
            80 % or above = safe for full weight-bearing
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="submit" variant="primary" disabled={adding}>Add scan</Button>
      </div>
    </form>
  );
}

export default AddScanForm;
