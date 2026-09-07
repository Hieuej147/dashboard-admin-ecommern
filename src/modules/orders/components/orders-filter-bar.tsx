import React from "react";
import { Download, Search } from "lucide-react";

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
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row bg-white rounded-t-xl">
      <label className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 px-3 text-slate-400">
        <Search className="h-4 w-4" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search order or customer..."
          className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </label>
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as OrderStatus)}
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
      >
        <option value="">All order statuses</option>
        <option value="PAID">Paid</option>
        <option value="PENDING_PAYMENT">Pending payment</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <button
        type="button"
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50 transition"
      >
        <Download className="h-4 w-4" /> Export
      </button>
    </div>
  );
});
