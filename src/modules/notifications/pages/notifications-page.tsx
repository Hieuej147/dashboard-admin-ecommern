import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAdminNotifications,
  useMarkAdminNotificationRead,
  useMarkAllAdminNotificationsRead,
} from "@/hooks/use-notifications";
import type { AdminNotificationDto } from "@/hooks/query-key/query-key";
import {
  NotificationsHeader,
  NotificationsTabs,
  NotificationsList,
  type FilterTab,
} from "../";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useAdminNotifications();
  const markRead = useMarkAdminNotificationRead();
  const markAllRead = useMarkAllAdminNotificationsRead();

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === "unread") return !n.read;
      if (activeTab === "orders") {
        return (
          n.type === "ORDER_CREATED" ||
          n.type === "ORDER_SHIPPED" ||
          n.type === "ORDER_CANCELLED"
        );
      }
      if (activeTab === "stock") return n.type === "PRODUCT_LOW_STOCK";
      if (activeTab === "payments") {
        return n.type === "PAYMENT_SUCCESS" || n.type === "PAYMENT_FAILED";
      }
      return true;
    });
  }, [notifications, activeTab]);

  const handleNotificationClick = useCallback(
    (item: AdminNotificationDto) => {
      if (!item.read) {
        markRead.mutate(item.id);
      }
      if (item.href) {
        navigate(item.href);
      }
    },
    [markRead, navigate],
  );

  const handleMarkAllRead = useCallback(() => {
    markAllRead.mutate();
  }, [markAllRead]);

  const handleRefetch = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <NotificationsHeader
        unreadCount={unreadCount}
        isPendingMarkAll={markAllRead.isPending}
        onMarkAllRead={handleMarkAllRead}
      />

      <NotificationsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={unreadCount}
        totalCount={notifications.length}
      />

      <NotificationsList
        notifications={filteredNotifications}
        unreadCount={unreadCount}
        activeTab={activeTab}
        isLoading={isLoading}
        isError={isError}
        onRefetch={handleRefetch}
        onItemClick={handleNotificationClick}
      />
    </div>
  );
}
