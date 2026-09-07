import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Eye } from "lucide-react";
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
import { formatVnd } from "@/lib/utils";
import type { AttentionOrdersCardProps } from "../types/overview.types";

export const AttentionOrdersCard = React.memo(function AttentionOrdersCard({
  exceptions,
  onOpenDetail,
}: AttentionOrdersCardProps) {
  return (
    <Card>
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">
              Orders Requiring Attention
            </CardTitle>
            {exceptions.length > 0 && (
              <Badge
                variant="outline"
                className="border-rose-200 bg-rose-50 text-rose-700 text-xs"
              >
                {exceptions.length} action needed
              </Badge>
            )}
          </div>
          <Link
            to="/orders"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            View all orders
          </Link>
        </div>
        <CardDescription className="mt-1">
          Orders that are pending payment, failed, or cancelled.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {exceptions.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            <span>No orders pending or failed. Great job!</span>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/60 text-xs">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {exceptions.slice(0, 6).map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs font-medium text-slate-700">
                    #{order.id}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-slate-800 truncate max-w-[150px]">
                      {order.customerName || "Anonymous"}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      {order.customerEmail}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.status === "PENDING_PAYMENT"
                          ? "border-amber-200 bg-amber-50 text-amber-700 text-[11px]"
                          : "border-rose-200 bg-rose-50 text-rose-700 text-[11px]"
                      }
                    >
                      {order.status.replaceAll("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-800 text-xs">
                    {formatVnd(order.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      type="button"
                      aria-label={`View order ${order.id}`}
                      onClick={() => onOpenDetail(order)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
});
