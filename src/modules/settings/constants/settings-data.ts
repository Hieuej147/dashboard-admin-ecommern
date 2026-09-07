import { Bell, Bot, KeyRound, Palette, type LucideIcon } from "lucide-react";

export interface SettingItem {
  title: string;
  description: string;
  icon: LucideIcon;
  value: string;
}

export const SETTINGS_ITEMS: SettingItem[] = [
  {
    title: "Appearance",
    description: "Tune the workspace theme and density.",
    icon: Palette,
    value: "System default",
  },
  {
    title: "Notifications",
    description: "Choose which commerce signals reach you.",
    icon: Bell,
    value: "All activity",
  },
  {
    title: "AI assistant",
    description: "Configure the way Commerce Copilot helps.",
    icon: Bot,
    value: "Connected",
  },
  {
    title: "API access",
    description: "Gateway connection and authentication status.",
    icon: KeyRound,
    value: "Ready for integration",
  },
];
