import React from "react";
import { RefreshCw } from "lucide-react";
import type { OverviewHeaderProps } from "../types/overview.types";

export const OverviewHeader = React.memo(function OverviewHeader({
  todayStr,
  userName,
  isFetching,
  onRefetch,
}: OverviewHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center font-mono select-none">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#ece945] uppercase">
          <span>COMMERCIAL OPERATIONS CENTER</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{todayStr}</span>
        </div>
        <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase">
          SYSTEM OVERVIEW
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Welcome back, {userName}. Real-time monitoring of revenue, stock levels, and order pipelines.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefetch}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 border border-border bg-card hover:bg-muted px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground shadow-hard-sm disabled:opacity-50 transition-colors cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[#ece945]" : "text-muted-foreground"}`}
          />
          <span>{isFetching ? "SYNCING..." : "REFRESH"}</span>
        </button>

        <div className="inline-flex items-center gap-1.5 border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 bg-emerald-500 inline-block animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>
    </div>
  );
});

OverviewHeader.displayName = "OverviewHeader";
