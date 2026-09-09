import { TrendingUp, AlertTriangle, Wand2, BarChart3 } from "lucide-react";
import type { QuickPromptItem } from "../types/ai-workspace.types";

export const QUICK_PROMPT_CHIPS: QuickPromptItem[] = [
  {
    label: "Weekly Revenue Report",
    prompt: "Generate a summary report of revenue and order volume for the past week with visual charts and metrics.",
    icon: TrendingUp,
  },
  {
    label: "Low Stock Alert",
    prompt: "Check products with inventory below 10 units and create a reorder recommendation list.",
    icon: AlertTriangle,
  },
  {
    label: "Draft Product SEO",
    prompt: "Draft an SEO-optimized product description for a premium fashion item with bullet points and meta tags.",
    icon: Wand2,
  },
  {
    label: "Cancellation Analysis",
    prompt: "Analyze recent cancelled or failed payment orders and suggest actionable mitigation steps.",
    icon: BarChart3,
  },
];
