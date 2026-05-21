import type { Metadata } from "next";
import { Suspense } from "react";
import { ShellRail } from "@/components/dashboard/shell-rail";
import { ShellTopbar } from "@/components/dashboard/shell-topbar";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export const metadata: Metadata = {
  title: "ResoScan Clinical Console",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-bg-primary">
      <Suspense fallback={null}>
        <ShellRail />
      </Suspense>
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <Suspense fallback={<div className="h-16 border-b border-line" />}>
          <ShellTopbar />
        </Suspense>
        {/* pb-20 md:pb-0 reserves space for the mobile bottom nav */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">{children}</main>
      </div>
      <Suspense fallback={null}>
        <MobileNav />
      </Suspense>
    </div>
  );
}
