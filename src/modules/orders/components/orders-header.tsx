import React from "react";
import { ShoppingCart } from "lucide-react";

export const OrdersHeader = React.memo(function OrdersHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-500">
          Commerce
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Orders
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track payments and keep every delivery moving.
        </p>
      </div>
      <button
        type="button"
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        <ShoppingCart className="h-4 w-4" /> Order workflow
      </button>
    </div>
  );
});
