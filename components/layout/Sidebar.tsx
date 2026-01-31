"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { DASHBOARD_NAV, type NavItem } from "@/lib/nav";

const ICON_MAP: Record<NavItem["icon"], LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  users: Users,
  package: Package,
};

/** md breakpoint: close sidebar on nav click only on mobile */
const MOBILE_BREAKPOINT = 768;

/**
 * Sidebar: dark theme, brand strip, nav with active state.
 * Closes on nav click only when viewport is mobile; stays open on desktop.
 */
export function Sidebar() {
  const pathname = usePathname();
  const setSidebarOpen = useAuthStore((s) => s.setSidebarOpen);

  function handleNavClick() {
    if (typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT) {
      setSidebarOpen(false);
    }
  }

  return (
    <aside
      className="flex h-full w-64 flex-col bg-slate-900 font-sans antialiased"
      role="navigation"
      aria-label="Dashboard navigation"
    >
      {/* Brand strip: clickable link to dashboard */}
      <Link
        href="/dashboard"
        onClick={handleNavClick}
        className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-700/50 px-5 transition-colors hover:bg-slate-800/50"
        aria-label="Go to Dashboard"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/25">
          <LayoutDashboard className="h-5 w-5 text-white" aria-hidden />
        </div>
        <span className="truncate text-lg font-semibold tracking-tight text-white">
          Admin Dashboard
        </span>
      </Link>
      <nav className="flex flex-1 flex-col gap-0.5 p-4">
        <span className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </span>
        {DASHBOARD_NAV.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg border-l-4 py-2.5 pl-3 pr-3 text-sm font-medium transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                isActive
                  ? "border-primary bg-slate-800 text-white"
                  : "border-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className="h-5 w-5 shrink-0"
                aria-hidden
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-2 border-t border-slate-700/50 px-4 py-3">
        <LayoutDashboard className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
        <p className="text-xs text-slate-500">Admin Dashboard v1.0</p>
      </div>
    </aside>
  );
}
