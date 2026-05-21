"use client";

import React, { useState } from "react";
import type { Scan } from "@/lib/patients";

export function DateRangeSelector({
  scans,
  onChange,
}: {
  scans: Scan[];
  onChange: (fromWeek: number, toWeek: number) => void;
}) {
  const sorted = scans.slice().sort((a, b) => a.date.localeCompare(b.date));

  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(Math.max(0, sorted.length - 1));

  function handleFromChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const idx = Number(e.target.value);
    setFromIdx(idx);
    onChange(sorted[idx].week, sorted[toIdx].week);
  }

  function handleToChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const idx = Number(e.target.value);
    setToIdx(idx);
    onChange(sorted[fromIdx].week, sorted[idx].week);
  }

  return (
    <div className="surface p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-faint">Highlight range</div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <select value={fromIdx} onChange={handleFromChange}>
          {sorted.map((s, i) => (
            <option key={`${s.date}-${i}`} value={i}>
              {s.date} · wk {s.week.toFixed(1)}
            </option>
          ))}
        </select>
        <select value={toIdx} onChange={handleToChange}>
          {sorted.map((s, i) => (
            <option key={`${s.date}-${i}`} value={i}>
              {s.date} · wk {s.week.toFixed(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DateRangeSelector;
