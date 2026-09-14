import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatVnd, parseMoneyAmount } from "@/lib/utils";
import type { LowStockAlertsCardProps } from "../types/overview.types";

export const LowStockAlertsCard = React.memo(function LowStockAlertsCard({
  lowStockProducts,
}: LowStockAlertsCardProps) {
  return (
    <div className="border border-border bg-card shadow-hard-md overflow-hidden font-mono select-none flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#ece945]" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              LOW STOCK ALERTS
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Products with reserves under 20 units
            </p>
          </div>
          {lowStockProducts.length > 0 && (
            <span className="ml-2 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 border border-black/20">
              {lowStockProducts.length} ITEMS
            </span>
          )}
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1 border border-border bg-muted/40 hover:bg-muted px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground transition-colors"
        >
          <span>RESTOCK</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="p-0 overflow-x-auto">
        {lowStockProducts.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>All products maintain ample inventory levels.</span>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-foreground font-bold">PRODUCT</TableHead>
                <TableHead className="w-[120px] text-foreground font-bold">STOCK LEVEL</TableHead>
                <TableHead className="w-[110px] text-right text-foreground font-bold">UNIT PRICE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {lowStockProducts.slice(0, 6).map((product) => {
                const imageSrc =
                  product.images?.main ||
                  Object.values(product.images || {})[0] ||
                  "";

                const stock = parseMoneyAmount(product.stockQuantity);
                return (
                  <TableRow key={product.id} className="border-b border-border/70 hover:bg-muted/30 transition-colors">
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 shrink-0 border border-border bg-muted/20 overflow-hidden flex items-center justify-center">
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
                            <span className="text-[9px] text-muted-foreground">STOCK</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-foreground max-w-[150px]">
                            {product.name}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground select-all">
                            {product.sku || product.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold border ${
                          stock === 0
                            ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {stock === 0 ? "OUT OF STOCK" : `${stock} UNITS LEFT`}
                      </span>
                    </TableCell>

                    <TableCell className="text-right py-2.5 font-bold text-foreground select-all">
                      {formatVnd(product.price)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
});

LowStockAlertsCard.displayName = "LowStockAlertsCard";
