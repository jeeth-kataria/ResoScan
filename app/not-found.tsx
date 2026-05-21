import Link from "next/link";
import { Activity, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-bg-primary px-6 text-center">
      {/* Logo-ish icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-line bg-bg-card">
        <Activity size={36} className="text-accent" strokeWidth={1.4} />
      </div>

      {/* Big 404 */}
      <div>
        <div className="font-mono text-[72px] font-semibold leading-none text-text-faint/40 md:text-[96px]">
          404
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold text-text md:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-text-muted">
          This URL doesn&apos;t exist in the ResoScan clinical console.
          Head back to the dashboard or landing page.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/dashboard/scan">
          <Button variant="primary" size="lg" className="gap-2">
            <Activity size={15} strokeWidth={2} />
            Open dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg" className="gap-2">
            <Home size={15} strokeWidth={1.8} />
            Landing page
          </Button>
        </Link>
      </div>

      <p className="text-[11px] text-text-faint">ResoScan · UNISYS 2026 · Demo build</p>
    </div>
  );
}
