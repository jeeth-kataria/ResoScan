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
      <div className="mt-2 grid grid-cols-2 gap-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded border border-line px-2 py-1" />
        <input type="number" value={tsi} onChange={(e) => setTsi(Number(e.target.value))} min={0.5} max={99.9} step={0.1} className="rounded border border-line px-2 py-1" />
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="submit" variant="primary" disabled={adding}>Add scan</Button>
      </div>
    </form>
  );
}

export default AddScanForm;
