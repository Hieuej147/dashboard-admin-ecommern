import React from "react";
import { PackagePlus, Boxes, CheckCircle2, AlertTriangle, HardDrive } from "lucide-react";

interface ProductsHeaderProps {
  onOpenCreate: () => void;
  stats?: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
}

export const ProductsHeader = React.memo(function ProductsHeader({
  onOpenCreate,
  stats = { total: 0, active: 0, lowStock: 0, outOfStock: 0 },
}: ProductsHeaderProps) {
  return (
    <div className="space-y-4 font-mono select-none">
      {/* Top Bar with Title & Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#ece945] uppercase">
            <span>CATALOG & WAREHOUSE</span>
          </div>
          <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase">
            PRODUCTS & INVENTORY
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage product lines, retail pricing, and sync S3 asset storage.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 border border-black dark:border-white bg-[#ece945] text-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider shadow-hard-sm hover:translate-y-[-1px] active:translate-y-[1px] transition-transform cursor-pointer"
        >
          <PackagePlus className="h-4 w-4" />
          <span>NEW PRODUCT</span>
        </button>
      </div>

      {/* 4 KPI Terminal Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total SKU */}
        <div className="border border-border bg-card p-3 shadow-hard-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase tracking-wider">TOTAL SKUS</span>
            <Boxes className="h-3.5 w-3.5" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-foreground">
              {stats.total}
            </span>
            <span className="text-[10px] text-muted-foreground">items</span>
          </div>
        </div>

        {/* Active Stock */}
        <div className="border border-border bg-card p-3 shadow-hard-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[10px] uppercase tracking-wider">IN STOCK</span>
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.active}
            </span>
            <span className="text-[10px] text-muted-foreground">active</span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="border border-border bg-card p-3 shadow-hard-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-[10px] uppercase tracking-wider">LOW STOCK ALERTS</span>
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.lowStock}
            </span>
            <span className="text-[10px] text-muted-foreground">items &lt; 10</span>
          </div>
        </div>

        {/* S3 Storage Status */}
        <div className="border border-border bg-card p-3 shadow-hard-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-foreground">
            <span className="text-[10px] uppercase tracking-wider">S3 ASSET STORAGE</span>
            <HardDrive className="h-3.5 w-3.5 text-[#ece945]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-lg font-bold text-foreground">
              ONLINE
            </span>
            <span className="text-[10px] text-emerald-500 font-bold">PORT 9002</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductsHeader.displayName = "ProductsHeader";
