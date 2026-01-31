"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsersList,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "@/lib/api/users";
import type { User, UserCreatePayload, UserUpdatePayload } from "@/types/user";
import { useToastStore } from "@/store/useToastStore";
import { QUERY_KEYS, PAGINATION } from "@/lib/constants";

export interface UseUsersParams {
  page: number;
  limit?: number;
  search?: string;
}

export function useUsers({ page, limit, search }: UseUsersParams) {
  const queryClient = useQueryClient();
  const toast = useToastStore((s) => s.add);
  const limitVal = limit ?? PAGINATION.DEFAULT_LIMIT;

  const query = useQuery({
    queryKey: [QUERY_KEYS.USERS, page, search ?? ""],
    queryFn: () =>
      fetchUsersList({
        page,
        limit: limitVal,
        search: search || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      toast("User created.", "success");
    },
    onError: (e: Error) => toast(e.message, "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserUpdatePayload }) =>
      updateUserApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      toast("User updated.", "success");
    },
    onError: (e: Error) => toast(e.message, "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserApi,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.USERS, page, search ?? ""],
      });
      const prev = queryClient.getQueryData<{ data: User[]; total: number }>([
        QUERY_KEYS.USERS,
        page,
        search ?? "",
      ]);
      if (prev) {
        queryClient.setQueryData(
          [QUERY_KEYS.USERS, page, search ?? ""],
          {
            data: prev.data.filter((u) => u.id !== id),
            total: prev.total - 1,
          }
        );
      }
      return { prev };
    },
    onError: (e: Error, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEYS.USERS, page, search ?? ""],
          context.prev
        );
      }
      toast(e.message, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
    onSuccess: () => toast("User deleted.", "success"),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
