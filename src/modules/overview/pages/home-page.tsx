import { useState, useMemo, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { useAppSelector } from "@/lib/store/store";
import { useAdminOverview } from "@/hooks/use-overview";
import { formatVnd, parseMoneyAmount } from "@/lib/utils";
import type { OrderDto } from "@/hooks/query-key/query-key";
import { OrderDetail } from "@/modules/dashboard/components/ui/orders/order-detail";
import {
  OverviewHeader,
  KpiMetricsSection,
  RevenueChartCard,
  InventoryPulseCard,
  AttentionOrdersCard,
  LowStockAlertsCard,
} from "../";

const FALLBACK_CHART_SERIES = [
  { month: "Jan", revenue: 15 },
  { month: "Feb", revenue: 22 },
  { month: "Mar", revenue: 28 },
  { month: "Apr", revenue: 35 },
  { month: "May", revenue: 42 },
  { month: "Jun", revenue: 50 },
  { month: "Jul", revenue: 62 },
  { month: "Aug", revenue: 78 },
];

export default function Homepage() {
  const { user } = useUser();
  const activeDashboardId = useAppSelector(
    (state) => state.dashboardUi.activeDashboardId,
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminOverview();

  // Selected order for detail modal
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const todayStr = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  const userName = user?.firstName || user?.fullName || "Admin";

  // Metrics from API
  const revenueStr = formatVnd(data?.revenue);
  const orderCount = parseMoneyAmount(data?.orderCount);
  const orderCountStr = useMemo(
    () => orderCount.toLocaleString(),
    [orderCount],
  );
  const avgOrderStr = formatVnd(data?.averageOrder);
  const healthPercent = parseMoneyAmount(data?.paymentHealth);

  const inventory = data?.inventory;
  const totalProducts = parseMoneyAmount(inventory?.totalProducts);
  const activeProducts = parseMoneyAmount(inventory?.activeProducts);
  const lowStockCount = parseMoneyAmount(inventory?.lowStockProducts);
  const outOfStockCount = parseMoneyAmount(inventory?.outOfStockProducts);

  // Chart data: memoized array reference
  const chartData = useMemo(() => {
    if (data?.revenueSeries && data.revenueSeries.length > 0) {
      return data.revenueSeries;
    }
    return FALLBACK_CHART_SERIES;
  }, [data?.revenueSeries]);

  const exceptions = useMemo(() => data?.exceptions ?? [], [data?.exceptions]);
  const lowStockProducts = useMemo(
    () => data?.lowStock ?? [],
    [data?.lowStock],
  );

  const handleOpenDetail = useCallback((order: OrderDto) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  }, []);

  const handleRefetch = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="flex min-h-full flex-col gap-6">
      {/* 1. Dynamic A2UI Dashboard Section (Teleported via Portal) */}
      <div
        id="dashboard-root"
        className={`w-full transition-all duration-500 ${
          activeDashboardId ? "block mb-8" : "hidden"
        }`}
      />

      {/* 2. Overview Dashboard */}
      {!activeDashboardId && (
        <div className="flex flex-col gap-6">
          {/* Header */}
          <OverviewHeader
            todayStr={todayStr}
            userName={userName}
            isFetching={isFetching}
            onRefetch={handleRefetch}
          />

          {/* Error State */}
          {isError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load store overview:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
              <button
                type="button"
                onClick={handleRefetch}
                className="ml-2 font-medium underline hover:text-rose-900"
              >
                Try again
              </button>
            </div>
          )}

          {/* Top 4 KPI Metrics */}
          <KpiMetricsSection
            revenueStr={revenueStr}
            orderCountStr={orderCountStr}
            avgOrderStr={avgOrderStr}
            healthPercent={healthPercent}
            isLoading={isLoading}
          />

          {/* Revenue Chart & Inventory Pulse */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.55fr]">
            <RevenueChartCard chartData={chartData} />
            <InventoryPulseCard
              lowStockCount={lowStockCount}
              outOfStockCount={outOfStockCount}
              activeProducts={activeProducts}
              totalProducts={totalProducts}
              lowStockProducts={lowStockProducts}
            />
          </div>

          {/* Bottom Grid: Exceptions & Low Stock Products */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <AttentionOrdersCard
              exceptions={exceptions}
              onOpenDetail={handleOpenDetail}
            />
            <LowStockAlertsCard lowStockProducts={lowStockProducts} />
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetail
        order={selectedOrder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
