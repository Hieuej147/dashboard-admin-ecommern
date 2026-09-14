import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Eye, ArrowUpRight } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatVnd } from "@/lib/utils";
import type { AttentionOrdersCardProps } from "../types/overview.types";

export const AttentionOrdersCard = React.memo(function AttentionOrdersCard({
  exceptions,
  onOpenDetail,
}: AttentionOrdersCardProps) {
  return (
    <div className="border border-border bg-card shadow-hard-md overflow-hidden font-mono select-none flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#ece945]" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              ATTENTION REQUIRED ORDERS
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Pending payment, processing exceptions, or refunds
            </p>
          </div>
          {exceptions.length > 0 && (
            <span className="ml-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 border border-black/20">
              {exceptions.length} ALERTS
            </span>
          )}
        </div>

        <Link
          to="/orders"
          className="inline-flex items-center gap-1 border border-border bg-muted/40 hover:bg-muted px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground transition-colors"
        >
          <span>ALL ORDERS</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="p-0 overflow-x-auto">
        {exceptions.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>No pending order exceptions or fulfillment bottlenecks.</span>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[120px] text-foreground font-bold">ORDER ID</TableHead>
                <TableHead className="text-foreground font-bold">CUSTOMER</TableHead>
                <TableHead className="w-[150px] text-foreground font-bold">STATUS</TableHead>
                <TableHead className="text-right text-foreground font-bold">TOTAL</TableHead>
                <TableHead className="w-[60px] text-right text-foreground font-bold">VIEW</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {exceptions.slice(0, 6).map((order) => (
                <TableRow key={order.id} className="border-b border-border/70 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-bold text-foreground select-all">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-foreground truncate max-w-[160px]">
                      {order.customerName || "Guest"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                      {order.customerEmail}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase border ${
                        order.status === "PENDING_PAYMENT"
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {order.status === "PENDING_PAYMENT" ? "PENDING PAYMENT" : order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground select-all">
                    {formatVnd(order.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      type="button"
                      aria-label={`View details for order ${order.id}`}
                      onClick={() => onOpenDetail(order)}
                      className="border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      title="View order details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
});

AttentionOrdersCard.displayName = "AttentionOrdersCard";
