"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/table/DataTable";
import { ProductFormModal } from "./ProductFormModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { useProducts } from "@/hooks/useProducts";
import type {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
} from "@/types/product";
import { PAGINATION } from "@/lib/constants";
import { Pencil, Trash2, PackagePlus } from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function ProductsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useProducts({ page, limit: PAGINATION.DEFAULT_LIMIT, search });

  const handleCreateSubmit = useCallback(
    async (payload: ProductCreatePayload) => {
      await createMutation.mutateAsync(payload);
    },
    [createMutation]
  );

  const handleEditSubmit = useCallback(
    async (payload: ProductCreatePayload) => {
      if (!editProduct) return;
      const updatePayload: ProductUpdatePayload = {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        category: payload.category,
      };
      await updateMutation.mutateAsync({
        id: editProduct.id,
        payload: updatePayload,
      });
      setEditProduct(null);
    },
    [editProduct, updateMutation]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteProduct) return;
    await deleteMutation.mutateAsync(deleteProduct.id);
    setDeleteProduct(null);
  }, [deleteProduct, deleteMutation]);

  const columns: DataTableColumn<Product>[] = [
    { key: "name", header: "Name" },
    {
      key: "description",
      header: "Description",
      cell: (row) => (
        <span className="max-w-[200px] truncate text-slate-600">
          {row.description || "—"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (row) => (
        <span className="font-medium tabular-nums text-slate-900">
          {formatPrice(row.price)}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (row) =>
        row.category ? (
          <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {row.category}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
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
            onClick={() => setEditProduct(row)}
            aria-label={`Edit ${row.name}`}
            className="rounded-lg hover:bg-accent"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDeleteProduct(row)}
            aria-label={`Delete ${row.name}`}
            className="rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const products = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Products
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage product catalog: name, price, category.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            aria-label="Create product"
            size="lg"
            className="gap-2 rounded-xl bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40 active:scale-[0.98]"
          >
            <PackagePlus className="h-5 w-5" aria-hidden />
            Create product
          </Button>
        </div>
        {isError && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {error?.message ?? "Failed to load products."}
          </div>
        )}
        <DataTable<Product>
          columns={columns}
          data={products}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          search={{
            value: search,
            onChange: (v) => {
              setSearch(v);
              setPage(1);
            },
            placeholder: "Search by name, description, or category…",
          }}
          pagination={{
            page,
            limit: PAGINATION.DEFAULT_LIMIT,
            total,
            onPageChange: setPage,
          }}
          emptyMessage="No products found."
        />
      </div>
      <ProductFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSubmit={handleCreateSubmit}
        isLoading={createMutation.isPending}
      />
      <ProductFormModal
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
        mode="edit"
        product={editProduct}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
      />
      <DeleteProductModal
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
        product={deleteProduct}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
