import { redirect } from "next/navigation";

/**
 * Root page: redirect to dashboard or auth based on session.
 * Middleware handles protected routes; this is the landing.
 */
export default function HomePage() {
  redirect("/dashboard");
}
