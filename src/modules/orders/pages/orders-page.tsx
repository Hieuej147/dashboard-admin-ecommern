import { useState, useCallback } from "react";
import { useAdminOrders } from "@/hooks/use-orders";
import type { OrderDto } from "@/hooks/query-key/query-key";
import {
  OrdersHeader,
  OrdersMetricsCards,
  OrdersFilterBar,
  OrdersTable,
  OrdersPagination,
  OrderDetail,
  type OrderStatus,
} from "../";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const {
    orders,
    page,
    hasNextPage,
    hasPrevPage,
    goNextPage,
    goPrevPage,
    prefetchNextPage,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminOrders({ search, status: status || undefined });

  const handleViewDetail = useCallback((order: OrderDto) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  }, []);

  const handleRefetch = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col gap-6">
      <OrdersHeader />

      <OrdersMetricsCards />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <OrdersFilterBar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />

        <OrdersTable
          orders={orders}
          isPending={isPending}
          isError={isError}
          error={error}
          onRefetch={handleRefetch}
          onViewDetail={handleViewDetail}
        />

        <OrdersPagination
          page={page}
          totalOrders={orders.length}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          isFetching={isFetching}
          isPending={isPending}
          onPrevPage={goPrevPage}
          onNextPage={goNextPage}
          onPrefetchNextPage={prefetchNextPage}
        />
      </div>

      <OrderDetail
        order={selectedOrder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
