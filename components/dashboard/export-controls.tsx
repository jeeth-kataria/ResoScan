"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/patients";
import type { ScanShape } from "@/lib/scan";
import { generateClinicalSummary } from "@/lib/summary";

export function ExportControls({ patient, shape, currentWeek = 0 }: { patient: Patient; shape: ScanShape; currentWeek?: number }) {
  function downloadCsv() {
    try {
      const rows = ["date,week,tsiPct,fnHz,zeta,classification"];
      for (const s of patient.scans) rows.push(`${s.date},${s.week},${s.tsiPct},${s.fnHz},${s.zeta},${s.classification}`);
      const csvContent = "\uFEFF" + rows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${patient.id}_scans.csv`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
      toast.success(`CSV downloaded`, {
        description: `${patient.scans.length} scans for ${patient.name} (${patient.id})`,
      });
    } catch {
      toast.error("Download failed", { description: "Could not generate CSV file." });
    }
  }

  function printSummary() {
    try {
      const summary = generateClinicalSummary({ bone: patient.bone, fractureType: patient.fractureType, week: currentWeek, m: shape.metrics, patientName: patient.name });
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>${patient.id} summary</title></head><body><h1>${patient.name} - ${patient.id}</h1><p>${summary}</p><h2>Scans</h2><table border="1" cellpadding="6"><tr><th>date</th><th>week</th><th>tsi</th><th>fnHz</th></tr>${patient.scans.map(s=>`<tr><td>${s.date}</td><td>${s.week}</td><td>${s.tsiPct}</td><td>${s.fnHz}</td></tr>`).join("")}</table></body></html>`;
      const w = window.open("", "print_summary");
      if (!w) { toast.error("Pop-up blocked", { description: "Allow pop-ups for this site to print the report." }); return; }
      w.document.write(html);
      w.document.close();
      w.focus();
      setTimeout(() => { w.print(); }, 200);
      toast.success("Print dialog opened", { description: `Clinical summary for ${patient.name}` });
    } catch {
      toast.error("Print failed", { description: "Could not open print window." });
    }
  }

  return (
    <div className="surface p-4 flex gap-2">
      <Button onClick={downloadCsv} variant="outline">Download CSV</Button>
      <Button onClick={printSummary} variant="primary">Print Summary</Button>
    </div>
  );
}

export default ExportControls;
