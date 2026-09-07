import React from "react";
import { Bell } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
    <Card className="shadow-sm">
      <CardHeader className="border-b border-slate-100 py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Activity inbox</CardTitle>
            <CardDescription>
              {unreadCount > 0
                ? `You have ${unreadCount} unread signal${unreadCount > 1 ? "s" : ""}.`
                : "All caught up! No unread notifications."}
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              {unreadCount} unread
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse items-start gap-4">
                <div className="h-9 w-9 rounded-lg bg-slate-100" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                  <div className="h-3 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="text-sm text-rose-600">Failed to load notifications.</p>
            <button
              type="button"
              onClick={onRefetch}
              className="mt-2 text-xs font-medium text-indigo-600 underline underline-offset-4 hover:text-indigo-800"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Bell className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-900">
              {activeTab === "unread"
                ? "No unread notifications"
                : "No notifications found"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {activeTab === "unread"
                ? "You have marked all notifications as read."
                : "When events occur, they will appear in your activity inbox."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onClick={onItemClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
