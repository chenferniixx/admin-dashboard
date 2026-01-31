"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * Client wrapper for TanStack Query.
 * Creates a QueryClient per component tree to avoid sharing between requests.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      })
  );
  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
