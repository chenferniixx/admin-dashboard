"use client";

import dynamic from "next/dynamic";
import type { User } from "@/types/user";
import type { Product } from "@/types/product";

const RevenueLineChart = dynamic(
  () => import("@/components/charts").then((m) => m.RevenueLineChart),
  { ssr: false }
);

const UserRoleDonutChart = dynamic(
  () => import("@/components/charts").then((m) => m.UserRoleDonutChart),
  { ssr: false }
);

const ProductsByCategoryBarChart = dynamic(
  () =>
    import("@/components/charts").then((m) => m.ProductsByCategoryBarChart),
  { ssr: false }
);

function aggregateUsersByRole(users: User[]): { name: string; value: number }[] {
  const roleOrder = ["admin", "editor", "viewer"] as const;
  const counts: Record<string, number> = { admin: 0, editor: 0, viewer: 0 };
  for (const u of users) {
    const r = u.role ?? "viewer";
    counts[r] = (counts[r] ?? 0) + 1;
  }
  return roleOrder.map((r) => ({
    name: r.charAt(0).toUpperCase() + r.slice(1),
    value: counts[r] ?? 0,
  }));
}

function aggregateProductsByCategory(
  products: Product[]
): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const p of products) {
    const cat = p.category?.trim() || "Uncategorized";
    map.set(cat, (map.get(cat) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export interface DashboardChartsSectionProps {
  /** Users from API — drives donut chart and KPI. */
  users?: User[];
  /** Products from API — drives bar chart, recent activity, revenue. */
  products?: Product[];
}

/**
 * Client-only section: ECharts (line mock, donut from users, bar from products) + recent activity from data.
 */
export function DashboardChartsSection({
  users = [],
  products = [],
}: DashboardChartsSectionProps) {
  const usersByRole = aggregateUsersByRole(users);
  const productsByCategory = aggregateProductsByCategory(products);
  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white p-6 shadow-md lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Revenue Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sample trend (no time-series in DB). Replace with real API when available.
          </p>
          <div className="mt-4">
            <RevenueLineChart />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-slate-900">
            Users by Role
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            From your Users data ({users.length} total).
          </p>
          <div className="mt-4">
            <UserRoleDonutChart data={usersByRole} />
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white p-6 shadow-md lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Products by Category
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            From your Products data ({products.length} total).
          </p>
          <div className="mt-4">
            <ProductsByCategoryBarChart data={productsByCategory} />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Products
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Last updated products.
          </p>
          <div className="mt-6 space-y-3">
            {recentProducts.length === 0 ? (
              <p className="text-sm text-slate-500">No products yet.</p>
            ) : (
              recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3"
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Updated {formatRelativeTime(p.updatedAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
