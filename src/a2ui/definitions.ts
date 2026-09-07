import { z } from "zod";

export const dashboardDefinitions = {
  DashboardCanvas: {
    description: "The root container for a dynamic dashboard. ALWAYS use this to wrap your dashboard layout. The UI will project its child onto the main dashboard page.",
    props: z.object({
      title: z.string().describe("Title of the dashboard report"),
      children: z.array(z.string()).optional().describe("The IDs of the child components (usually a Column or Row)."),
    }),
  },

  Row: {
    description: "Horizontal layout container. Children share the width evenly. Use `gap` (px) to space dashboard tiles.",
    props: z.object({
      gap: z.number().optional(),
      align: z.enum(["start", "center", "end", "stretch", "baseline"]).optional(),
      justify: z.enum(["start", "center", "end", "spaceBetween"]).optional(),
      children: z.array(z.string()),
    }),
  },

  Column: {
    description: "Vertical layout container. Use `gap` (px) to space stacked sections.",
    props: z.object({
      gap: z.number().optional(),
      align: z.enum(["start", "center", "end", "stretch", "baseline"]).optional(),
      children: z.array(z.string()),
    }),
  },

  Metric: {
    description: "A key/value KPI tile with an optional trend indicator and trend delta. Ideal for dashboard KPI rows.",
    props: z.object({
      label: z.string(),
      value: z.string(),
      trend: z.enum(["up", "down", "neutral"]).optional(),
      trendValue: z.string().optional(),
    }),
  },

  Badge: {
    description: "A small coloured pill communicating the state. Choose `variant` to match the intent.",
    props: z.object({
      text: z.string(),
      variant: z.enum(["success", "warning", "error", "info"]).optional(),
    }),
  },

  InfoRow: {
    description: "A compact two-column 'label: value' row.",
    props: z.object({
      label: z.string(),
      value: z.string(),
    }),
  },

  Card: {
    description: "A titled card container with an optional subtitle and child components.",
    props: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      children: z.array(z.string()).optional(),
    }),
  },

  LineChart: {
    description: "A line chart showing trends over time (e.g., revenue over the last 12 months).",
    props: z.object({
      title: z.string().describe("Chart title"),
      xAxisKey: z.string().describe("The key in the data object to use for the X-axis (e.g., 'month')"),
      lines: z.array(z.object({
        dataKey: z.string().describe("The key in the data object to plot on the Y-axis"),
        color: z.string().optional().describe("CSS color for the line"),
        name: z.string().optional().describe("Legend name for the line")
      })).describe("Configuration for each line to draw"),
      data: z.array(z.any()).describe("The array of data points for the chart"),
    }),
  },

  PieChart: {
    description: "A pie/donut chart with a brand-coloured legend. Great for part-of-whole breakdowns.",
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      data: z.array(z.any()), // Lenient
    }),
  },

  BarChart: {
    description: "A vertical bar chart. Great for comparing series across categories or time.",
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      data: z.array(z.any()), // Lenient
    }),
  },

  DataTable: {
    description: "A data table with column headers and rows.",
    props: z.object({
      columns: z.array(z.object({ key: z.string(), label: z.string() })),
      data: z.array(z.any()), // Use 'data' instead of 'rows' to align with other components
    }),
  },

  Button: {
    description: "A clickable button that can dispatch an action. ALWAYS use 'text' for the button label.",
    props: z.object({
      text: z.string(),
      action: z.any().describe("The action object to trigger. Must follow the action format."),
    }),
  },

  CatalogLayout: {
    description: "A flexible layout for displaying a catalog of items (like products or users). Supports grid and list views automatically.",
    props: z.object({
      title: z.string().optional(),
      layoutType: z.enum(["grid", "list"]).default("grid"),
      items: z.array(z.object({
        id: z.string(),
        title: z.string(),
        subtitle: z.string().optional(),
        imageUrl: z.string().optional(),
        price: z.string().optional(),
        badgeText: z.string().optional(),
        badgeVariant: z.enum(["success", "warning", "error", "info"]).optional(),
      })).describe("The items to display in the catalog."),
    }),
  }
};
