import { NextRequest, NextResponse } from "next/server";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "@/lib/db/users";
import type { Role } from "@/types/next-auth";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/users/[id] - Get single user.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const user = getUserById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

/**
 * PATCH /api/users/[id] - Update user.
 * Body: { name?, email?, role? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const user = getUserById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  try {
    type PatchBody = { name?: unknown; email?: unknown; role?: unknown };
    const body = (await request.json()) as PatchBody;
    const name = typeof body.name === "string" ? body.name : undefined;
    const email = typeof body.email === "string" ? body.email : undefined;
    const role: Role | undefined =
      body.role === "admin" || body.role === "editor" || body.role === "viewer"
        ? body.role
        : undefined;
    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    const updated = updateUser(id, {
      ...(name !== undefined && { name: name.trim() }),
      ...(email !== undefined && { email: email.trim().toLowerCase() }),
      ...(role !== undefined && { role }),
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id] - Delete user.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const deleted = deleteUser(id);
  if (!deleted) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
