/**
 * Product entity for CRUD.
 * Align with API response and form payloads.
 */
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreatePayload {
  name: string;
  description?: string;
  price: number;
  category?: string;
}

export type ProductUpdatePayload = Partial<ProductCreatePayload>;
