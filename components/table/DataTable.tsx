"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
  className?: string;
}

/**
 * Reusable data table: columns, data, optional search, pagination, loading skeleton.
 */
export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  search,
  pagination,
  emptyMessage = "No results.",
  className,
}: DataTableProps<T>) {
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.limit))
    : 1;
  const hasPagination = pagination && pagination.total > pagination.limit;

  return (
    <div className={cn("space-y-4", className)}>
      {search && (
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder={search.placeholder ?? "Search…"}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            className="max-w-xs rounded-lg border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary/20"
            aria-label="Search table"
          />
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
              {columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={keyExtractor(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.cell
                        ? col.cell(row)
                        : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {hasPagination && pagination && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Page {pagination.page} of {totalPages}
            <span className="ml-1 text-foreground">({pagination.total} total)</span>
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              aria-label="Previous page"
              className="rounded-lg font-medium"
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              aria-label="Next page"
              className="rounded-lg font-medium"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
