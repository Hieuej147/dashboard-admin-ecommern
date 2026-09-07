import React, { type ReactNode } from "react";
import { Eye } from "lucide-react";
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
import type { OrderDto } from "@/hooks/query-key/query-key";

interface OrdersTableProps {
  orders: OrderDto[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  onRefetch: () => void;
  onViewDetail: (order: OrderDto) => void;
}

function TableMessage({ children }: { children: ReactNode }) {
  return (
    <TableRow>
      <TableCell
        colSpan={7}
        className="py-10 text-center text-sm text-slate-500"
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

function OrderStatusBadge({ value }: { value: string }) {
  const normalized = value.toUpperCase();
  const style = normalized.includes("PAID")
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : normalized.includes("FAILED") || normalized.includes("CANCEL")
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-amber-200 bg-amber-50 text-amber-700";
  return (
    <Badge variant="outline" className={style}>
      {value.replaceAll("_", " ")}
    </Badge>
  );
}

export const OrdersTable = React.memo(function OrdersTable({
  orders,
  isPending,
  isError,
  error,
  onRefetch,
  onViewDetail,
}: OrdersTableProps) {
  return (
    <div className="overflow-x-auto bg-white">
      <Table>
        <TableHeader className="bg-slate-50/70">
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <TableMessage>Loading orders...</TableMessage>}
          {isError && (
            <TableMessage>
              <span>
                Could not load orders:{" "}
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
          {!isPending && !isError && orders.length === 0 && (
            <TableMessage>No orders match the current filters.</TableMessage>
          )}
          {!isPending &&
            !isError &&
            orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-medium text-slate-700">
                  #{order.id}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium text-slate-800">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {order.customerEmail}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items
                </TableCell>
                <TableCell>
                  <OrderStatusBadge value={order.paymentStatus} />
                </TableCell>
                <TableCell>
                  <OrderStatusBadge value={order.status} />
                </TableCell>
                <TableCell className="text-right font-medium text-slate-800">
                  {formatVnd(order.total)}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    aria-label={`View order ${order.id}`}
                    onClick={() => onViewDetail(order)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
});
