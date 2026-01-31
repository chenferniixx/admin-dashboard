/**
 * Shared constants: routes, query keys, limits.
 * Single source of truth for config used across app and API client.
 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  DASHBOARD: "/dashboard",
  USERS: "/dashboard/users",
  PRODUCTS: "/dashboard/products",
} as const;

export const QUERY_KEYS = {
  USERS: "users",
  PRODUCTS: "products",
  DASHBOARD_USERS: ["users", { page: 1, limit: 100 }] as const,
  DASHBOARD_PRODUCTS: ["products", { page: 1, limit: 100 }] as const,
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DASHBOARD_LIMIT: 100,
} as const;
