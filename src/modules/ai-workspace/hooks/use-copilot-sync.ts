import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAgentContext,
  useFrontendTool,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { useAppSelector } from "@/lib/store/store";
import { useBackendToolRenderers } from "./use-backend-tool-renderers";

export function useCopilotSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeDashboardId = useAppSelector(
    (state) => state.dashboardUi.activeDashboardId
  );

  // 0. Register real-time tool progress card renderers for backend tools
  useBackendToolRenderers();

  // 1. Context Awareness: Share current admin screen & state with the agent
  const contextValue = useMemo(() => {
    const path = location.pathname;
    let pageName = "Dashboard Overview";
    if (path.startsWith("/products")) pageName = "Product Management";
    else if (path.startsWith("/orders")) pageName = "Order Management";
    else if (path.startsWith("/customers")) pageName = "Customer Management";
    else if (path.startsWith("/ai-workspace")) pageName = "AI Workspace Studio";
    else if (path.startsWith("/analytics")) pageName = "Analytics Reports";

    return {
      currentPath: path,
      pageName,
      activeDashboardId: activeDashboardId || null,
      timestamp: new Date().toISOString(),
    };
  }, [location.pathname, activeDashboardId]);

  useAgentContext({
    description: "Current Admin Navigation & Page Context",
    value: contextValue,
  });

  // 2. Client-Side Tools: Allow agent to navigate and control the UI
  useFrontendTool(
    {
      name: "navigateToPage",
      description:
        "Navigate admin to a specific page in the system (/products, /orders, /customers, /ai-workspace, /)",
      parameters: z.object({
        path: z
          .string()
          .describe(
            "Target URL path, e.g.: '/products', '/orders', '/customers', '/ai-workspace'"
          ),
      }),
      handler: async ({ path }) => {
        navigate(path);
        return `Successfully navigated user to page: ${path}`;
      },
    },
    [navigate]
  );

  useFrontendTool(
    {
      name: "openInStudio",
      description:
        "Open AI Workspace Studio in full screen to display detailed metrics or charts on Canvas",
      parameters: z.object({}),
      handler: async () => {
        navigate("/ai-workspace");
        return "Successfully opened AI Workspace Studio.";
      },
    },
    [navigate]
  );

  // 3. Dynamic Suggestions Hook: Contextual suggestion chips based on active page
  const suggestionsConfig = useMemo(() => {
    const path = location.pathname;

    if (path.startsWith("/products")) {
      return {
        suggestions: [
          {
            title: "Inventory Alert",
            message: "Check for products with stock levels below safe threshold (<= 20 units).",
          },
          {
            title: "Best Selling Products",
            message: "List top performing products and current estimated sales.",
          },
          {
            title: "Filter Outerwear",
            message: "Display products in the outerwear category as a catalog.",
          },
        ],
        available: "always" as const,
      };
    }

    if (path.startsWith("/orders")) {
      return {
        suggestions: [
          {
            title: "Pending Payment Orders",
            message: "Find orders currently in PENDING_PAYMENT status requiring customer reminders.",
          },
          {
            title: "Failed or Cancelled Orders",
            message: "How many orders have failed payments or were recently cancelled?",
          },
          {
            title: "Revenue & Order Count",
            message: "Summarize total actual revenue and total order count in the system.",
          },
        ],
        available: "always" as const,
      };
    }

    if (path.startsWith("/customers")) {
      return {
        suggestions: [
          {
            title: "New Customer Registrations",
            message: "List recently registered customer accounts.",
          },
          {
            title: "User Role Breakdown",
            message: "Break down users by admin and customer roles in the system.",
          },
        ],
        available: "always" as const,
      };
    }

    // Default / AI Workspace suggestions
    return {
      suggestions: [
        {
          title: "Revenue Report",
          message: "Analyze total revenue, order count, and average order value (AOV).",
        },
        {
          title: "Inventory Alert",
          message: "Check for low-stock items and plan restocking needs.",
        },
        {
          title: "Payment Health",
          message: "Evaluate payment success rate and inspect failing transactions.",
        },
        {
          title: "Generate A2UI Dashboard",
          message: "Create a Canvas Dashboard aggregating KPIs, revenue charts, and recent orders.",
        },
      ],
      available: "always" as const,
    };
  }, [location.pathname]);

  useConfigureSuggestions(suggestionsConfig, [location.pathname]);

  return {
    contextValue,
  };
}
