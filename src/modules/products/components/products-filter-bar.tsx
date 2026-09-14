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
    <div className="flex flex-col gap-2.5 border border-border bg-card p-3 shadow-hard-sm sm:flex-row font-mono select-none">
      <div className="flex flex-1 items-center gap-2 border border-border bg-muted/30 px-3 text-muted-foreground focus-within:border-foreground">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by product name or SKU..."
          className="h-9 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-9 border border-border bg-card px-3 text-xs font-bold uppercase tracking-wider text-foreground outline-none focus:border-foreground cursor-pointer"
        >
          <option value="all">ALL STATUSES</option>
          <option value="ACTIVE">IN STOCK</option>
          <option value="LOW_STOCK">LOW STOCK</option>
          <option value="OUT_OF_STOCK">OUT OF STOCK</option>
        </select>

        <button
          type="button"
          onClick={() => {
            alert("Preparing CSV export dataset...");
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

ProductsFilterBar.displayName = "ProductsFilterBar";
