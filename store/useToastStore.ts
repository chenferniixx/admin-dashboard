import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: ToastItem[];
  add: (message: string, variant?: ToastVariant) => void;
  remove: (id: string) => void;
}

let idCounter = 0;
function nextId(): string {
  return `toast-${++idCounter}`;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (message, variant = "default") => {
    const id = nextId();
    set((s) => ({
      toasts: [...s.toasts, { id, message, variant }],
    }));
    setTimeout(() => {
      set((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  remove: (id) =>
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    })),
}));
