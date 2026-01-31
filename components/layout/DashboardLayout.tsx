"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * Dashboard layout: Topbar + Sidebar (collapsible) + main.
 * Desktop (md+): sidebar in flow, toggles visibility.
 * Mobile: sidebar as overlay below topbar; backdrop closes on click.
 * Escape key closes sidebar when open.
 */
export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useAuthStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAuthStore((s) => s.setSidebarOpen);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    if (sidebarOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [sidebarOpen, setSidebarOpen]);

  function handleBackdropClick() {
    setSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <div className="relative flex flex-1 flex-col md:flex-row">
        {/* Mobile: backdrop when sidebar open */}
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={handleBackdropClick}
            aria-label="Close sidebar"
            tabIndex={0}
          />
        )}
        {/* Sidebar: overlay on mobile, in-flow on desktop (dark) */}
        {sidebarOpen && (
          <aside
            className={[
              "z-40 flex shrink-0 flex-col shadow-xl shadow-black/10",
              "fixed left-0 top-16 bottom-0 w-64 md:relative md:top-0 md:block",
            ].join(" ")}
          >
            <Sidebar />
          </aside>
        )}
        <main className="min-w-0 flex-1 overflow-auto bg-slate-50 p-4 md:p-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
