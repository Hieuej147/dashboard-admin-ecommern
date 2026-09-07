import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomersPaginationProps {
  page: number;
  totalCustomers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isFetching: boolean;
  isPending: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPrefetchNextPage?: () => void;
}

export const CustomersPagination = React.memo(function CustomersPagination({
  page,
  totalCustomers,
  hasNextPage,
  hasPrevPage,
  isFetching,
  isPending,
  onPrevPage,
  onNextPage,
  onPrefetchNextPage,
}: CustomersPaginationProps) {
  return (
    <div className="flex items-center justify-center border-t border-slate-100 px-4 py-3 text-xs text-slate-500 gap-4 bg-white rounded-b-xl">
      <span>
        Page {page} · Showing {totalCustomers} customers
        {isFetching && !isPending ? " · Updating..." : ""}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!hasPrevPage || isFetching}
          onClick={onPrevPage}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[2rem] text-center font-medium text-slate-700">
          {page}
        </span>
        <button
          type="button"
          disabled={!hasNextPage || isFetching}
          onClick={onNextPage}
          onMouseEnter={onPrefetchNextPage}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});
