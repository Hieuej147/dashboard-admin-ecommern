import {
  useRenderTool,
  useDefaultRenderTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import {
  Loader2,
  CheckCircle2,
  PackageSearch,
  Receipt,
  Users,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Hook to register dynamic UI renderers for Backend Microservice Tool calls
 * executed by the Python LangGraph Agent. Displays real-time progress cards
 * and concise summary badges directly inside CopilotChat.
 */
export function useBackendToolRenderers() {
  // 1. Renderer for get_business_metrics
  useRenderTool({
    name: "get_business_metrics",
    parameters: z.object({}),
    render: ({ status, result }) => {
      if (status === "inProgress" || status === "executing") {
        return (
          <div className="my-2 flex items-center gap-2.5 rounded-xl border border-blue-200/80 bg-blue-50/60 p-2.5 text-xs text-blue-900 shadow-2xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shrink-0">
              <BarChart3 className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-blue-900">
                Aggregating business metrics...
              </span>
              <p className="text-[10px] text-blue-700/80 mt-0.5 truncate">
                Querying data from Payments, Orders & Catalog
              </p>
            </div>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 shrink-0" />
          </div>
        );
      }

      const data = result as {
        summary?: {
          totalRevenue?: number;
          currency?: string;
          totalOrders?: number;
          paymentSuccessRate?: number;
        };
      };
      const summary = data?.summary;

      return (
        <div className="my-2 rounded-xl border border-emerald-200/90 bg-emerald-50/50 p-2.5 text-xs text-emerald-950 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              Business metrics loaded
            </span>
            <Badge
              variant="outline"
              className="border-emerald-300/80 text-emerald-700 bg-white text-[10px]"
            >
              Overview Metrics
            </Badge>
          </div>
          {summary && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-emerald-200/60">
              <div>
                <span className="text-slate-500">Revenue: </span>
                <span className="font-semibold text-slate-900">
                  {new Intl.NumberFormat("vi-VN").format(summary.totalRevenue || 0)}{" "}
                  {summary.currency || "VND"}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Orders: </span>
                <span className="font-semibold text-slate-900">
                  {summary.totalOrders || 0} orders
                </span>
              </div>
            </div>
          )}
        </div>
      );
    },
  });

  // 2. Renderer for query_catalog_products
  useRenderTool({
    name: "query_catalog_products",
    parameters: z.object({
      search: z.string().optional(),
      category_slug: z.string().optional(),
      low_stock_only: z.boolean().optional(),
      page_size: z.number().optional(),
    }),
    render: ({ status, parameters, result }) => {
      if (status === "inProgress" || status === "executing") {
        return (
          <div className="my-2 flex items-center gap-2.5 rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-2.5 text-xs text-indigo-900 shadow-2xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 shrink-0">
              <PackageSearch className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-indigo-900">
                Querying product inventory...
              </span>
              {parameters?.search && (
                <p className="text-[10px] text-indigo-700/80 mt-0.5 truncate">
                  Keyword: "{parameters.search}"
                </p>
              )}
            </div>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600 shrink-0" />
          </div>
        );
      }

      const data = result as { count?: number; products?: unknown[] };
      const count = data?.count ?? (data?.products?.length || 0);

      return (
        <div className="my-2 rounded-xl border border-indigo-200/90 bg-indigo-50/40 p-2.5 text-xs text-indigo-950 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-indigo-900">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
              Found {count} matching products
            </span>
            <Badge
              variant="outline"
              className="border-indigo-300/80 text-indigo-700 bg-white text-[10px]"
            >
              Catalog Service
            </Badge>
          </div>
        </div>
      );
    },
  });

  // 3. Renderer for query_order_records
  useRenderTool({
    name: "query_order_records",
    parameters: z.object({
      status: z.string().optional(),
      search: z.string().optional(),
      page_size: z.number().optional(),
    }),
    render: ({ status, parameters, result }) => {
      if (status === "inProgress" || status === "executing") {
        return (
          <div className="my-2 flex items-center gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/60 p-2.5 text-xs text-amber-900 shadow-2xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 shrink-0">
              <Receipt className="h-4 w-4 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-amber-900">
                Querying order list...
              </span>
              {parameters?.status && (
                <p className="text-[10px] text-amber-700/80 mt-0.5 truncate">
                  Status: {parameters.status}
                </p>
              )}
            </div>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-600 shrink-0" />
          </div>
        );
      }

      const data = result as { count?: number; orders?: unknown[] };
      const count = data?.count ?? (data?.orders?.length || 0);

      return (
        <div className="my-2 rounded-xl border border-amber-200/90 bg-amber-50/40 p-2.5 text-xs text-amber-950 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-amber-900">
              <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
              Loaded {count} orders
            </span>
            <Badge
              variant="outline"
              className="border-amber-300/80 text-amber-700 bg-white text-[10px]"
            >
              Orders Service
            </Badge>
          </div>
        </div>
      );
    },
  });

  // 4. Renderer for query_customers
  useRenderTool({
    name: "query_customers",
    parameters: z.object({
      search: z.string().optional(),
      role: z.string().optional(),
      status: z.string().optional(),
      page_size: z.number().optional(),
    }),
    render: ({ status, result }) => {
      if (status === "inProgress" || status === "executing") {
        return (
          <div className="my-2 flex items-center gap-2.5 rounded-xl border border-purple-200/80 bg-purple-50/60 p-2.5 text-xs text-purple-900 shadow-2xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-600 shrink-0">
              <Users className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-purple-900">
                Querying customer directory...
              </span>
            </div>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-600 shrink-0" />
          </div>
        );
      }

      const data = result as { count?: number; customers?: unknown[] };
      const count = data?.count ?? (data?.customers?.length || 0);

      return (
        <div className="my-2 rounded-xl border border-purple-200/90 bg-purple-50/40 p-2.5 text-xs text-purple-950 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-purple-900">
              <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
              Loaded {count} user profiles
            </span>
            <Badge
              variant="outline"
              className="border-purple-300/80 text-purple-700 bg-white text-[10px]"
            >
              Users Service
            </Badge>
          </div>
        </div>
      );
    },
  });

  // 5. Wildcard fallback for any other tools
  useDefaultRenderTool({
    render: ({ name, status }) => {
      // Don't render internal A2UI generator as an ugly raw tool
      if (name === "generate_a2ui") return <></>;

      if (status === "inProgress" || status === "executing") {
        return (
          <div className="my-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 shrink-0" />
            <span>
              Executing action: <strong>{name}</strong>...
            </span>
          </div>
        );
      }

      return (
        <div className="my-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
          <span>
            Completed <strong>{name}</strong>
          </span>
        </div>
      );
    },
  });
}
