import type { Product, ProductCreatePayload } from "@/types/product";

/**
 * In-memory store for products. Replace with real DB (e.g. Prisma) in production.
 */
const store: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones",
    price: 2990,
    category: "Electronics",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    description: "RGB backlit, Cherry MX switches",
    price: 4590,
    category: "Electronics",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Desk Lamp",
    description: "LED adjustable brightness",
    price: 890,
    category: "Office",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 4;

function generateId(): string {
  return String(nextId++);
}

export function listProducts(opts: {
  page: number;
  limit: number;
  search?: string;
}): { data: Product[]; total: number } {
  const { page, limit, search } = opts;
  let filtered = [...store];
  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        (p.category?.toLowerCase().includes(q) ?? false)
    );
  }
  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  return { data, total };
}

export function getProductById(id: string): Product | null {
  return store.find((p) => p.id === id) ?? null;
}

export function createProduct(payload: ProductCreatePayload): Product {
  const now = new Date().toISOString();
  const product: Product = {
    id: generateId(),
    name: payload.name.trim(),
    description: payload.description?.trim(),
    price: Number(payload.price) || 0,
    category: payload.category?.trim(),
    createdAt: now,
    updatedAt: now,
  };
  store.push(product);
  return product;
}

export function updateProduct(
  id: string,
  payload: Partial<ProductCreatePayload>
): Product | null {
  const idx = store.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  if (payload.name !== undefined) store[idx].name = payload.name.trim();
  if (payload.description !== undefined)
    store[idx].description = payload.description?.trim() ?? undefined;
  if (payload.price !== undefined) store[idx].price = Number(payload.price) || 0;
  if (payload.category !== undefined)
    store[idx].category = payload.category?.trim() ?? undefined;
  store[idx].updatedAt = now;
  return store[idx];
}

export function deleteProduct(id: string): boolean {
  const idx = store.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}
