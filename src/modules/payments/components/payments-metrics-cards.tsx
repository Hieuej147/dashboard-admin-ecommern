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
    <div className="space-y-3">
      {/* Filter row */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
          Stripe Payment Gateway Status
        </h3>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setPeriod("all")}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              period === "all"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            All Time
          </button>
          <button
            type="button"
            onClick={() => setPeriod("30d")}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              period === "30d"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setPeriod("7d")}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              period === "7d"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            7 Days
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Transactions */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Transactions</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-16 animate-pulse bg-slate-100 rounded" />
            ) : (
              <div className="text-2xl font-bold text-slate-900">
                {safeNumber(metrics?.totalCount)}
              </div>
            )}
            <p className="mt-0.5 text-[11px] text-slate-500">Stripe checkouts</p>
          </div>
        </div>

        {/* Paid / Completed */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Successful</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-16 animate-pulse bg-slate-100 rounded" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600">
                {safeNumber(metrics?.paidCount)}
              </div>
            )}
            <p className="mt-0.5 text-[11px] text-slate-500">
              {successRate}% success rate
            </p>
          </div>
        </div>

        {/* Pending / Processing */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Pending</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-16 animate-pulse bg-slate-100 rounded" />
            ) : (
              <div className="text-2xl font-bold text-amber-600">
                {safeNumber(metrics?.pendingCount)}
              </div>
            )}
            <p className="mt-0.5 text-[11px] text-slate-500">Awaiting webhook</p>
          </div>
        </div>

        {/* Failed */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Failed</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-16 animate-pulse bg-slate-100 rounded" />
            ) : (
              <div className="text-2xl font-bold text-rose-600">
                {safeNumber(metrics?.failedCount)}
              </div>
            )}
            <p className="mt-0.5 text-[11px] text-slate-500">Declined / cancelled</p>
          </div>
        </div>
      </div>
    </div>
  );
});
