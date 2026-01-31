"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/table/DataTable";
import { UserFormModal } from "./UserFormModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { useUsers } from "@/hooks/useUsers";
import type { User, UserCreatePayload, UserUpdatePayload } from "@/types/user";
import { PAGINATION } from "@/lib/constants";
import { Pencil, Trash2, UserPlus } from "lucide-react";

export function UsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useUsers({ page, limit: PAGINATION.DEFAULT_LIMIT, search });

  const handleCreateSubmit = useCallback(
    async (payload: UserCreatePayload) => {
      await createMutation.mutateAsync(payload);
    },
    [createMutation]
  );

  const handleEditSubmit = useCallback(
    async (payload: UserCreatePayload) => {
      if (!editUser) return;
      const updatePayload: UserUpdatePayload = {
        name: payload.name,
        role: payload.role,
      };
      await updateMutation.mutateAsync({
        id: editUser.id,
        payload: updatePayload,
      });
      setEditUser(null);
    },
    [editUser, updateMutation]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteUser) return;
    await deleteMutation.mutateAsync(deleteUser.id);
    setDeleteUser(null);
  }, [deleteUser, deleteMutation]);

  const columns: DataTableColumn<User>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      cell: (row) =>
        row.role ? (
          <span className="inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {row.role}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setEditUser(row)}
            aria-label={`Edit ${row.name}`}
            className="rounded-lg hover:bg-accent"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDeleteUser(row)}
            aria-label={`Delete ${row.name}`}
            className="rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const users = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Users
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage user accounts and roles.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            aria-label="Create user"
            size="lg"
            className="gap-2 rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-[0.98]"
          >
            <UserPlus className="h-5 w-5" aria-hidden />
            Create user
          </Button>
        </div>
        {isError && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {error?.message ?? "Failed to load users."}
          </div>
        )}
        <DataTable<User>
          columns={columns}
          data={users}
          keyExtractor={(u) => u.id}
          isLoading={isLoading}
          search={{
            value: search,
            onChange: (v) => {
              setSearch(v);
              setPage(1);
            },
            placeholder: "Search by name or email…",
          }}
          pagination={{
            page,
            limit: PAGINATION.DEFAULT_LIMIT,
            total,
            onPageChange: setPage,
          }}
          emptyMessage="No users found."
        />
      </div>
      <UserFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSubmit={handleCreateSubmit}
        isLoading={createMutation.isPending}
      />
      <UserFormModal
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        mode="edit"
        user={editUser}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
      />
      <DeleteUserModal
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        user={deleteUser}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
