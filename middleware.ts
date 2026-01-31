import { withAuth } from "next-auth/middleware";

/**
 * Protected routes: require auth for /dashboard/*.
 * Redirects unauthenticated users to /auth/login with callbackUrl.
 * Role-based access is enforced in dashboard layout/pages via getServerSession.
 */
export default withAuth({
  pages: { signIn: "/auth/login" },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
