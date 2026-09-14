import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { parseMoneyAmount } from "@/lib/utils";
import type { InventoryPulseCardProps } from "../types/overview.types";

export const InventoryPulseCard = React.memo(function InventoryPulseCard({
  lowStockCount,
  outOfStockCount,
  activeProducts,
  totalProducts,
  lowStockProducts,
}: InventoryPulseCardProps) {
  return (
    <div className="border border-border bg-card shadow-hard-md overflow-hidden font-mono select-none flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ece945]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              INVENTORY PULSE
            </h3>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Catalog health & reserve velocity
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 border border-border bg-muted/40 hover:bg-muted px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground transition-colors"
        >
          <span>INVENTORY</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="p-4 space-y-4">
        {/* KPI Dual Box */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
              LOW STOCK
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-amber-600 dark:text-amber-400">
              {lowStockCount}
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">≤ 20 units remaining</p>
          </div>

          <div className="border border-rose-500/30 bg-rose-500/10 p-3">
            <p className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400">
              DEPLETED
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-rose-600 dark:text-rose-400">
              {outOfStockCount}
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">0 units in stock</p>
          </div>
        </div>

        {/* Stock Meter List */}
        <div className="space-y-3 pt-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Active catalog listings:</span>
            <span className="font-bold text-foreground">
              {activeProducts} / {totalProducts}
            </span>
          </div>

          {lowStockProducts.slice(0, 3).map((product) => {
            const stock = parseMoneyAmount(product.stockQuantity);
            return (
              <div key={product.id} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="truncate max-w-[170px] text-foreground font-bold">
                    {product.name}
                  </span>
                  <span className={stock === 0 ? "text-rose-500 font-bold" : "text-amber-500 font-bold"}>
                    {stock} units
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${stock === 0 ? "bg-rose-500" : "bg-amber-500"}`}
                    style={{
                      width: `${Math.min(100, Math.max(5, stock * 5))}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {lowStockProducts.length === 0 && (
            <div className="py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>All products maintain optimal reserve thresholds.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

InventoryPulseCard.displayName = "InventoryPulseCard";
