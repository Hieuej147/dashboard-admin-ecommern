import React, { type ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatVnd } from "@/lib/utils";
import type { ProductDto } from "@/hooks/query-key/query-key";

interface ProductsTableProps {
  products: ProductDto[];
  isPending: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  onRefetch: () => void;
  onEdit: (product: ProductDto) => void;
  onDelete: (product: ProductDto) => void;
}

function TableMessage({ children }: { children: ReactNode }) {
  return (
    <TableRow>
      <TableCell
        colSpan={6}
        className="py-10 text-center text-sm text-slate-500"
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

function ProductStatusBadge({ status }: { status: string }) {
  const styles =
    status === "ACTIVE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "LOW_STOCK"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-rose-200 bg-rose-50 text-rose-700";
  return (
    <Badge variant="outline" className={styles}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
}

export const ProductsTable = React.memo(function ProductsTable({
  products,
  isPending,
  isFetching,
  isError,
  error,
  onRefetch,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">All products</h2>
          <p className="mt-1 text-xs text-slate-500">
            {products.length} products on this page
          </p>
        </div>
        {isFetching && !isPending && (
          <span className="text-xs text-slate-400">Updating...</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/70">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU / Slug</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && <TableMessage>Loading products...</TableMessage>}
            {isError && (
              <TableMessage>
                <span>
                  Could not load products:{" "}
                  {error instanceof Error
                    ? error.message
                    : "Please check that the API is running."}
                </span>
                <button
                  type="button"
                  onClick={onRefetch}
                  className="ml-2 underline underline-offset-2"
                >
                  Try again
                </button>
              </TableMessage>
            )}
            {!isPending && !isError && products.length === 0 && (
              <TableMessage>No products match the current filters.</TableMessage>
            )}
            {!isPending &&
              !isError &&
              products.map((product) => {
                const imageSrc =
                  product.images?.main ||
                  Object.values(product.images || {})[0] ||
                  "/products/1g.png";

                const derivedStatus =
                  product.stockQuantity === 0
                    ? "OUT_OF_STOCK"
                    : product.stockQuantity <= 10
                      ? "LOW_STOCK"
                      : "ACTIVE";

                return (
                  <TableRow key={product.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-50 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/80x80?text=Product";
                          }}
                        />
                        <div>
                          <p className="max-w-[220px] truncate font-medium text-slate-800">
                            {product.name}
                          </p>
                          <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-400">
                            {product.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {product.sku || product.slug}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stockQuantity <= 10
                            ? "font-medium text-amber-600"
                            : "text-slate-600"
                        }
                      >
                        {product.stockQuantity} units
                      </span>
                    </TableCell>
                    <TableCell>
                      <ProductStatusBadge status={derivedStatus} />
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-800">
                      {formatVnd(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Edit product ${product.name}`}
                          onClick={() => onEdit(product)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete product ${product.name}`}
                          onClick={() => onDelete(product)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});
