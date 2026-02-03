"use client";

import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

const variantStyles = {
  default:
    "bg-card border border-border/60 shadow-lg ring-1 ring-black/5",
  success:
    "bg-primary/5 border border-primary/20 text-foreground shadow-lg ring-1 ring-primary/10",
  error:
    "bg-red-50 border border-red-200 text-red-700 shadow-lg ring-1 ring-red-200",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-3"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={cn(
            "flex items-center justify-between rounded-xl px-4 py-3 backdrop-blur-sm",
            variantStyles[t.variant]
          )}
        >
          <span className="text-sm font-medium">{t.message}</span>
          <button
            type="button"
            onClick={() => remove(t.id)}
            className="ml-2 shrink-0 rounded-lg p-1.5 transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Dismiss"
          >
            <span aria-hidden className="text-lg leading-none">×</span>
          </button>
        </div>
      ))}
    </div>
  );
}
