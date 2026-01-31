"use client";

import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

export interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteUserModal({
  open,
  onOpenChange,
  user,
  onConfirm,
  isLoading,
}: DeleteUserModalProps) {
  async function handleConfirm() {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Error shown by caller (toast)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete user"
      description={
        user
          ? `Are you sure you want to delete "${user.name}"? This action cannot be undone.`
          : undefined
      }
    >
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleConfirm}
          disabled={isLoading || !user}
        >
          {isLoading ? "Deleting…" : "Delete"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
