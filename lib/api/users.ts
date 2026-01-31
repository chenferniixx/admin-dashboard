import { api, buildQuery } from "@/lib/api";
import type { User, UserCreatePayload, UserUpdatePayload } from "@/types/user";

export interface UsersListResponse {
  data: User[];
  total: number;
}

export interface UsersListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function fetchUsersList(
  params: UsersListParams = {}
): Promise<UsersListResponse> {
  const query = buildQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    search: params.search,
  });
  return api<UsersListResponse>(`/users${query}`);
}

export async function fetchUser(id: string): Promise<User> {
  return api<User>(`/users/${id}`);
}

export async function createUserApi(
  payload: UserCreatePayload
): Promise<User> {
  return api<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateUserApi(
  id: string,
  payload: UserUpdatePayload
): Promise<User> {
  return api<User>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteUserApi(id: string): Promise<void> {
  return api<void>(`/users/${id}`, { method: "DELETE" });
}
