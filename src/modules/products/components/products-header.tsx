import React from "react";
import { PackagePlus } from "lucide-react";

interface ProductsHeaderProps {
  onOpenCreate: () => void;
}

export const ProductsHeader = React.memo(function ProductsHeader({
  onOpenCreate,
}: ProductsHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-500">
          Catalog
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Products
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage the products customers can discover and buy.
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenCreate}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition"
      >
        <PackagePlus className="h-4 w-4" /> Add product
      </button>
    </div>
  );
});
