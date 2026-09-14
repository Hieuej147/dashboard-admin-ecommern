import React, { useState } from "react";
import { useHealth } from "@/hooks/use-health";
import { Activity, RefreshCw } from "lucide-react";

export const SystemHealthBadge = React.memo(function SystemHealthBadge() {
  const { data, isLoading, isError, isFetching, refetch } = useHealth();
  const [showTooltip, setShowTooltip] = useState(false);

  const isHealthy = !isLoading && !isError && data?.status === "ok";

  return (
    <div className="relative font-mono">
      <button
        type="button"
        onClick={() => refetch()}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border transition-colors ${
          isHealthy
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
            : isLoading
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
        }`}
        title="Click to check API Gateway connection"
      >
        <span className="relative flex h-2 w-2">
          {isHealthy && (
            <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2 w-2 ${
              isHealthy
                ? "bg-emerald-500"
                : isLoading
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
          />
        </span>
        <span className="hidden sm:inline">
          {isHealthy
            ? `GATEWAY: OK (${data?.latencyMs ?? 0}ms)`
            : isLoading
            ? "CHECKING..."
            : "DISCONNECTED"}
        </span>
        <RefreshCw
          className={`h-3 w-3 ${isFetching ? "animate-spin text-muted-foreground" : "opacity-60"}`}
        />
      </button>

      {/* Popover / Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-64 border border-border bg-card p-3 text-xs text-card-foreground shadow-hard-md z-50 pointer-events-none animate-in fade-in duration-100 font-mono">
          <div className="flex items-center gap-2 border-b border-border pb-2 mb-2 font-bold uppercase tracking-wider">
            <Activity className="h-3.5 w-3.5 text-[#ece945]" />
            <span>SYSTEM STATUS</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gateway:</span>
              <span className={isHealthy ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                {isHealthy ? "Operational" : isError ? "Unresponsive" : "Checking"}
              </span>
            </div>
            {data?.latencyMs !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latency:</span>
                <span className="font-bold">{data.latencyMs} ms</span>
              </div>
            )}
            {data?.timestamp && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="text-muted-foreground">{data.timestamp}</span>
              </div>
            )}
            <div className="text-[10px] text-muted-foreground pt-1.5 border-t border-border">
              Auto-refreshed every 30s
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

SystemHealthBadge.displayName = "SystemHealthBadge";
