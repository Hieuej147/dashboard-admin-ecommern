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
      label: "Workspace",
      items: [
        { name: "Overview", path: "/", icon: LayoutDashboard },
        { name: "AI Workspace", path: "/ai-workspace", icon: Bot },
        {
          name: "Notifications",
          path: "/notifications",
          icon: Bell,
          badge: unreadCount > 0 ? (unreadCount > 99 ? "99+" : unreadCount) : undefined,
        },
      ],
    },
    {
      label: "Commerce",
      items: [
        { name: "Products", path: "/products", icon: Package },
        { name: "Orders", path: "/orders", icon: ShoppingCart },
        { name: "Payments", path: "/payments", icon: CreditCard },
        { name: "Customers", path: "/customers", icon: Users },
      ],
    },
  ], [unreadCount]);

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-slate-200 bg-white will-change-[width] transition-[width] duration-200 md:flex ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <div
        className={`flex h-16 items-center border-b border-slate-200 ${
          collapsed ? "justify-center px-3" : "px-6"
        }`}
      >
        <Link to="/" className="flex items-center gap-3 text-slate-950">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
            TL
          </span>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight">
              Tendollama <span className="font-normal text-slate-400">Admin</span>
            </span>
          )}
        </Link>
      </div>
      <div className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
        {navGroups.map((group) => (

          <section key={group.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.name : undefined}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? "text-indigo-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    {!collapsed && <span className="flex-1">{item.name}</span>}
                    {!collapsed && item.badge && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
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
      <div className="border-t border-slate-200 p-3">
        <Link
          to="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Settings className="h-4 w-4 text-slate-400" />
          {!collapsed && "Settings"}
        </Link>
      </div>
    </aside>
  );
});

