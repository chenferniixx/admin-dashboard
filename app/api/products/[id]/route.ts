import { NextRequest, NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/db/products";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/products/[id] - Get single product.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

type PatchBody = {
  name?: unknown;
  description?: unknown;
  price?: unknown;
  category?: unknown;
};

/**
 * PATCH /api/products/[id] - Update product.
 * Body: { name?, description?, price?, category? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  try {
    const body = (await request.json()) as PatchBody;
    const name = typeof body.name === "string" ? body.name : undefined;
    const description =
      typeof body.description === "string" ? body.description : undefined;
    const price =
      typeof body.price === "number"
        ? body.price
        : typeof body.price === "string"
          ? parseFloat(body.price)
          : undefined;
    const category =
      typeof body.category === "string" ? body.category : undefined;

    if (price !== undefined && (Number.isNaN(price) || price < 0)) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      );
    }

    const updated = updateProduct(id, {
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(price !== undefined && { price }),
      ...(category !== undefined && { category: category.trim() }),
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id] - Delete product.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const deleted = deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
