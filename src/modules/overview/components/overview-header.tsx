import React from "react";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OverviewHeaderProps } from "../types/overview.types";

export const OverviewHeader = React.memo(function OverviewHeader({
  todayStr,
  userName,
  isFetching,
  onRefetch,
}: OverviewHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
          {todayStr}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Good day, {userName}.
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is the real-time overview of your store's operations.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefetch}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50 transition"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-indigo-600" : "text-slate-500"}`}
          />
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
        <Badge
          variant="outline"
          className="border-emerald-200 bg-emerald-50 text-emerald-700"
        >
          ● Live overview
        </Badge>
      </div>
    </div>
  );
});
