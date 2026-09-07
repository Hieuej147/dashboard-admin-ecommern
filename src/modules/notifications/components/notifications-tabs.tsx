import React from "react";
import {
  NOTIFICATION_TABS,
  type FilterTab,
} from "../types/notification.types";

interface NotificationsTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  unreadCount: number;
  totalCount: number;
}

export const NotificationsTabs = React.memo(function NotificationsTabs({
  activeTab,
  onTabChange,
  unreadCount,
  totalCount,
}: NotificationsTabsProps) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-2">
      {NOTIFICATION_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count =
          tab.id === "unread"
            ? unreadCount
            : tab.id === "all"
              ? totalCount
              : undefined;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              isActive
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab.label}
            {count !== undefined && count > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});
