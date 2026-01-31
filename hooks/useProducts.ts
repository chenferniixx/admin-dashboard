"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProductsList,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "@/lib/api/products";
import type {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
} from "@/types/product";
import { useToastStore } from "@/store/useToastStore";
import { QUERY_KEYS, PAGINATION } from "@/lib/constants";

export interface UseProductsParams {
  page: number;
  limit?: number;
  search?: string;
}

export function useProducts({ page, limit, search }: UseProductsParams) {
  const queryClient = useQueryClient();
  const toast = useToastStore((s) => s.add);
  const limitVal = limit ?? PAGINATION.DEFAULT_LIMIT;

  const query = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, page, search ?? ""],
    queryFn: () =>
      fetchProductsList({
        page,
        limit: limitVal,
        search: search || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast("Product created.", "success");
    },
    onError: (e: Error) => toast(e.message, "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ProductUpdatePayload;
    }) => updateProductApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast("Product updated.", "success");
    },
    onError: (e: Error) => toast(e.message, "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.PRODUCTS, page, search ?? ""],
      });
      const prev = queryClient.getQueryData<{
        data: Product[];
        total: number;
      }>([QUERY_KEYS.PRODUCTS, page, search ?? ""]);
      if (prev) {
        queryClient.setQueryData(
          [QUERY_KEYS.PRODUCTS, page, search ?? ""],
          {
            data: prev.data.filter((p) => p.id !== id),
            total: prev.total - 1,
          }
        );
      }
      return { prev };
    },
    onError: (e: Error, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEYS.PRODUCTS, page, search ?? ""],
          context.prev
        );
      }
      toast(e.message, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
    onSuccess: () => toast("Product deleted.", "success"),
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
