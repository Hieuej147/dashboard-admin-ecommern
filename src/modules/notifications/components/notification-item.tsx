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
        tone: "text-foreground border-border bg-muted/40",
      };
    case "PAYMENT_SUCCESS":
      return {
        icon: CreditCard,
        tone: "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      };
    case "PAYMENT_FAILED":
      return {
        icon: CircleAlert,
        tone: "text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10",
      };
    case "PRODUCT_LOW_STOCK":
      return {
        icon: Package,
        tone: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
      };
    case "NEW_CUSTOMER":
      return {
        icon: UserCheck,
        tone: "text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10",
      };
    default:
      return {
        icon: ShieldCheck,
        tone: "text-muted-foreground border-border bg-muted/20",
      };
  }
}

function formatRelativeTimeEn(dateString: string) {
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
      className={`flex w-full items-start gap-3.5 p-4 text-left transition-colors font-mono cursor-pointer ${
        !item.read
          ? "bg-muted/30 border-l-2 border-l-[#ece945]"
          : "hover:bg-muted/20 border-l-2 border-l-transparent"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center border ${tone}`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span
              className={`text-xs uppercase tracking-wider ${
                !item.read
                  ? "font-bold text-foreground"
                  : "font-medium text-muted-foreground"
              }`}
            >
              {item.title}
            </span>
            {!item.read && (
              <span className="h-1.5 w-1.5 bg-[#ece945]" />
            )}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatRelativeTimeEn(item.createdAt)}
          </span>
        </span>

        <span className="mt-1 block text-xs text-muted-foreground leading-relaxed">
          {item.message}
        </span>
      </span>
    </button>
  );
});
