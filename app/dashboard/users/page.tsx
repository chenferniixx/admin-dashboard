import type { Metadata } from "next";
import { UsersTable } from "./UsersTable";

export const metadata: Metadata = {
  title: "Users | Admin Dashboard",
  description: "Manage users: list, create, edit, delete.",
};

/**
 * Users CRUD page: table with pagination, search, create/edit/delete modals.
 * Data and mutations via TanStack Query; API at /api/users.
 */
export default function UsersPage() {
  return (
    <div>
      <UsersTable />
    </div>
  );
}
