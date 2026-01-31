import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/LoginForm";
import { getSession } from "@/lib/auth";
import { LayoutDashboard } from "lucide-react";

/**
 * Login page — split layout: left branding, right form.
 */
export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div className="flex min-h-screen">
      {/* Left: branding / gradient */}
      <div className="hidden w-full flex-col justify-between bg-linear-to-br from-slate-900 via-slate-800 to-primary/20 p-10 lg:flex lg:max-w-[480px]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight text-white">
            Admin Dashboard
          </h2>
          <p className="mt-4 max-w-sm text-slate-300">
            Sign in to manage users, products, and view analytics. Production-ready
            template built with Next.js and Tailwind.
          </p>
        </div>
        <p className="text-sm text-white">
          © Admin Dashboard · Demo credentials below
        </p>
      </div>
      {/* Right: form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-slate-500">
            Demo: admin@example.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
