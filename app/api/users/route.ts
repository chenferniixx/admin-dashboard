import { NextRequest, NextResponse } from "next/server";
import { listUsers, createUser } from "@/lib/db/users";
import type { UserCreatePayload } from "@/types/user";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Hoisted RegExp for email validation
 * @see js-hoist-regexp - Hoist RegExp creation to avoid recreation on each request
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * GET /api/users?page=1&limit=10&search=
 * List users with pagination and optional search.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "", 10) || DEFAULT_PAGE);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get("limit") ?? "", 10) || DEFAULT_LIMIT)
    );
    const search = searchParams.get("search") ?? undefined;
    const { data, total } = listUsers({ page, limit, search });
    return NextResponse.json({ data, total });
  } catch {
    return NextResponse.json(
      { error: "Failed to list users" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users - Create user.
 * Body: { name, email, role? }
 */
type PostBody = { name?: unknown; email?: unknown; role?: unknown };

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PostBody;
    const name = typeof body.name === "string" ? body.name : "";
    const email = typeof body.email === "string" ? body.email : "";
    const role =
      body.role === "admin" || body.role === "editor" || body.role === "viewer"
        ? body.role
        : undefined;
    if (!name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (!email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    const { data: existingUsers } = listUsers({
      page: 1,
      limit: 1000,
      search: email.trim().toLowerCase(),
    });
    if (existingUsers.some((u) => u.email === email.trim().toLowerCase())) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }
    const payload: UserCreatePayload = { name: name.trim(), email: email.trim().toLowerCase(), role };
    const user = createUser(payload);
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
