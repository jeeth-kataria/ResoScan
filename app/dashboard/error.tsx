"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting in a real app
    console.error("[ResoScan error]", error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-12 text-center">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-danger/30 bg-danger/10">
        <AlertTriangle size={28} className="text-danger" strokeWidth={1.6} />
      </div>

      {/* Copy */}
      <div className="max-w-md">
        <h1 className="font-display text-xl font-semibold text-text">
          Something went wrong
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
          The clinical console hit an unexpected error. Your scan data has not been lost.
          Try refreshing the view — if the problem persists, return to the dashboard home.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-text-faint">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={reset}
          className="gap-2"
        >
          <RefreshCw size={14} strokeWidth={2} />
          Try again
        </Button>
        <Link href="/dashboard/scan">
          <Button variant="outline" size="md" className="gap-2">
            <Home size={14} strokeWidth={1.8} />
            Back to scan
          </Button>
        </Link>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-text-faint">
        This is a demo environment — no patient data is stored or transmitted.
      </p>
    </div>
  );
}
