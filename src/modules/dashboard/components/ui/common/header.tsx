import React from "react";
import { Bell, ChevronRight, Menu } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/lib/store/store";
import { toggleSidebar } from "@/lib/store/slices/dashboard-ui.slice";
import { useAdminUnreadNotificationsCount } from "@/hooks/use-notifications";
import { SystemHealthBadge } from "./system-health-badge";

export const Header = React.memo(function Header() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { data: unreadData } = useAdminUnreadNotificationsCount();
  const unreadCount = unreadData?.unreadCount ?? 0;

  const pageName =
    location.pathname === "/"
      ? "Overview"
      : location.pathname
          .slice(1)
          .replaceAll("-", " ")
          .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={() => dispatch(toggleSidebar())}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
            <Link to="/" className="hover:text-slate-700">
              Workspace
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium capitalize text-slate-900">
              {pageName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Health Status */}
          <SystemHealthBadge />

          {/* Notifications */}
          <Link
            to="/notifications"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </Link>


          {/* User Profile */}
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-8 h-8 rounded-full border border-slate-200 shadow-sm",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
});

