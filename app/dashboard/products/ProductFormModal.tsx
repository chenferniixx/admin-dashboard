"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product, ProductCreatePayload } from "@/types/product";
import { validateProductForm } from "@/lib/validations/product";

export interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  product?: Product | null;
  onSubmit: (payload: ProductCreatePayload) => Promise<void>;
  isLoading?: boolean;
}

const emptyForm = {
  name: "",
  description: "",
  price: 0,
  category: "",
};

export function ProductFormModal({
  open,
  onOpenChange,
  mode,
  product,
  onSubmit,
  isLoading,
}: ProductFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (mode === "edit" && product) {
        setForm({
          name: product.name,
          description: product.description ?? "",
          price: product.price,
          category: product.category ?? "",
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [open, mode, product]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateProductForm({
      name: form.name,
      description: form.description,
      price: form.price === 0 ? "" : form.price,
      category: form.category,
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

  const title = mode === "create" ? "Create product" : "Edit product";
  const description =
    mode === "create"
      ? "Add a new product to the catalog."
      : "Update product details.";

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
            <Label htmlFor="product-name">Name</Label>
            <Input
              id="product-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              disabled={isLoading}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "product-name-error" : undefined}
              className={
                errors.name
                  ? "border-red-500 focus-visible:ring-red-500/30"
                  : ""
              }
            />
            {errors.name && (
              <p
                id="product-name-error"
                className="text-sm font-medium text-red-600"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-description">Description</Label>
            <textarea
              id="product-description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              disabled={isLoading}
              rows={3}
              className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-price">Price (฿)</Label>
            <Input
              id="product-price"
              type="number"
              min={0}
              step={0.01}
              value={form.price === 0 ? "" : form.price}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  price: e.target.value === "" ? 0 : Number(e.target.value),
                }))
              }
              disabled={isLoading}
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? "product-price-error" : undefined}
              className={
                errors.price
                  ? "border-red-500 focus-visible:ring-red-500/30"
                  : ""
              }
            />
            {errors.price && (
              <p
                id="product-price-error"
                className="text-sm font-medium text-red-600"
                role="alert"
              >
                {errors.price}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-category">Category</Label>
            <Input
              id="product-category"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              disabled={isLoading}
              placeholder="e.g. Electronics, Office"
            />
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
