import React from "react";
import { useHealth } from "@/hooks/use-health";
import { useUser } from "@clerk/clerk-react";
import { ENV } from "@/config/env";
import { Activity, CheckCircle2, XCircle, RefreshCw, Server, ShieldCheck } from "lucide-react";

export const SystemDiagnosticsCard = React.memo(function SystemDiagnosticsCard() {
  const { data: health, isLoading, isError, isFetching, refetch } = useHealth();
  const { user, isLoaded } = useUser();

  const isHealthy = !isLoading && !isError && health?.status === "ok";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">System Diagnostics & Health</h3>
            <p className="text-xs text-slate-500">Live monitoring of API gateway and authentication services</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span>Ping Gateway</span>
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Gateway Service */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">API Gateway Endpoint</span>
            {isHealthy ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Operational
              </span>
            ) : isLoading ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                Connecting...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                <XCircle className="h-3 w-3" /> Degraded / Offline
              </span>
            )}
          </div>
          <div className="mt-2 space-y-1">
            <p className="font-mono text-xs text-slate-800 break-all">{ENV.API_BASE_URL}/health</p>
            <div className="flex items-center gap-4 pt-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Activity className="h-3 w-3 text-slate-400" />
                Latency: <strong className="text-slate-700">{health?.latencyMs ?? "--"} ms</strong>
              </span>
              <span>Last checked: {health?.timestamp ?? "--"}</span>
            </div>
          </div>
        </div>

        {/* Auth & Security */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Clerk Auth Provider</span>
            {isLoaded && user ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <ShieldCheck className="h-3 w-3" /> Authenticated
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                Checking...
              </span>
            )}
          </div>
          <div className="mt-2 space-y-1 text-xs">
            <p className="text-slate-800">
              User ID: <strong className="font-mono text-slate-700">{user?.id ?? "--"}</strong>
            </p>
            <p className="text-slate-500">
              Email: <span className="text-slate-700">{user?.primaryEmailAddress?.emailAddress ?? "--"}</span>
            </p>
            <p className="text-slate-500">
              Role Token: <span className="font-medium text-indigo-600">admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
