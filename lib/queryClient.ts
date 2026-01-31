import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query client: default staleTime, retry, etc.
 * Use in app layout provider and for prefetching in Server Components.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
