import React, { useState, useMemo } from "react";
import { useOrderMetrics } from "@/hooks/use-orders";
import {
  ShoppingBag,
  CheckCircle2,
  TrendingUp,
  CircleDollarSign,
  Calendar,
} from "lucide-react";

export const OrdersMetricsCards = React.memo(function OrdersMetricsCards() {
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

  const { data: metrics, isLoading } = useOrderMetrics(dateRange);

  const formatVnd = (amountMinor: number = 0) => {
    const val = typeof amountMinor === "number" && !Number.isNaN(amountMinor) ? amountMinor : 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const safeNumber = (val: unknown): string => {
    const num = typeof val === "number" && !Number.isNaN(val) ? val : 0;
    return num.toLocaleString();
  };

  const paidRate =
    metrics && typeof metrics.totalOrders === "number" && metrics.totalOrders > 0
      ? Math.round((Number(metrics.paidOrders || 0) / metrics.totalOrders) * 100)
      : 0;

  return (
    <div className="space-y-3">
      {/* Header & Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
          Live Orders Performance
        </h3>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setPeriod("all")}
            className={`px-2.5 py-1 rounded-md transition ${
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
            className={`px-2.5 py-1 rounded-md transition ${
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
            className={`px-2.5 py-1 rounded-md transition ${
              period === "7d"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            7 Days
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Orders</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-20 animate-pulse bg-slate-100 rounded" />
            ) : (
              <div className="text-2xl font-bold text-slate-900">
                {safeNumber(metrics?.totalOrders)}
              </div>
            )}
            <p className="mt-0.5 text-[11px] text-slate-500">Recorded orders</p>
          </div>
        </div>

        {/* Paid Orders */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Paid Orders</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-20 animate-pulse bg-slate-100 rounded" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600">
                {safeNumber(metrics?.paidOrders)}
              </div>
            )}
            <p className="mt-0.5 text-[11px] text-slate-500">
              {paidRate}% fulfillment rate
            </p>
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Revenue</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-28 animate-pulse bg-slate-100 rounded" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                {formatVnd(metrics?.revenue?.amountMinor ?? 0)}
              </div>
            )}
            <p className="mt-0.5 text-[11px] text-slate-500">Settled income</p>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Avg Order Value</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-24 animate-pulse bg-slate-100 rounded" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                {formatVnd(metrics?.averageOrderValue?.amountMinor ?? 0)}
              </div>
            )}
            <p className="mt-0.5 text-[11px] text-slate-500">Per paid transaction</p>
          </div>
        </div>
      </div>
    </div>
  );
});
