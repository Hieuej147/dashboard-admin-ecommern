export type FilterTab = "all" | "unread" | "orders" | "stock" | "payments";

export interface TabConfig {
  id: FilterTab;
  label: string;
}

export const NOTIFICATION_TABS: TabConfig[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "orders", label: "Orders" },
  { id: "stock", label: "Stock & Inventory" },
  { id: "payments", label: "Payments" },
];
