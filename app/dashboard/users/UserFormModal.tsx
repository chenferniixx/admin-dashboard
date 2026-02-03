"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User, UserCreatePayload } from "@/types/user";
import type { Role } from "@/types/next-auth";
import { validateUserForm } from "@/lib/validations/user";

const ROLES: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

export interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: User | null;
  onSubmit: (payload: UserCreatePayload) => Promise<void>;
  isLoading?: boolean;
}

const emptyForm = { name: "", email: "", role: undefined as Role | undefined };

export function UserFormModal({
  open,
  onOpenChange,
  mode,
  user,
  onSubmit,
  isLoading,
}: UserFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (mode === "edit" && user) {
        setForm({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [open, mode, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateUserForm({
      name: form.name,
      email: form.email,
      role: form.role ?? "",
    });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    try {
      await onSubmit(result.data);
      onOpenChange(false);
    } catch {
      // Error shown by caller (toast)
    }
  }

  const title = mode === "create" ? "Create user" : "Edit user";
  const description =
    mode === "create"
      ? "Add a new user to the system."
      : "Update user details.";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-name">Name</Label>
            <Input
              id="user-name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              disabled={isLoading}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "user-name-error" : undefined}
              className={
                errors.name
                  ? "border-red-500 focus-visible:ring-red-500/30"
                  : ""
              }
            />
            {errors.name && (
              <p
                id="user-name-error"
                className="text-sm font-medium text-red-600"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              disabled={isLoading || mode === "edit"}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "user-email-error" : undefined}
              className={
                errors.email
                  ? "border-red-500 focus-visible:ring-red-500/30"
                  : ""
              }
            />
            {mode === "edit" && (
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            )}
            {errors.email && (
              <p
                id="user-email-error"
                className="text-sm font-medium text-red-600"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-role">Role</Label>
            <select
              id="user-role"
              name="role"
              value={form.role ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  role: (e.target.value || undefined) as Role | undefined,
                }))
              }
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">No role</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
