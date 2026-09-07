import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatVnd, parseMoneyAmount } from "@/lib/utils";
import type { LowStockAlertsCardProps } from "../types/overview.types";

export const LowStockAlertsCard = React.memo(function LowStockAlertsCard({
  lowStockProducts,
}: LowStockAlertsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Low Stock Alerts</CardTitle>
            {lowStockProducts.length > 0 && (
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-50 text-amber-700 text-xs"
              >
                {lowStockProducts.length} items
              </Badge>
            )}
          </div>
          <Link
            to="/products"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            Restock
          </Link>
        </div>
        <CardDescription className="mt-1">
          Products with stock quantity at or below 20.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {lowStockProducts.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            <span>All products have sufficient stock.</span>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/60 text-xs">
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts.slice(0, 6).map((product) => {
                const imageSrc =
                  product.images?.main ||
                  Object.values(product.images || {})[0] ||
                  "/products/1g.png";

                const stock = parseMoneyAmount(product.stockQuantity);
                return (
                  <TableRow key={product.id} className="hover:bg-slate-50">
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="h-8 w-8 rounded-md border border-slate-200 bg-white object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/60x60?text=P";
                          }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-slate-800 max-w-[130px]">
                            {product.name}
                          </p>
                          <p className="font-mono text-[10px] text-slate-400">
                            {product.sku || product.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span
                        className={`inline-flex items-center text-xs font-semibold ${
                          stock === 0 ? "text-rose-600" : "text-amber-600"
                        }`}
                      >
                        {stock === 0 ? "Out of stock" : `${stock} left`}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-2.5 font-medium text-slate-800 text-xs">
                      {formatVnd(product.price)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
});
