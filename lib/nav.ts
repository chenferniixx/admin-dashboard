/**
 * Dashboard navigation config.
 * Single source of truth for sidebar links; extend for role-based visibility if needed.
 */
export interface NavItem {
  label: string;
  href: string;
  icon: "layout-dashboard" | "users" | "package";
}

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
  { label: "Users", href: "/dashboard/users", icon: "users" },
  { label: "Products", href: "/dashboard/products", icon: "package" },
];
