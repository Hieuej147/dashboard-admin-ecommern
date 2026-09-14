import React, { type ReactNode } from "react";
import { Eye } from "lucide-react";
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
        className="py-12 text-center text-xs font-mono text-muted-foreground"
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

function OrderStatusBadge({ value }: { value: string }) {
  const normalized = (value || "").toUpperCase();
  const isPaid = normalized.includes("PAID");
  const isFailed = normalized.includes("FAILED") || normalized.includes("CANCEL");

  const style = isPaid
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : isFailed
    ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
    : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400";

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase border ${style}`}>
      {value ? value.replaceAll("_", " ") : "UNKNOWN"}
    </span>
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
    <div className="overflow-x-auto font-mono select-none">
      <Table>
        <TableHeader className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[120px] text-foreground font-bold">ORDER ID</TableHead>
            <TableHead className="text-foreground font-bold">CUSTOMER</TableHead>
            <TableHead className="w-[100px] text-foreground font-bold">ITEMS</TableHead>
            <TableHead className="w-[140px] text-foreground font-bold">PAYMENT</TableHead>
            <TableHead className="w-[140px] text-foreground font-bold">STATUS</TableHead>
            <TableHead className="text-right text-foreground font-bold">TOTAL</TableHead>
            <TableHead className="w-[60px] text-right text-foreground font-bold">VIEW</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xs">
          {isPending && <TableMessage>Loading order records...</TableMessage>}
          {isError && (
            <TableMessage>
              <span className="text-rose-500">
                Order fetch error:{" "}
                {error instanceof Error
                  ? error.message
                  : "Please verify the Order API service."}
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
          {!isPending && !isError && orders.length === 0 && (
            <TableMessage>No orders match the selected criteria.</TableMessage>
          )}
          {!isPending &&
            !isError &&
            orders.map((order) => (
              <TableRow key={order.id} className="border-b border-border/70 hover:bg-muted/30 transition-colors">
                <TableCell className="font-bold text-foreground select-all">
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <p className="font-bold text-foreground">
                    {order.customerName || "Guest"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {order.customerEmail}
                  </p>
                </TableCell>
                <TableCell className="text-foreground font-bold">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                </TableCell>
                <TableCell>
                  <OrderStatusBadge value={order.paymentStatus} />
                </TableCell>
                <TableCell>
                  <OrderStatusBadge value={order.status} />
                </TableCell>
                <TableCell className="text-right font-bold text-foreground select-all">
                  {formatVnd(order.total)}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    aria-label={`View order details for ${order.id}`}
                    onClick={() => onViewDetail(order)}
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
    </div>
  );
});

OrdersTable.displayName = "OrdersTable";
