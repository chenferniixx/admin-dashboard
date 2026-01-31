"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Package, TrendingUp, Layers } from "lucide-react";
import { fetchUsersList } from "@/lib/api/users";
import { fetchProductsList } from "@/lib/api/products";
import { QUERY_KEYS, PAGINATION } from "@/lib/constants";
import { DashboardChartsSection } from "@/components/charts/DashboardChartsSection";

const DASHBOARD_USERS_KEY = QUERY_KEYS.DASHBOARD_USERS;
const DASHBOARD_PRODUCTS_KEY = QUERY_KEYS.DASHBOARD_PRODUCTS;
const DASHBOARD_LIMIT = PAGINATION.DASHBOARD_LIMIT;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function KPICardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md">
      <div className="flex items-start justify-between p-6">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

export function DashboardContent() {
  const usersQuery = useQuery({
    queryKey: DASHBOARD_USERS_KEY,
    queryFn: () =>
      fetchUsersList({ page: 1, limit: DASHBOARD_LIMIT }),
  });

  const productsQuery = useQuery({
    queryKey: DASHBOARD_PRODUCTS_KEY,
    queryFn: () =>
      fetchProductsList({ page: 1, limit: DASHBOARD_LIMIT }),
  });

  const isLoading =
    usersQuery.isLoading || productsQuery.isLoading;
  const isError = usersQuery.isError || productsQuery.isError;
  const error = usersQuery.error ?? productsQuery.error;

  const totalUsers = usersQuery.data?.total ?? 0;
  const totalProducts = productsQuery.data?.total ?? 0;
  const productsList = productsQuery.data?.data ?? [];
  const revenue = productsList.reduce((sum, p) => sum + (p.price ?? 0), 0);
  const categoryCount = new Set(
    productsList.map((p) => (p.category?.trim() || "Uncategorized"))
  ).size;

  const kpis = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      subtitle: "From Users",
      icon: Users,
      color: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Total Products",
      value: totalProducts.toLocaleString(),
      subtitle: "From Products",
      icon: Package,
      color: "bg-emerald-500",
      light: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Revenue",
      value: formatCurrency(revenue),
      subtitle: "Sum of product prices",
      icon: TrendingUp,
      color: "bg-violet-500",
      light: "bg-violet-50",
      text: "text-violet-600",
    },
    {
      title: "Categories",
      value: String(categoryCount),
      subtitle: "Distinct product categories",
      icon: Layers,
      color: "bg-amber-500",
      light: "bg-amber-50",
      text: "text-amber-600",
    },
  ];

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-800">
          Failed to load dashboard data
        </p>
        <p className="mt-1 text-sm text-red-600">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <KPICardSkeleton key={i} />
            ))
          : kpis.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-start justify-between p-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-500">
                        {item.title}
                      </p>
                      <p className="text-2xl font-bold tracking-tight text-slate-900">
                        {item.value}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.subtitle}
                      </p>
                    </div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.light} ${item.text}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <DashboardChartsSection
        users={usersQuery.data?.data ?? []}
        products={productsList}
      />
    </div>
  );
}
