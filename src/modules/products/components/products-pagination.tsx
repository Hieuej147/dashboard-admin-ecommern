import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsPaginationProps {
  page: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isFetching: boolean;
  isPending: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPrefetchNextPage?: () => void;
}

export const ProductsPagination = React.memo(function ProductsPagination({
  page,
  totalItems,
  hasNextPage,
  hasPrevPage,
  isFetching,
  isPending,
  onPrevPage,
  onNextPage,
  onPrefetchNextPage,
}: ProductsPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3 text-xs font-mono select-none">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>PAGE</span>
        <span className="font-bold text-foreground bg-muted px-1.5 py-0.5 border border-border">
          {page}
        </span>
        <span>· SHOWING {totalItems} ITEMS</span>
        {isFetching && !isPending && (
          <span className="text-[#ece945] animate-pulse">· SYNCING...</span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={!hasPrevPage || isFetching}
          onClick={onPrevPage}
          className="inline-flex h-8 items-center gap-1 border border-border bg-muted/30 px-2.5 text-xs font-bold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30 transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">PREV</span>
        </button>

        <button
          type="button"
          disabled={!hasNextPage || isFetching}
          onClick={onNextPage}
          onMouseEnter={onPrefetchNextPage}
          className="inline-flex h-8 items-center gap-1 border border-border bg-muted/30 px-2.5 text-xs font-bold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30 transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">NEXT</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
});

ProductsPagination.displayName = "ProductsPagination";
