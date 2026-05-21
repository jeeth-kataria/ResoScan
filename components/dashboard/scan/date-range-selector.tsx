"use client";

import React from "react";
import type { Scan } from "@/lib/patients";

export function DateRangeSelector({
  scans,
  onChange,
}: {
  scans: Scan[];
  onChange: (fromWeek: number, toWeek: number) => void;
}) {
  const sorted = scans.slice().sort((a,b)=>a.date.localeCompare(b.date));

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>, which: "from" | "to"){
    const idx = Number(e.target.value);
    const fromIdx = which === "from" ? idx : undefined;
    const toIdx = which === "to" ? idx : undefined;
    const currentFrom = Number((document.getElementById("drs-from") as HTMLSelectElement).value);
    const currentTo = Number((document.getElementById("drs-to") as HTMLSelectElement).value);
    const f = fromIdx !== undefined ? fromIdx : currentFrom;
    const t = toIdx !== undefined ? toIdx : currentTo;
    const fromWeek = sorted[f].week;
    const toWeek = sorted[t].week;
    onChange(fromWeek, toWeek);
  }

  return (
    <div className="surface p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">Highlight range</div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <select id="drs-from" onChange={(e)=>handleChange(e,"from")} className="rounded border border-line px-2 py-1">
          {sorted.map((s,i)=>(<option key={`${s.date}-${i}`} value={i}>{s.date} · wk {s.week.toFixed(1)}</option>))}
        </select>
        <select id="drs-to" onChange={(e)=>handleChange(e,"to")} className="rounded border border-line px-2 py-1">
          {sorted.map((s,i)=>(<option key={`${s.date}-${i}`} value={i}>{s.date} · wk {s.week.toFixed(1)}</option>))}
        </select>
      </div>
    </div>
  );
}

export default DateRangeSelector;
