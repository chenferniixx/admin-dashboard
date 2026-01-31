import { NextRequest, NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/db/products";
import type { ProductCreatePayload } from "@/types/product";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * GET /api/products?page=1&limit=10&search=
 * List products with pagination and optional search.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(
      1,
      parseInt(searchParams.get("page") ?? "", 10) || DEFAULT_PAGE
    );
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get("limit") ?? "", 10) || DEFAULT_LIMIT)
    );
    const search = searchParams.get("search") ?? undefined;
    const { data, total } = listProducts({ page, limit, search });
    return NextResponse.json({ data, total });
  } catch {
    return NextResponse.json(
      { error: "Failed to list products" },
      { status: 500 }
    );
  }
}

type PostBody = {
  name?: unknown;
  description?: unknown;
  price?: unknown;
  category?: unknown;
};

/**
 * POST /api/products - Create product.
 * Body: { name, description?, price, category? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PostBody;
    const name = typeof body.name === "string" ? body.name : "";
    const description =
      typeof body.description === "string" ? body.description : undefined;
    const price =
      typeof body.price === "number"
        ? body.price
        : typeof body.price === "string"
          ? parseFloat(body.price)
          : NaN;
    const category =
      typeof body.category === "string" ? body.category : undefined;

    if (!name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      );
    }

    const payload: ProductCreatePayload = {
      name: name.trim(),
      description: description?.trim(),
      price,
      category: category?.trim(),
    };
    const product = createProduct(payload);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
