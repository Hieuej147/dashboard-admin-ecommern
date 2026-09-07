import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
    <Card>
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Inventory Pulse</CardTitle>
          <Link
            to="/products"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            Catalog <ArrowUpRight className="inline h-3 w-3" />
          </Link>
        </div>
        <CardDescription className="mt-1">
          Catalog health and stock status.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-3 pb-4 border-b border-slate-100">
          <div className="rounded-lg bg-amber-50/70 p-3 border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">Low Stock</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">
              {lowStockCount}
            </p>
            <p className="text-[10px] text-amber-600 mt-0.5">≤ 20 items left</p>
          </div>
          <div className="rounded-lg bg-rose-50/70 p-3 border border-rose-100">
            <p className="text-xs text-rose-700 font-medium">Out of Stock</p>
            <p className="mt-1 text-2xl font-bold text-rose-900">
              {outOfStockCount}
            </p>
            <p className="text-[10px] text-rose-600 mt-0.5">0 items left</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Active Products</span>
            <span className="font-semibold text-slate-800">
              {activeProducts} / {totalProducts}
            </span>
          </div>

          {lowStockProducts.slice(0, 3).map((product) => {
            const stock = parseMoneyAmount(product.stockQuantity);
            return (
              <div key={product.id} className="pt-1">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="max-w-[170px] truncate text-slate-700 font-medium">
                    {product.name}
                  </span>
                  <span className="font-semibold text-amber-600">
                    {stock} left
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      stock === 0 ? "bg-rose-500" : "bg-amber-400"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(5, stock * 5))}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {lowStockProducts.length === 0 && (
            <div className="py-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              All inventory is well-stocked.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
