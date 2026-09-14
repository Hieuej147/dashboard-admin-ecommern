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
import { toast } from "@/components/ui/toast";

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
    markAllRead.mutate(undefined, {
      onSuccess: () => {
        toast.success("[ NOTIFICATIONS CLEARED ] All event alerts marked as read");
      },
      onError: (err) => {
        toast.error(`[ ACTION FAILED ] ${err instanceof Error ? err.message : "Failed to mark notifications read"}`);
      },
    });
  }, [markAllRead]);

  const handleRefetch = useCallback(() => {
    void refetch().then((res) => {
      if (res.isSuccess) {
        toast.info("[ INBOX REFRESHED ] Notification event stream updated");
      }
    });
  }, [refetch]);

  return (
    <div className="flex flex-col gap-6 font-mono">
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
