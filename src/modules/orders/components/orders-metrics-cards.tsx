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
    <div className="space-y-3 font-mono select-none">
      {/* Header & Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#ece945]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-foreground" />
            REAL-TIME ORDER PERFORMANCE
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

      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Orders */}
        <div className="border border-border bg-card p-3 shadow-hard-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase tracking-wider">TOTAL ORDERS</span>
            <div className="h-7 w-7 border border-border bg-muted/30 text-foreground flex items-center justify-center">
              <ShoppingBag className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-20 animate-pulse bg-muted" />
            ) : (
              <div className="font-heading text-2xl font-bold text-foreground">
                {safeNumber(metrics?.totalOrders)}
              </div>
            )}
            <p className="mt-0.5 text-[10px] text-muted-foreground">Recorded orders</p>
          </div>
        </div>

        {/* Paid Orders */}
        <div className="border border-border bg-card p-3 shadow-hard-sm">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[10px] uppercase tracking-wider">SETTLED ORDERS</span>
            <div className="h-7 w-7 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-20 animate-pulse bg-muted" />
            ) : (
              <div className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {safeNumber(metrics?.paidOrders)}
              </div>
            )}
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {paidRate}% settlement rate
            </p>
          </div>
        </div>

        {/* Revenue */}
        <div className="border border-border bg-card p-3 shadow-hard-sm">
          <div className="flex items-center justify-between text-foreground">
            <span className="text-[10px] uppercase tracking-wider">GROSS REVENUE</span>
            <div className="h-7 w-7 border border-[#ece945] bg-[#ece945]/10 text-foreground flex items-center justify-center">
              <CircleDollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-28 animate-pulse bg-muted" />
            ) : (
              <div className="font-heading text-xl sm:text-2xl font-bold text-foreground truncate select-all">
                {formatVnd(metrics?.revenue?.amountMinor ?? 0)}
              </div>
            )}
            <p className="mt-0.5 text-[10px] text-muted-foreground">Settled turnover</p>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="border border-border bg-card p-3 shadow-hard-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase tracking-wider">AVERAGE ORDER VALUE</span>
            <div className="h-7 w-7 border border-border bg-muted/30 text-foreground flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-7 w-24 animate-pulse bg-muted" />
            ) : (
              <div className="font-heading text-xl sm:text-2xl font-bold text-foreground truncate select-all">
                {formatVnd(metrics?.averageOrderValue?.amountMinor ?? 0)}
              </div>
            )}
            <p className="mt-0.5 text-[10px] text-muted-foreground">Per settled checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
});

OrdersMetricsCards.displayName = "OrdersMetricsCards";
