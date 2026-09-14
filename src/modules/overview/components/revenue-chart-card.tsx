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
import type { RevenueChartCardProps } from "../types/overview.types";

export const RevenueChartCard = React.memo(function RevenueChartCard({
  chartData,
}: RevenueChartCardProps) {
  return (
    <div className="border border-border bg-card shadow-hard-md overflow-hidden font-mono select-none flex flex-col justify-between">
      <div className="flex flex-row items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#ece945]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              PERIODIC REVENUE TRAJECTORY
            </h3>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Gross revenue performance over recent months (Unit: Million VND)
          </p>
        </div>

        <Link
          to="/orders"
          className="inline-flex items-center gap-1 border border-border bg-muted/40 hover:bg-muted px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground transition-colors"
        >
          <span>VIEW ORDERS</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="h-72 p-4">
        <ResponsiveContainer width="100%" height="100%" debounce={150}>
          <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 12 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ece945" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ece945" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="rgba(148, 163, 184, 0.15)"
              strokeDasharray="2 2"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "Space Mono" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "Space Mono" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0px",
                border: "1px solid #000000",
                backgroundColor: "#16181a",
                color: "#f3f4f6",
                boxShadow: "3px 3px 0px 0px rgba(0,0,0,0.9)",
                fontFamily: "Space Mono",
                fontSize: "11px",
              }}
              formatter={(val: any) => [`${val}M VND`, "Revenue"]}
            />
            <Area
              type="stepAfter"
              dataKey="revenue"
              stroke="#ece945"
              strokeWidth={2}
              fill="url(#revenueFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

RevenueChartCard.displayName = "RevenueChartCard";
