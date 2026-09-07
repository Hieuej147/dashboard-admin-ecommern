import type { LucideIcon } from "lucide-react";

export interface AiThread {
  id: string;
  agentId: string;
  name: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
}

export interface ThreadListResponse {
  threads: AiThread[];
  nextCursor?: string;
}

export interface CreateThreadInput {
  agentId?: string;
  threadId?: string;
  title?: string;
}

export interface RenameThreadInput {
  threadId: string;
  title: string;
}

export interface QuickPromptItem {
  label: string;
  prompt: string;
  icon: LucideIcon;
}

export interface CapabilityCardItem {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
  accent: string;
}

export interface TemplateItem {
  title: string;
  prompt: string;
}

export interface TemplateCategoryItem {
  category: string;
  items: TemplateItem[];
}

export type AiWorkspaceTab = "canvas" | "templates" | "context";
