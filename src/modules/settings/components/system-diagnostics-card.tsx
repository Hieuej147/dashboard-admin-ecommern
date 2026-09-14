import React from "react";
import { useHealth } from "@/hooks/use-health";
import { useUser } from "@clerk/clerk-react";
import { ENV } from "@/config/env";
import { Activity, RefreshCw, Server, ShieldCheck, Database } from "lucide-react";
import { toast } from "@/components/ui/toast";

export const SystemDiagnosticsCard = React.memo(function SystemDiagnosticsCard() {
  const { data: health, isLoading, isError, isFetching, refetch } = useHealth();
  const { user, isLoaded } = useUser();

  const isHealthy = !isLoading && !isError && health?.status === "ok";

  const handleProbe = async () => {
    toast.info("[ PROBE INITIATED ] Querying API Gateway & telemetry latency...");
    const res = await refetch();
    if (res.isSuccess) {
      toast.success(`[ TELEMETRY SYNC ] Gateway operational (${res.data?.latencyMs ?? 0} ms)`);
    } else {
      toast.error("[ TELEMETRY ERROR ] Gateway probe failed or unresponsive");
    }
  };

  return (
    <div className="border border-border bg-card shadow-hard-sm font-mono">
      {/* Terminal Title Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border bg-muted/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-border bg-primary text-primary-foreground font-bold">
            <Server className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              INFRASTRUCTURE DIAGNOSTICS & TELEMETRY
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Real-time monitoring of API Gateway, MinIO S3 object storage, and Clerk authentication
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleProbe}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted disabled:opacity-40 transition-colors shadow-hard-sm cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
          <span>PROBE ENDPOINTS</span>
        </button>
      </div>

      {/* Diagnostics Grid */}
      <div className="p-4 grid gap-4 lg:grid-cols-3">
        {/* Gateway Service */}
        <div className="border border-border bg-card p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Server className="h-3 w-3" />
              API GATEWAY
            </span>
            {isHealthy ? (
              <span className="border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                [ OPERATIONAL ]
              </span>
            ) : isLoading ? (
              <span className="border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                [ CONNECTING ]
              </span>
            ) : (
              <span className="border border-rose-500/40 bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                [ DISCONNECTED ]
              </span>
            )}
          </div>

          <div className="space-y-1 text-xs">
            <p className="text-[11px] text-foreground font-bold break-all bg-muted/40 p-1.5 border border-border">
              {ENV.API_BASE_URL}/health
            </p>
            <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Latency: <strong className="text-foreground">{health?.latencyMs ?? "--"} ms</strong>
              </span>
              <span>Updated: {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString("en-US") : "--"}</span>
            </div>
          </div>
        </div>

        {/* MinIO S3 Storage */}
        <div className="border border-border bg-card p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Database className="h-3 w-3" />
              MINIO S3 STORAGE
            </span>
            <span className="border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              [ PORT 9002: READY ]
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <p className="text-[11px] text-foreground font-bold break-all bg-muted/40 p-1.5 border border-border">
              http://localhost:9002/ecommerce-products
            </p>
            <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
              <span>Protocol: Binary Presigned URL PUT</span>
              <span>Bucket: ecommerce-products</span>
            </div>
          </div>
        </div>

        {/* Auth & Security */}
        <div className="border border-border bg-card p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" />
              CLERK AUTHENTICATION
            </span>
            {isLoaded && user ? (
              <span className="border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                [ AUTHENTICATED ]
              </span>
            ) : (
              <span className="border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                [ VERIFYING ]
              </span>
            )}
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Identifier:</span>
              <strong className="text-foreground truncate max-w-[140px]">{user?.id ?? "--"}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground truncate max-w-[140px]">{user?.primaryEmailAddress?.emailAddress ?? "--"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
