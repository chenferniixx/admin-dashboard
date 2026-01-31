"use client";

import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

export interface DeleteProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteProductModal({
  open,
  onOpenChange,
  product,
  onConfirm,
  isLoading,
}: DeleteProductModalProps) {
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
      title="Delete product"
      description={
        product
          ? `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
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
          disabled={isLoading || !product}
        >
          {isLoading ? "Deleting…" : "Delete"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
