import React from "react";
import { Bell, RefreshCw } from "lucide-react";
import type { AdminNotificationDto } from "@/hooks/query-key/query-key";
import { NotificationItem } from "./notification-item";
import type { FilterTab } from "../types/notification.types";

interface NotificationsListProps {
  notifications: AdminNotificationDto[];
  unreadCount: number;
  activeTab: FilterTab;
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
  onItemClick: (item: AdminNotificationDto) => void;
}

export const NotificationsList = React.memo(function NotificationsList({
  notifications,
  unreadCount,
  activeTab,
  isLoading,
  isError,
  onRefetch,
  onItemClick,
}: NotificationsListProps) {
  return (
    <div className="border border-border bg-card shadow-hard-sm font-mono">
      {/* Box Header */}
      <div className="border-b border-border bg-muted/40 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-foreground" />
            SYSTEM EVENT INBOX
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread notifications require review.`
              : "All system notifications and alerts have been processed."}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            [ {unreadCount} UNREAD ]
          </span>
        )}
      </div>

      <div>
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse items-start gap-3.5 border border-border/50 p-3">
                <div className="h-8 w-8 bg-muted" />
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="h-3.5 w-1/3 bg-muted" />
                  <div className="h-3 w-2/3 bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">
              [ COULD NOT LOAD NOTIFICATIONS ]
            </p>
            <button
              type="button"
              onClick={onRefetch}
              className="mt-3 inline-flex items-center gap-1.5 border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              RETRY
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted/30 text-muted-foreground">
              <Bell className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-foreground">
              {activeTab === "unread"
                ? "[ NO UNREAD NOTIFICATIONS ]"
                : "[ NO NOTIFICATIONS FOUND ]"}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {activeTab === "unread"
                ? "All queued notifications in this view have been read."
                : "When operational events are triggered, they will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onClick={onItemClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
