import { DashboardLayout as DashboardLayoutClient } from "@/components/layout";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Dashboard layout: sidebar + topbar. Wraps all /dashboard/* routes.
 * Server layout: ensures session exists (middleware already protects; extra safety).
 * Sidebar + Topbar rendered by client DashboardLayout.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  );
}
