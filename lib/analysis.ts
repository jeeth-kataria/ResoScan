import type { Patient, Scan } from "./patients";

export type ImprovementSummary = {
  fromDate: string;
  toDate: string;
  tsiFrom: number;
  tsiTo: number;
  deltaAbs: number;
  deltaPct: number; // relative to from
  weeksElapsed: number;
  weeklyRate: number; // tsi points per week
  advice: string;
};

function parseIso(iso: string): Date {
  return new Date(iso + "T00:00:00Z");
}

export function computeImprovement(patient: Patient): ImprovementSummary {
  const scans = patient.scans.slice().sort((a, b) => a.date.localeCompare(b.date));
  const first = scans[0];
  const last = scans[scans.length - 1];

  const tsiFrom = first.tsiPct;
  const tsiTo = last.tsiPct;
  const deltaAbs = +(tsiTo - tsiFrom).toFixed(1);
  const deltaPct = +(deltaAbs / Math.max(0.1, tsiFrom) * 100).toFixed(1);

  const days = (parseIso(last.date).getTime() - parseIso(first.date).getTime()) / (1000 * 60 * 60 * 24);
  const weeksElapsed = +(days / 7).toFixed(2);
  const weeklyRate = weeksElapsed > 0 ? +(deltaAbs / weeksElapsed).toFixed(2) : 0;

  // Simple advice rules tuned for UX: be conservative and actionable
  let advice = "";
  if (deltaAbs >= 10) {
    advice = "Marked improvement — continue current plan and reassess in clinic.";
  } else if (deltaAbs >= 3) {
    advice = "Moderate improvement — encourage gradual weight-bearing and repeat scan in 2–4 weeks.";
  } else if (deltaAbs >= 0) {
    advice = "Minimal change — maintain protection, consider physiotherapy and repeat scan.";
  } else {
    advice = "Worsening TSI — urgent clinical review recommended; consider radiograph and surgical review.";
  }

  return {
    fromDate: first.date,
    toDate: last.date,
    tsiFrom,
    tsiTo,
    deltaAbs,
    deltaPct,
    weeksElapsed,
    weeklyRate,
    advice,
  };
}
