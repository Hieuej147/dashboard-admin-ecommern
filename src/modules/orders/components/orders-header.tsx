import React from "react";
import { ShoppingCart } from "lucide-react";

export const OrdersHeader = React.memo(function OrdersHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center font-mono select-none">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#ece945] uppercase">
          <span>FULFILLMENT DISPATCH</span>
        </div>
        <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase">
          ORDER MANAGEMENT
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Track settlement status, warehouse dispatch, and delivery pipelines.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs font-bold uppercase tracking-wider text-foreground shadow-hard-sm">
        <ShoppingCart className="h-4 w-4 text-[#ece945]" />
        <span>ORDER LIFECYCLE</span>
      </div>
    </div>
  );
});

OrdersHeader.displayName = "OrdersHeader";
