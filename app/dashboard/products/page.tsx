import type { Metadata } from "next";
import { ProductsTable } from "./ProductsTable";

export const metadata: Metadata = {
  title: "Products | Admin Dashboard",
  description: "Manage products: list, create, edit, delete.",
};

/**
 * Products CRUD page: table with pagination, search, create/edit/delete modals.
 * Data and mutations via TanStack Query; API at /api/products.
 */
export default function ProductsPage() {
  return (
    <div>
      <ProductsTable />
    </div>
  );
}
