import React from "react";
import { CheckCheck, Loader2 } from "lucide-react";

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-500">
          Workspace
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Realtime activity and alerts from orders, stock levels, and payments.
        </p>
      </div>

      <button
        type="button"
        onClick={onMarkAllRead}
        disabled={unreadCount === 0 || isPendingMarkAll}
        className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
      >
        {isPendingMarkAll ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCheck className="h-3.5 w-3.5 text-indigo-600" />
        )}
        Mark all as read
      </button>
    </div>
  );
});
