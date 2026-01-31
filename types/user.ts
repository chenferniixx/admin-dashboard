import type { Role } from "@/types/next-auth";

/**
 * User entity for CRUD.
 * Align with API response and form payloads.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreatePayload {
  name: string;
  email: string;
  role?: Role;
}

export type UserUpdatePayload = Partial<UserCreatePayload>;
