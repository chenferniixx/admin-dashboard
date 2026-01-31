import type { User, UserCreatePayload } from "@/types/user";
import type { Role } from "@/types/next-auth";

/**
 * In-memory store for users. Replace with real DB (e.g. Prisma) in production.
 */
const store: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Editor User",
    email: "editor@example.com",
    role: "editor",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Viewer User",
    email: "viewer@example.com",
    role: "viewer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 4;

function generateId(): string {
  return String(nextId++);
}

export function listUsers(opts: {
  page: number;
  limit: number;
  search?: string;
}): { data: User[]; total: number } {
  const { page, limit, search } = opts;
  let filtered = [...store];
  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }
  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  return { data, total };
}

export function getUserById(id: string): User | null {
  return store.find((u) => u.id === id) ?? null;
}

export function createUser(payload: UserCreatePayload): User {
  const now = new Date().toISOString();
  const user: User = {
    id: generateId(),
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    role: payload.role,
    createdAt: now,
    updatedAt: now,
  };
  store.push(user);
  return user;
}

export function updateUser(
  id: string,
  payload: { name?: string; email?: string; role?: Role }
): User | null {
  const idx = store.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  if (payload.name !== undefined) store[idx].name = payload.name.trim();
  if (payload.email !== undefined)
    store[idx].email = payload.email.trim().toLowerCase();
  if (payload.role !== undefined) store[idx].role = payload.role;
  store[idx].updatedAt = now;
  return store[idx];
}

export function deleteUser(id: string): boolean {
  const idx = store.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}
