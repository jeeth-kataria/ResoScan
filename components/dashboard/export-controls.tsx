"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/patients";
import { generateClinicalSummary } from "@/lib/summary";

export function ExportControls({ patient, shape }: { patient: Patient; shape: any }) {
  function downloadCsv() {
    const rows = ["date,week,tsiPct,fnHz,zeta,classification"];
    for (const s of patient.scans) rows.push(`${s.date},${s.week},${s.tsiPct},${s.fnHz},${s.zeta},${s.classification}`);
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${patient.id}_scans.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function printSummary() {
    const summary = generateClinicalSummary({ bone: patient.bone, fractureType: patient.fractureType, week: shape.metrics.week ?? 0, m: shape.metrics, patientName: patient.name });
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${patient.id} summary</title></head><body><h1>${patient.name} - ${patient.id}</h1><p>${summary}</p><h2>Scans</h2><table border="1" cellpadding="6"><tr><th>date</th><th>week</th><th>tsi</th><th>fnHz</th></tr>${patient.scans.map(s=>`<tr><td>${s.date}</td><td>${s.week}</td><td>${s.tsiPct}</td><td>${s.fnHz}</td></tr>`).join("")}</table></body></html>`;
    const w = window.open("", "print_summary");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(()=>{ w.print(); }, 200);
  }

  return (
    <div className="surface p-4 flex gap-2">
      <Button onClick={downloadCsv} variant="outline">Download CSV</Button>
      <Button onClick={printSummary} variant="primary">Print Summary</Button>
    </div>
  );
}

export default ExportControls;
