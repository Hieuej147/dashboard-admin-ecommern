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
    <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3 font-mono">
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
            className={`inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer ${
              isActive
                ? "bg-primary text-primary-foreground shadow-hard-sm"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`text-[10px] font-bold ${
                  isActive
                    ? "text-[#ece945]"
                    : "text-muted-foreground"
                }`}
              >
                [{count}]
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});
