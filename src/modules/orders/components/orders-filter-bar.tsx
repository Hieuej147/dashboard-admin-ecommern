import React from "react";
import { Download, Search } from "lucide-react";
import { toast } from "@/components/ui/toast";

export type OrderStatus = "" | "PAID" | "PENDING_PAYMENT" | "CANCELLED";

interface OrdersFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: OrderStatus;
  onStatusChange: (value: OrderStatus) => void;
}

export const OrdersFilterBar = React.memo(function OrdersFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: OrdersFilterBarProps) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-border bg-card p-3 sm:flex-row font-mono select-none">
      <div className="flex flex-1 items-center gap-2 border border-border bg-muted/30 px-3 text-muted-foreground focus-within:border-foreground">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by order ID or customer email..."
          className="h-9 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as OrderStatus)}
          className="h-9 border border-border bg-card px-3 text-xs font-bold uppercase tracking-wider text-foreground outline-none focus:border-foreground cursor-pointer"
        >
          <option value="">ALL STATUSES</option>
          <option value="PAID">SETTLED (PAID)</option>
          <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <button
          type="button"
          onClick={() => {
            toast.info("[ EXPORT INITIATED ] Preparing order telemetry export dataset...");
          }}
          className="inline-flex h-9 items-center justify-center gap-2 border border-border bg-muted/40 hover:bg-muted px-3 text-xs font-bold uppercase tracking-wider text-foreground transition-colors cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">EXPORT</span>
        </button>
      </div>
    </div>
  );
});

OrdersFilterBar.displayName = "OrdersFilterBar";
