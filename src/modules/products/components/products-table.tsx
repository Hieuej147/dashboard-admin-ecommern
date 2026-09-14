import React, { type ReactNode } from "react";
import { Pencil, Trash2, Image as ImageIcon } from "lucide-react";
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
        className="py-12 text-center text-xs font-mono text-muted-foreground"
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

function ProductStatusBadge({ status, stock }: { status: string; stock: number }) {
  if (status === "ARCHIVED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-border bg-muted/60 text-muted-foreground">
        <span className="h-1.5 w-1.5 bg-muted-foreground inline-block" />
        [ ARCHIVED ]
      </span>
    );
  }

  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <span className="h-1.5 w-1.5 bg-emerald-500 inline-block" />
        [ IN STOCK ]
      </span>
    );
  }

  if (status === "LOW_STOCK") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <span className="h-1.5 w-1.5 bg-amber-500 inline-block animate-pulse" />
        [ LOW STOCK: {stock} ]
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400">
      <span className="h-1.5 w-1.5 bg-rose-500 inline-block" />
      [ OUT OF STOCK ]
    </span>
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
    <div className="border border-border bg-card shadow-hard-md overflow-hidden font-mono select-none">
      {/* Table Sub-header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#ece945]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
            ACTIVE PRODUCT CATALOG
          </h2>
          <span className="text-[10px] text-muted-foreground">
            ({products.length} ITEMS LOADED)
          </span>
        </div>
        {isFetching && !isPending && (
          <span className="text-[10px] text-[#ece945] animate-pulse">
            Syncing...
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[120px] text-foreground font-bold">SKU / IDENTIFIER</TableHead>
              <TableHead className="text-foreground font-bold">PRODUCT & DETAILS</TableHead>
              <TableHead className="w-[180px] text-foreground font-bold">STOCK LEVEL</TableHead>
              <TableHead className="w-[150px] text-foreground font-bold">STATUS</TableHead>
              <TableHead className="text-right text-foreground font-bold">UNIT PRICE (VND)</TableHead>
              <TableHead className="w-[100px] text-right text-foreground font-bold">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-xs">
            {isPending && <TableMessage>Loading product catalog data...</TableMessage>}

            {isError && (
              <TableMessage>
                <span className="text-rose-500">
                  Data fetch error:{" "}
                  {error instanceof Error
                    ? error.message
                    : "Please verify the Catalog API service."}
                </span>
                <button
                  type="button"
                  onClick={onRefetch}
                  className="ml-2 underline underline-offset-2 text-foreground font-bold cursor-pointer"
                >
                  Retry
                </button>
              </TableMessage>
            )}

            {!isPending && !isError && products.length === 0 && (
              <TableMessage>No products match the selected criteria.</TableMessage>
            )}

            {!isPending &&
              !isError &&
              products.map((product) => {
                const imageSrc =
                  product.images?.main ||
                  Object.values(product.images || {})[0] ||
                  "";

                const isS3Image = imageSrc.includes("9002") || imageSrc.includes("s3") || imageSrc.includes("ecommerce-products");

                const threshold = product.reorderPoint !== undefined ? product.reorderPoint : 20;
                const derivedStatus =
                  product.status === "ARCHIVED"
                    ? "ARCHIVED"
                    : product.stockQuantity === 0
                    ? "OUT_OF_STOCK"
                    : product.stockQuantity <= threshold
                    ? "LOW_STOCK"
                    : "ACTIVE";

                // Stock progress percentage (assume max 100 for visual bar)
                const stockPercent = Math.min(100, Math.max(0, (product.stockQuantity / 100) * 100));

                return (
                  <TableRow
                    key={product.id}
                    className="border-b border-border/70 hover:bg-muted/30 transition-colors"
                  >
                    {/* SKU / Slug */}
                    <TableCell className="font-bold text-foreground select-all">
                      <span className="bg-muted px-1.5 py-0.5 border border-border">
                        {product.sku || product.slug}
                      </span>
                    </TableCell>

                    {/* Product Image & Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 border border-border bg-muted/20 overflow-hidden flex items-center justify-center">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                              }}
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                          {isS3Image && (
                            <span className="absolute top-0 right-0 bg-[#ece945] text-black text-[7px] font-bold px-0.5">
                              S3
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-foreground truncate max-w-[220px]">
                              {product.name}
                            </p>
                            {product.categorySlug && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 bg-muted border border-border text-muted-foreground shrink-0">
                                {product.categorySlug}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate max-w-[280px]">
                            {product.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Stock Meter */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-foreground">
                            {product.stockQuantity} units
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {product.stockQuantity > 10 ? "Optimal" : product.stockQuantity > 0 ? "Warning" : "Depleted"}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              product.stockQuantity === 0
                                ? "bg-rose-500"
                                : product.stockQuantity <= 10
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${product.stockQuantity === 0 ? 100 : Math.max(8, stockPercent)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <ProductStatusBadge status={derivedStatus} stock={product.stockQuantity} />
                    </TableCell>

                    {/* Price */}
                    <TableCell className="text-right font-bold text-foreground select-all">
                      {formatVnd(product.price)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          aria-label={`Edit product ${product.name}`}
                          onClick={() => onEdit(product)}
                          className="border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete product ${product.name}`}
                          onClick={() => onDelete(product)}
                          className="border border-border p-1.5 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

ProductsTable.displayName = "ProductsTable";
