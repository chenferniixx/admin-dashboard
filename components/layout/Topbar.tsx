"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const PATH_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.USERS]: "Users",
  [ROUTES.PRODUCTS]: "Products",
};

const PATH_ICONS: Record<string, typeof LayoutDashboard> = {
  [ROUTES.DASHBOARD]: LayoutDashboard,
  [ROUTES.USERS]: Users,
  [ROUTES.PRODUCTS]: Package,
};

function getPageTitle(pathname: string): string {
  return PATH_TITLES[pathname] ?? "Dashboard";
}

function getPageIcon(pathname: string) {
  return PATH_ICONS[pathname] ?? LayoutDashboard;
}

/**
 * Topbar: page title, sidebar toggle, user dropdown.
 */
export function Topbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const toggleSidebar = useAuthStore((s) => s.toggleSidebar);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pageTitle = getPageTitle(pathname ?? "");
  const PageIcon = getPageIcon(pathname ?? "");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [userMenuOpen]);

  function handleSignOut() {
    signOut({ callbackUrl: "/auth/login" });
  }

  return (
    <header
      className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-4 shadow-sm"
      role="banner"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="shrink-0 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
        <div
          className="flex items-center gap-2.5"
          aria-hidden
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <PageIcon className="h-5 w-5" />
          </div>
          <span className="truncate text-lg font-semibold tracking-tight text-slate-800">
            {pageTitle}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {status === "loading" && (
          <span className="text-sm text-slate-500">Loading…</span>
        )}
        {status === "authenticated" && session?.user && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {session.user.name ?? session.user.email ?? "User"}
                </p>
                <p className="text-xs text-slate-500">
                  {session.user.role ?? "—"}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-400 transition-transform",
                  userMenuOpen && "rotate-180"
                )}
              />
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                role="menu"
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">
                    {session.user.name ?? "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {session.user.email}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {status === "unauthenticated" && (
          <Link href="/auth/login">
            <Button
              type="button"
              size="sm"
              className="rounded-lg font-medium shadow-sm"
            >
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
