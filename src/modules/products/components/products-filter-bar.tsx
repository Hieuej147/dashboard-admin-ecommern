import React from "react";
import { Download, Search } from "lucide-react";

interface ProductsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export const ProductsFilterBar = React.memo(function ProductsFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: ProductsFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row">
      <label className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 px-3 text-slate-400">
        <Search className="h-4 w-4" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
          className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </label>
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
      >
        <option value="all">All statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="LOW_STOCK">Low stock</option>
        <option value="OUT_OF_STOCK">Out of stock</option>
      </select>
      <button
        type="button"
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50"
      >
        <Download className="h-4 w-4" /> Export
      </button>
    </div>
  );
});
