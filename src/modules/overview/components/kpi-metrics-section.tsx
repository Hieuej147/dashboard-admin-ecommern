import React, { useMemo } from "react";
import {
  CreditCard,
  CircleDollarSign,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import type {
  KpiMetricsSectionProps,
  MetricItem,
} from "../types/overview.types";

export const KpiMetricsSection = React.memo(function KpiMetricsSection({
  revenueStr,
  orderCountStr,
  avgOrderStr,
  healthPercent,
  isLoading,
}: KpiMetricsSectionProps) {
  const metrics: MetricItem[] = useMemo(
    () => [
      {
        label: "TOTAL REVENUE",
        value: revenueStr,
        delta: "Settled orders",
        icon: CircleDollarSign,
        tone: "border-[#ece945] bg-[#ece945]/10 text-foreground",
      },
      {
        label: "FULFILLED ORDERS",
        value: orderCountStr,
        delta: "Processed & delivered",
        icon: ShoppingBag,
        tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        label: "AVERAGE ORDER VALUE",
        value: avgOrderStr,
        delta: "Revenue per order",
        icon: TrendingUp,
        tone: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        label: "PAYMENT SUCCESS RATE",
        value: `${healthPercent}%`,
        delta: "Gateway settlements",
        icon: CreditCard,
        tone: "border-border bg-muted/40 text-foreground",
      },
    ],
    [revenueStr, orderCountStr, avgOrderStr, healthPercent]
  );

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 font-mono select-none">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="border border-border bg-card p-4 shadow-hard-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex h-8 w-8 items-center justify-center border ${metric.tone}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {metric.delta}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {metric.label}
              </p>
              <p className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground truncate select-all">
                {isLoading ? "..." : metric.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

KpiMetricsSection.displayName = "KpiMetricsSection";
