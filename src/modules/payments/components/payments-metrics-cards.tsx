import React, { useState, useMemo } from "react";
import { usePaymentMetrics } from "@/hooks/use-payments";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
} from "lucide-react";

export const PaymentsMetricsCards = React.memo(function PaymentsMetricsCards() {
  const [period, setPeriod] = useState<"all" | "30d" | "7d">("all");

  const dateRange = useMemo(() => {
    const now = new Date();
    if (period === "7d") {
      const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { from: from.toISOString(), to: now.toISOString() };
    }
    if (period === "30d") {
      const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { from: from.toISOString(), to: now.toISOString() };
    }
    return undefined;
  }, [period]);

  const { data: metrics, isLoading } = usePaymentMetrics(dateRange);

  const safeNumber = (val: unknown): string => {
    const num = typeof val === "number" && !Number.isNaN(val) ? val : 0;
    return num.toLocaleString();
  };

  const successRate =
    metrics && typeof metrics.totalCount === "number" && metrics.totalCount > 0
      ? Math.round((Number(metrics.paidCount || 0) / metrics.totalCount) * 100)
      : 0;

  return (
    <div className="space-y-3 font-mono select-none">
      {/* Header & Filter Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#ece945]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-foreground" />
            STRIPE GATEWAY TELEMETRY
          </h3>
        </div>

        <div className="flex items-center gap-1 border border-border bg-card p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setPeriod("all")}
            className={`px-2.5 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
              period === "all"
                ? "bg-primary text-primary-foreground font-bold shadow-hard-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            ALL TIME
          </button>
          <button
            type="button"
            onClick={() => setPeriod("30d")}
            className={`px-2.5 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
              period === "30d"
                ? "bg-primary text-primary-foreground font-bold shadow-hard-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            30 DAYS
          </button>
          <button
            type="button"
            onClick={() => setPeriod("7d")}
            className={`px-2.5 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
              period === "7d"
                ? "bg-primary text-primary-foreground font-bold shadow-hard-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            7 DAYS
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Transactions */}
        <div className="border border-border bg-card p-3 shadow-hard-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase tracking-wider">TOTAL TRANSACTIONS</span>
            <div className="h-7 w-7 border border-border bg-muted/30 text-foreground flex items-center justify-center">
              <CreditCard className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-20 animate-pulse bg-muted" />
            ) : (
              <div className="font-heading text-2xl font-bold text-foreground">
                {safeNumber(metrics?.totalCount)}
              </div>
            )}
            <p className="mt-0.5 text-[10px] text-muted-foreground">Stripe checkout sessions</p>
          </div>
        </div>

        {/* Paid / Successful */}
        <div className="border border-border bg-card p-3 shadow-hard-sm">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[10px] uppercase tracking-wider">SETTLED</span>
            <div className="h-7 w-7 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-20 animate-pulse bg-muted" />
            ) : (
              <div className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {safeNumber(metrics?.paidCount)}
              </div>
            )}
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {successRate}% settlement rate
            </p>
          </div>
        </div>

        {/* Pending / Processing */}
        <div className="border border-border bg-card p-3 shadow-hard-sm">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-[10px] uppercase tracking-wider">PENDING</span>
            <div className="h-7 w-7 border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-20 animate-pulse bg-muted" />
            ) : (
              <div className="font-heading text-2xl font-bold text-amber-600 dark:text-amber-400">
                {safeNumber(metrics?.pendingCount)}
              </div>
            )}
            <p className="mt-0.5 text-[10px] text-muted-foreground">Awaiting webhook capture</p>
          </div>
        </div>

        {/* Failed */}
        <div className="border border-border bg-card p-3 shadow-hard-sm">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
            <span className="text-[10px] uppercase tracking-wider">FAILED OR CANCELLED</span>
            <div className="h-7 w-7 border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-20 animate-pulse bg-muted" />
            ) : (
              <div className="font-heading text-2xl font-bold text-rose-600 dark:text-rose-400">
                {safeNumber(metrics?.failedCount)}
              </div>
            )}
            <p className="mt-0.5 text-[10px] text-muted-foreground">Declined or expired checkouts</p>
          </div>
        </div>
      </div>
    </div>
  );
});

PaymentsMetricsCards.displayName = "PaymentsMetricsCards";
