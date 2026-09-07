import type { LucideIcon } from "lucide-react";
import type { OrderDto, ProductDto } from "@/hooks/query-key/query-key";

export interface MetricItem {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tone: string;
}

export interface OverviewHeaderProps {
  todayStr: string;
  userName: string;
  isFetching: boolean;
  onRefetch: () => void;
}

export interface KpiMetricsSectionProps {
  revenueStr: string;
  orderCountStr: string;
  avgOrderStr: string;
  healthPercent: number;
  isLoading: boolean;
}

export interface RevenueChartCardProps {
  chartData: Array<{
    month?: string;
    date?: string;
    revenue?: number;
    [key: string]: unknown;
  }>;
}

export interface InventoryPulseCardProps {
  lowStockCount: number;
  outOfStockCount: number;
  activeProducts: number;
  totalProducts: number;
  lowStockProducts: ProductDto[];
}

export interface AttentionOrdersCardProps {
  exceptions: OrderDto[];
  onOpenDetail: (order: OrderDto) => void;
}

export interface LowStockAlertsCardProps {
  lowStockProducts: ProductDto[];
}
