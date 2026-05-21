import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-bg-elevated",
        className
      )}
    />
  );
}

/** A full scan-page skeleton shown while the page hydrates */
export function ScanPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* onboarding hint */}
      <Skeleton className="h-12 w-full" />
      {/* top 3-col grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-5">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex flex-col gap-5">
          <Skeleton className="h-[420px] w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
      {/* deeper section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
      {/* metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

/** Patients page skeleton */
export function PatientsPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Skeleton className="h-20 w-72" />
      <div className="grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
