import "next-auth";

export type Role = "admin" | "editor" | "viewer";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: Role;
  }

  interface Session {
    user: User & { id?: string; role?: Role };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}
