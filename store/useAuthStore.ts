import { create } from "zustand";

export type Role = "admin" | "editor" | "viewer";

interface AuthState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

/**
 * Global UI state for dashboard (e.g. sidebar).
 * Auth session lives in NextAuth; use getServerSession or useSession for user/role.
 */
export const useAuthStore = create<AuthState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
