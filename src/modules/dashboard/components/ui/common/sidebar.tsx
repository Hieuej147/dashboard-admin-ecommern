import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Bot, CreditCard, LayoutDashboard, Package, Settings, ShoppingCart, Users } from "lucide-react";
import { useAppSelector } from "@/lib/store/store";
import { useAdminUnreadNotificationsCount } from "@/hooks/use-notifications";

export const Sidebar = React.memo(function Sidebar() {
  const location = useLocation();
  const collapsed = useAppSelector((state) => state.dashboardUi.sidebarCollapsed);
  const { data: unreadData } = useAdminUnreadNotificationsCount();
  const unreadCount = unreadData?.unreadCount ?? 0;

  const navGroups = useMemo(() => [
    {
      label: "WORKSPACE",
      items: [
        { name: "01. Overview", path: "/", icon: LayoutDashboard },
        { name: "02. AI Copilot", path: "/ai-workspace", icon: Bot },
        {
          name: "03. Notifications",
          path: "/notifications",
          icon: Bell,
          badge: unreadCount > 0 ? (unreadCount > 99 ? "99+" : String(unreadCount)) : undefined,
        },
      ],
    },
    {
      label: "OPERATIONS",
      items: [
        { name: "04. Products & Stock", path: "/products", icon: Package },
        { name: "05. Orders", path: "/orders", icon: ShoppingCart },
        { name: "06. Payments", path: "/payments", icon: CreditCard },
        { name: "07. Customers", path: "/customers", icon: Users },
      ],
    },
  ], [unreadCount]);

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-border bg-card text-card-foreground will-change-[width] transition-[width] duration-200 md:flex select-none ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div
        className={`flex h-16 items-center border-b border-border ${
          collapsed ? "justify-center px-3" : "px-5"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center bg-[#ece945] text-black font-mono font-bold text-xs border border-black dark:border-white shadow-hard-sm">
            FP
          </span>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-heading text-sm font-bold tracking-wider uppercase text-foreground leading-tight">
                FIELD PROTOCOL
              </span>
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest leading-tight">
                OPERATIONAL OS
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 space-y-6 overflow-y-auto px-2 py-4">
        {navGroups.map((group) => (
          <section key={group.label} className="space-y-1">
            {!collapsed && (
              <p className="px-3 pb-1 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.name : undefined}
                    className={`group flex items-center gap-3 py-2.5 text-xs font-mono transition-colors ${
                      collapsed ? "justify-center px-2" : "px-3"
                    } ${
                      isActive
                        ? "bg-black/5 dark:bg-white/10 text-foreground font-bold border-l-[3px] border-[#ece945]"
                        : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground border-l-[3px] border-transparent"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                    {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                    {!collapsed && item.badge && (
                      <span className="bg-[#ece945] text-black px-1.5 py-0.2 text-[9px] font-mono font-bold border border-black/20">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Footer / Settings & Status */}
      <div className="border-t border-border p-2 space-y-2">
        <Link
          to="/settings"
          title={collapsed ? "08. Settings" : undefined}
          className={`group flex items-center gap-3 py-2 text-xs font-mono transition-colors ${
            collapsed ? "justify-center px-2" : "px-3"
          } ${
            location.pathname === "/settings"
              ? "bg-black/5 dark:bg-white/10 text-foreground font-bold border-l-[3px] border-[#ece945]"
              : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground border-l-[3px] border-transparent"
          }`}
        >
          <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
          {!collapsed && <span>08. Settings</span>}
        </Link>

        {!collapsed && (
          <div className="px-3 pt-2 border-t border-border/50 text-[9px] font-mono text-muted-foreground flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-500 inline-block animate-pulse" />
              <span>STORAGE: ACTIVE</span>
            </span>
            <span>V2.4.0</span>
          </div>
        )}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

