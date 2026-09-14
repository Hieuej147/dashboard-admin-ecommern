import { Bell, Bot, KeyRound, Palette, Database, type LucideIcon } from "lucide-react";

export interface SettingItem {
  title: string;
  description: string;
  icon: LucideIcon;
  value: string;
}

export const SETTINGS_ITEMS: SettingItem[] = [
  {
    title: "Display & Appearance",
    description: "Configure light/dark themes, tactical contrast, and UI display density.",
    icon: Palette,
    value: "System Default Theme",
  },
  {
    title: "Notifications & Alerts",
    description: "Manage event stream triggers from orders, inventory levels, and settlement.",
    icon: Bell,
    value: "All Active Alerts Enabled",
  },
  {
    title: "Executive AI Copilot",
    description: "Configure language model parameters, LangGraph tools, and AI canvas.",
    icon: Bot,
    value: "Online & Operational",
  },
  {
    title: "MinIO S3 Object Storage",
    description: "Product media storage cluster operating via binary presigned URLs.",
    icon: Database,
    value: "Port 9002 - Bucket: products",
  },
  {
    title: "API Access & Gateway",
    description: "Reverse proxy routing and Clerk JWT authorization gateway.",
    icon: KeyRound,
    value: "Port 8080 - Validated Session",
  },
];
