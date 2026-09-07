import React from "react";
import {
  Bell,
  CircleAlert,
  CreditCard,
  Package,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import type { AdminNotificationDto } from "@/hooks/query-key/query-key";

interface NotificationItemProps {
  item: AdminNotificationDto;
  onClick: (item: AdminNotificationDto) => void;
}

function getNotificationVisuals(type: string) {
  switch (type) {
    case "ORDER_CREATED":
    case "ORDER_SHIPPED":
    case "ORDER_CANCELLED":
      return {
        icon: Bell,
        tone: "text-indigo-600 bg-indigo-50",
      };
    case "PAYMENT_SUCCESS":
      return {
        icon: CreditCard,
        tone: "text-emerald-600 bg-emerald-50",
      };
    case "PAYMENT_FAILED":
      return {
        icon: CircleAlert,
        tone: "text-rose-600 bg-rose-50",
      };
    case "PRODUCT_LOW_STOCK":
      return {
        icon: Package,
        tone: "text-amber-600 bg-amber-50",
      };
    case "NEW_CUSTOMER":
      return {
        icon: UserCheck,
        tone: "text-violet-600 bg-violet-50",
      };
    default:
      return {
        icon: ShieldCheck,
        tone: "text-slate-600 bg-slate-100",
      };
  }
}

function formatRelativeTime(dateString: string) {
  const diffMs = Math.max(0, Date.now() - new Date(dateString).getTime());
  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export const NotificationItem = React.memo(function NotificationItem({
  item,
  onClick,
}: NotificationItemProps) {
  const { icon: Icon, tone } = getNotificationVisuals(item.type);

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className={`flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-slate-50 ${
        !item.read ? "bg-indigo-50/25" : ""
      }`}
    >
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span
              className={`text-sm ${
                !item.read
                  ? "font-semibold text-slate-950"
                  : "font-medium text-slate-800"
              }`}
            >
              {item.title}
            </span>
            {!item.read && (
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            )}
          </span>
          <span className="text-xs text-slate-400">
            {formatRelativeTime(item.createdAt)}
          </span>
        </span>

        <span className="mt-1 block text-sm text-slate-600">
          {item.message}
        </span>
      </span>
    </button>
  );
});
