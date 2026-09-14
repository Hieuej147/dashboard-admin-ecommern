import React, { useEffect, useState } from "react";
import { Bell, ChevronRight, Menu, Moon, Sun } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/lib/store/store";
import { toggleSidebar } from "@/lib/store/slices/dashboard-ui.slice";
import { useAdminUnreadNotificationsCount } from "@/hooks/use-notifications";
import { SystemHealthBadge } from "./system-health-badge";

const ROUTE_TITLES: Record<string, string> = {
  "/": "01. Overview",
  "/products": "02. Products & Inventory",
  "/orders": "03. Order Management",
  "/customers": "04. Customers",
  "/payments": "05. Payments",
  "/notifications": "06. Notifications",
  "/ai-workspace": "07. AI Copilot Studio",
  "/settings": "08. System Settings",
};

export const Header = React.memo(function Header() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { data: unreadData } = useAdminUnreadNotificationsCount();
  const unreadCount = unreadData?.unreadCount ?? 0;

  const [timeStr, setTimeStr] = useState("");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark"
    );
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(" ")[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const currentTitle =
    ROUTE_TITLES[location.pathname] ||
    location.pathname
      .slice(1)
      .replaceAll("-", " ")
      .replace(/(^|\s)\S/g, (l) => l.toUpperCase());

  return (
    <header className="sticky top-0 z-20 h-16 shrink-0 border-b border-border bg-card/95 backdrop-blur font-mono select-none">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: Sidebar Toggle & Breadcrumb */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Toggle navigation sidebar"
            onClick={() => dispatch(toggleSidebar())}
            className="border border-border p-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Link to="/" className="hover:text-foreground font-semibold">
              SYSTEM
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="font-bold text-foreground">
              {currentTitle}
            </span>
          </div>
        </div>

        {/* Right: Clock, Health, Theme, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs border border-border bg-muted/40 text-muted-foreground">
            <span className="h-1.5 w-1.5 bg-[#ece945] inline-block" />
            <span>{timeStr || "00:00:00"} LOC</span>
          </div>

          {/* Gateway Status Badge */}
          <SystemHealthBadge />

          {/* Dark/Light Toggle */}
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            aria-label="Toggle theme"
            className="border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <Link
            to="/notifications"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            className="relative border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center bg-[#ece945] text-black text-[9px] font-bold px-1 border border-black dark:border-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Clerk Profile */}
          <div className="pl-1 border-l border-border">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "w-8 h-8 rounded-none border border-border shadow-none",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = "Header";

