import { api, buildQuery } from "@/lib/api";
import type {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
} from "@/types/product";

export interface ProductsListResponse {
  data: Product[];
  total: number;
}

export interface ProductsListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function fetchProductsList(
  params: ProductsListParams = {}
): Promise<ProductsListResponse> {
  const query = buildQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    search: params.search,
  });
  return api<ProductsListResponse>(`/products${query}`);
}

export async function fetchProduct(id: string): Promise<Product> {
  return api<Product>(`/products/${id}`);
}

export async function createProductApi(
  payload: ProductCreatePayload
): Promise<Product> {
  return api<Product>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProductApi(
  id: string,
  payload: ProductUpdatePayload
): Promise<Product> {
  return api<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteProductApi(id: string): Promise<void> {
  return api<void>(`/products/${id}`, { method: "DELETE" });
}
