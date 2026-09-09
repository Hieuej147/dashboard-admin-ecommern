import { TrendingUp, Package, FileText, Users } from "lucide-react";
import type { CapabilityCardItem } from "../types/ai-workspace.types";

export const CAPABILITY_CARDS: CapabilityCardItem[] = [
  {
    id: "revenue-analysis",
    title: "Sales & Order Analytics",
    badge: "Charts + Live Metrics",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Daily revenue visualization, AOV calculations, and order fulfillment success rates.",
    prompt: "Generate a summary report of recent revenue and order volume as line charts and data grids.",
    icon: TrendingUp,
    accent: "from-blue-500/10 to-indigo-500/5 text-blue-600 border-blue-100",
  },
  {
    id: "inventory-alert",
    title: "Inventory & Restock Alerts",
    badge: "Fulfillment & Stock",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Scans inventory levels, highlights low-stock SKUs, and estimates restock replenishment quantities.",
    prompt: "Check products with inventory below 10 units and create a reorder recommendation list.",
    icon: Package,
    accent: "from-amber-500/10 to-orange-500/5 text-amber-600 border-amber-100",
  },
  {
    id: "seo-copywriter",
    title: "Product Copy & SEO Optimization",
    badge: "Content & Marketing",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Drafts engaging titles, SEO-optimized descriptions, feature bullets, and retail metadata.",
    prompt: "Draft an SEO-optimized product description for a premium fashion item with bullet points and meta tags.",
    icon: FileText,
    accent: "from-purple-500/10 to-violet-500/5 text-purple-600 border-purple-100",
  },
  {
    id: "customer-diagnostic",
    title: "Customer & Retention Diagnostic",
    badge: "Customer Success",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    description: "Root-cause analysis of order cancellations, failed payments, and high-value customer identification.",
    prompt: "Analyze recent cancelled or failed orders and suggest actionable improvements to the shopper experience.",
    icon: Users,
    accent: "from-rose-500/10 to-pink-500/5 text-rose-600 border-rose-100",
  },
];
