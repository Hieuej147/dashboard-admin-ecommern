import React from "react";
import { CheckCheck, Loader2, Bell } from "lucide-react";

interface NotificationsHeaderProps {
  unreadCount: number;
  isPendingMarkAll: boolean;
  onMarkAllRead: () => void;
}

export const NotificationsHeader = React.memo(function NotificationsHeader({
  unreadCount,
  isPendingMarkAll,
  onMarkAllRead,
}: NotificationsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 font-mono">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 bg-[#ece945]" />
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-wider uppercase text-foreground">
            NOTIFICATIONS & SYSTEM ALERTS
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Real-time operational event stream across orders, inventory thresholds, and settlement telemetry
        </p>
      </div>

      <div className="flex items-center gap-3">
        {unreadCount > 0 && (
          <span className="border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 shadow-hard-sm">
            <Bell className="h-3 w-3" />
            [ {unreadCount} UNREAD ]
          </span>
        )}

        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0 || isPendingMarkAll}
          className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground shadow-hard-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          {isPendingMarkAll ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCheck className="h-3.5 w-3.5 text-[#ece945]" />
          )}
          MARK ALL AS READ
        </button>
      </div>
    </div>
  );
});
