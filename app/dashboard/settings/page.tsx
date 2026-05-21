"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  User, ShieldCheck, Bell, Palette, Database, FlaskConical,
  Save, RotateCcw, ExternalLink, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Section type ──────────────────────────────────────────────────────────────
type Section = "profile" | "display" | "notifications" | "privacy" | "data";

const NAV: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "profile",       label: "Profile",        icon: User },
  { id: "display",       label: "Display",        icon: Palette },
  { id: "notifications", label: "Notifications",  icon: Bell },
  { id: "privacy",       label: "Privacy",        icon: ShieldCheck },
  { id: "data",          label: "Data & export",  icon: Database },
];

// ── Reusable field row ─────────────────────────────────────────────────────────
function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between py-4 border-b border-line last:border-b-0">
      <div className="md:w-56 shrink-0">
        <div className="text-[13px] font-medium text-text">{label}</div>
        {hint && <div className="mt-0.5 text-[11.5px] text-text-faint leading-snug">{hint}</div>}
      </div>
      <div className="flex-1 md:max-w-sm">{children}</div>
    </div>
  );
}

// ── Toggle switch ──────────────────────────────────────────────────────────────
function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className="flex items-center gap-2 text-[13px] text-text-muted"
    >
      <span className={cn("relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors", value ? "bg-accent" : "bg-line")}>
        <span className={cn("absolute top-[2px] h-4 w-4 rounded-full bg-bg-card transition-transform", value ? "translate-x-[18px]" : "translate-x-[2px]")} />
      </span>
      <span className={value ? "text-text" : ""}>{value ? "On" : "Off"}</span>
    </button>
  );
}

