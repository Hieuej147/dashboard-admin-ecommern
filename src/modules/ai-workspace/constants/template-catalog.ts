import type { TemplateCategoryItem } from "../types/ai-workspace.types";

export const TEMPLATE_CATEGORIES: TemplateCategoryItem[] = [
  {
    category: "Sales & Operations",
    items: [
      {
        title: "Create Weekend Flash Sale Campaign",
        prompt: "Plan a 48-hour weekend Flash Sale campaign: suggest category discount rates, qualification rules, and promotional copy.",
      },
      {
        title: "Abandoned Cart Diagnostic",
        prompt: "Analyze frequently abandoned items in customer shopping carts and suggest targeted remarketing email sequences.",
      },
      {
        title: "Monthly Revenue Forecast",
        prompt: "Based on recent sales velocity and performance data, forecast revenue trends for next month and highlight high-potential categories.",
      },
    ],
  },
  {
    category: "Catalog & Inventory Optimization",
    items: [
      {
        title: "Cross-Sell Bundle Recommendations",
        prompt: "Propose 3 effective product bundling combos based on existing catalog inventory to increase Average Order Value (AOV).",
      },
      {
        title: "Dead Stock Clearance Strategy",
        prompt: "Identify slow-moving inventory over the past 60 days and recommend clearance promotions or gift-with-purchase strategies.",
      },
    ],
  },
  {
    category: "Customer Support & Retention",
    items: [
      {
        title: "Delayed Shipping Resolution Script",
        prompt: "Draft a support response template for carrier shipment delays, including empathetic apologies and compensation voucher codes.",
      },
      {
        title: "Transparent Return & Warranty Policy",
        prompt: "Draft a consumer-friendly 7-day return policy and straightforward warranty fulfillment workflow.",
      },
    ],
  },
];
