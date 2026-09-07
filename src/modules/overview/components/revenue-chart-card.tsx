import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { RevenueChartCardProps } from "../types/overview.types";

export const RevenueChartCard = React.memo(function RevenueChartCard({
  chartData,
}: RevenueChartCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-base">Revenue Overview</CardTitle>
          <CardDescription className="mt-1">
            Gross revenue performance across recent periods.
          </CardDescription>
        </div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
        >
          View all orders <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="h-72 pt-5">
        <ResponsiveContainer width="100%" height="100%" debounce={150}>
          <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(15,23,42,.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
