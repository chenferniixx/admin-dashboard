import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Role } from "@/types/next-auth";

/**
 * Credential validation: replace with real DB/API lookup in production.
 * Demo users from env (NEXTAUTH_DEMO_*) or in-memory map for development.
 */
const DEMO_USERS: Array<{
  email: string;
  password: string;
  name: string;
  role: Role;
}> = [
  {
    email: process.env.NEXTAUTH_DEMO_EMAIL ?? "admin@example.com",
    password: process.env.NEXTAUTH_DEMO_PASSWORD ?? "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    email: "editor@example.com",
    password: "editor123",
    name: "Editor User",
    role: "editor",
  },
  {
    email: "viewer@example.com",
    password: "viewer123",
    name: "Viewer User",
    role: "viewer",
  },
];

async function validateCredentials(
  email: string,
  password: string
): Promise<{ id: string; email: string; name: string; role: Role } | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );
  if (!user) return null;
  return {
    id: user.email,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

/**
 * NextAuth config: credential-based auth with role (admin | editor | viewer).
 * Session uses JWT; role is persisted in token and exposed on session.user.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        return validateCredentials(
          credentials.email,
          credentials.password
        );
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: Role }).role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: Role }).role = token.role as Role;
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  pages: { signIn: "/auth/login" },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Get session in Server Components / API routes.
 * Use for role-based access: (await getServerSession(authOptions))?.user?.role
 */
export async function getSession() {
  return getServerSession(authOptions);
}
