import React, { useMemo } from "react";
import {
  CreditCard,
  DollarSign,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
        label: "Total Revenue",
        value: revenueStr,
        delta: "From paid orders",
        icon: DollarSign,
        tone: "bg-indigo-50 text-indigo-600",
      },
      {
        label: "Completed Orders",
        value: orderCountStr,
        delta: "Processed successfully",
        icon: ShoppingBag,
        tone: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Average Order",
        value: avgOrderStr,
        delta: "Revenue / Order",
        icon: TrendingUp,
        tone: "bg-amber-50 text-amber-600",
      },
      {
        label: "Payment Health",
        value: `${healthPercent}%`,
        delta: "Success rate",
        icon: CreditCard,
        tone: "bg-violet-50 text-violet-600",
      },
    ],
    [revenueStr, orderCountStr, avgOrderStr, healthPercent]
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.label} className="gap-3 py-5">
            <CardContent className="px-5">
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${metric.tone}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[11px] text-slate-400">
                  {metric.delta}
                </span>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {metric.label}
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 truncate">
                {isLoading ? "—" : metric.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});
