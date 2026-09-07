import React, { useState } from "react";
import { useHealth } from "@/hooks/use-health";
import { Activity, RefreshCw } from "lucide-react";

export const SystemHealthBadge = React.memo(function SystemHealthBadge() {
  const { data, isLoading, isError, isFetching, refetch } = useHealth();
  const [showTooltip, setShowTooltip] = useState(false);

  const isHealthy = !isLoading && !isError && data?.status === "ok";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => refetch()}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
          isHealthy
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80"
            : isLoading
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
        }`}
        title="Click to check backend connectivity"
      >
        <span className="relative flex h-2 w-2">
          {isHealthy && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
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
            ? `Gateway OK (${data?.latencyMs ?? 0}ms)`
            : isLoading
            ? "Checking..."
            : "Gateway Offline"}
        </span>
        <RefreshCw
          className={`h-3 w-3 ${isFetching ? "animate-spin text-slate-500" : "opacity-60"}`}
        />
      </button>

      {/* Popover / Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-slate-900 p-3 text-xs text-white shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 font-medium">
            <Activity className="h-3.5 w-3.5 text-indigo-400" />
            <span>API Gateway Health</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={isHealthy ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                {isHealthy ? "Operational (200 OK)" : isError ? "Offline" : "Checking"}
              </span>
            </div>
            {data?.latencyMs !== undefined && (
              <div className="flex justify-between">
                <span>Latency:</span>
                <span className="text-slate-100">{data.latencyMs} ms</span>
              </div>
            )}
            {data?.timestamp && (
              <div className="flex justify-between">
                <span>Checked at:</span>
                <span className="text-slate-400">{data.timestamp}</span>
              </div>
            )}
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
              Auto-refreshes every 30 seconds
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