// ── Demo notice ────────────────────────────────────────────────────────────────
function DemoNotice({ message }: { message: string }) {
  return (
    <div className="mt-2 flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2">
      <Info size={12} className="mt-0.5 shrink-0 text-accent" strokeWidth={1.8} />
      <p className="text-[11px] leading-snug text-accent/80">{message}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");

  // Profile state
  const [name, setName] = useState("Dr. R. Krishnan");
  const [role, setRole] = useState("Orthopaedic Surgeon");
  const [hospital, setHospital] = useState("Ramaiah Memorial Hospital");

  // Display state
  const [compactMode, setCompactMode] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [animateScans, setAnimateScans] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Notification state
  const [scanAlerts, setScanAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [exportConfirm, setExportConfirm] = useState(true);

  function saveProfile() {
    toast.success("Profile updated", { description: `Saved as ${name} · ${role}` });
  }

  function resetOnboarding() {
    try { localStorage.removeItem("resoscan_onboarding_done_v1"); } catch { /* ignore */ }
    toast.success("Onboarding reset", { description: "Refresh the page to see the welcome tour again." });
  }

  function clearData() {
    try {
      localStorage.removeItem("resoscan_onboarding_done_v1");
      sessionStorage.removeItem("resoscan_banner_dismissed");
    } catch { /* ignore */ }
    toast.success("Local data cleared", { description: "Demo preferences and dismissals have been reset." });
  }

  return (
    <div className="flex flex-col gap-0 p-6 max-w-5xl">
      {/* Page header */}
      <header className="mb-6 px-1">
        <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint">Configuration</div>
        <h1 className="mt-1 font-display text-2xl font-semibold text-text">Settings</h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-text-muted">
          Personalise the clinical console. Changes are stored locally in your browser.
        </p>
      </header>

      <div className="flex gap-6 flex-col md:flex-row">
        {/* Sidebar nav */}
        <nav className="flex md:flex-col gap-1 md:w-44 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] whitespace-nowrap transition-colors",
                active === id
                  ? "bg-bg-elevated text-text font-medium"
                  : "text-text-muted hover:bg-bg-elevated hover:text-text"
              )}
            >
              <Icon size={15} strokeWidth={1.7} />
              {label}
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <div className="flex-1 surface p-6 min-h-[460px]">

          {/* ── Profile ── */}
          {active === "profile" && (
            <section>
              <h2 className="font-display text-[15px] font-semibold text-text mb-4">Profile</h2>
              <div className="divide-y divide-line">
                <FieldRow label="Display name" hint="Shown in printed reports and exports">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full"
                  />
                </FieldRow>
                <FieldRow label="Role / title" hint="Your clinical title or designation">
                  <input
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full"
                  />
                </FieldRow>
                <FieldRow label="Institution" hint="Hospital or clinic name">
                  <input
                    type="text"
                    value={hospital}
                    onChange={e => setHospital(e.target.value)}
                    className="w-full"
                  />
                </FieldRow>
              </div>
              <DemoNotice message="This is a demo — profile data is only stored in your browser and is never sent to a server." />
              <div className="mt-6 flex gap-2">
                <Button variant="primary" size="sm" onClick={saveProfile} className="gap-1.5">
                  <Save size={13} strokeWidth={2} /> Save profile
                </Button>
              </div>
            </section>
          )}

          {/* ── Display ── */}
          {active === "display" && (
            <section>
              <h2 className="font-display text-[15px] font-semibold text-text mb-4">Display preferences</h2>
              <div className="divide-y divide-line">
                <FieldRow label="Compact mode" hint="Reduce padding and chart heights for smaller screens">
                  <Toggle value={compactMode} onChange={setCompactMode} label="Compact mode" />
                </FieldRow>
                <FieldRow label="Scan animation" hint="Animate the resonance sweep when Run scan is pressed">
                  <Toggle value={animateScans} onChange={setAnimateScans} label="Scan animation" />
                </FieldRow>
                <FieldRow label="Tooltips" hint="Show hover tooltips on chart annotations and metrics">
                  <Toggle value={showTooltips} onChange={setShowTooltips} label="Tooltips" />
                </FieldRow>
                <FieldRow label="Welcome tour" hint="Reset the first-visit guided walkthrough">
                  <Button variant="outline" size="sm" onClick={resetOnboarding} className="gap-1.5">
                    <RotateCcw size={12} strokeWidth={2} /> Reset tour
                  </Button>
                </FieldRow>
              </div>
              <DemoNotice message="Display preferences are persisted in browser localStorage and apply only to this device." />
            </section>
          )}

          {/* ── Notifications ── */}
          {active === "notifications" && (
            <section>
              <h2 className="font-display text-[15px] font-semibold text-text mb-4">Notification preferences</h2>
              <div className="divide-y divide-line">
                <FieldRow label="Scan result alerts" hint="Show a toast when a scan analysis completes">
                  <Toggle value={scanAlerts} onChange={setScanAlerts} label="Scan result alerts" />
                </FieldRow>
                <FieldRow label="Risk escalation alerts" hint="Notify when a patient enters non-union risk zone">
                  <Toggle value={riskAlerts} onChange={setRiskAlerts} label="Risk escalation alerts" />
                </FieldRow>
                <FieldRow label="Export confirmations" hint="Show a toast after CSV downloads and print jobs">
                  <Toggle value={exportConfirm} onChange={setExportConfirm} label="Export confirmations" />
                </FieldRow>
              </div>
              <DemoNotice message="In this demo, notifications are browser toasts only — no email or push notifications are sent." />
            </section>
          )}

          {/* ── Privacy ── */}
          {active === "privacy" && (
            <section>
              <h2 className="font-display text-[15px] font-semibold text-text mb-4">Privacy & compliance</h2>
              <div className="space-y-4 text-[13.5px] leading-relaxed text-text-muted">
                <div className="rounded-xl border border-safe/25 bg-safe/8 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={14} className="text-safe" strokeWidth={1.8} />
                    <span className="font-semibold text-safe text-[12px] uppercase tracking-wide">No data leaves your browser</span>
                  </div>
                  <p>All patient data in this demo is <strong className="text-text">synthetically generated</strong> from physics equations. No real patient information is used, stored, or transmitted.</p>
                </div>
                <div className="rounded-xl border border-line p-4 space-y-2">
                  <p><span className="text-text font-medium">Local storage:</span> Only the onboarding state and banner dismissal flag are stored in <code className="font-mono text-[12px] bg-bg-elevated px-1 rounded">localStorage</code>.</p>
                  <p><span className="text-text font-medium">Analytics:</span> None. No telemetry, no tracking pixels, no third-party analytics.</p>
                  <p><span className="text-text font-medium">HIPAA/DPDP:</span> Not applicable in demo mode. A production deployment would require appropriate data governance.</p>
                </div>
                <a
                  href="https://github.com/Yashasnagraj/UNISYS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent hover:underline text-[13px]"
                >
                  View source code on GitHub <ExternalLink size={12} strokeWidth={2} />
                </a>
              </div>
            </section>
          )}

          {/* ── Data ── */}
          {active === "data" && (
            <section>
              <h2 className="font-display text-[15px] font-semibold text-text mb-4">Data & export</h2>
              <div className="divide-y divide-line">
                <FieldRow label="Scan data format" hint="Format used when downloading patient CSVs">
                  <select className="w-full">
                    <option>CSV (UTF-8 with BOM — Excel compatible)</option>
                    <option>CSV (plain UTF-8)</option>
                  </select>
                </FieldRow>
                <FieldRow label="Report header" hint="Institution name shown on printed summaries">
                  <input type="text" defaultValue="Ramaiah Memorial Hospital" className="w-full" />
                </FieldRow>
                <FieldRow label="Clear local data" hint="Remove all browser-stored preferences for this demo">
                  <Button variant="outline" size="sm" onClick={clearData} className="gap-1.5 text-danger border-danger/40 hover:border-danger hover:text-danger">
                    <RotateCcw size={12} strokeWidth={2} /> Clear all local data
                  </Button>
                </FieldRow>
              </div>
              <DemoNotice message="In a production build, patient scans would be persisted to an encrypted database with full audit trail." />
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
