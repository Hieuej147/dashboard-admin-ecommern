export type FilterTab = "all" | "unread" | "orders" | "stock" | "payments";

export interface TabConfig {
  id: FilterTab;
  label: string;
}

export const NOTIFICATION_TABS: TabConfig[] = [
  { id: "all", label: "ALL" },
  { id: "unread", label: "UNREAD" },
  { id: "orders", label: "ORDERS" },
  { id: "stock", label: "INVENTORY" },
  { id: "payments", label: "PAYMENTS" },
];
