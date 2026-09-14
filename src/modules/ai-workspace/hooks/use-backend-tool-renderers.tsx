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
          <div className="my-2 flex items-center gap-2.5 rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#13161a] p-2.5 text-xs text-foreground dark:text-zinc-200 shadow-hard-sm font-mono">
            <div className="flex h-7 w-7 items-center justify-center border border-border dark:border-white/10 bg-muted/40 dark:bg-[#181b20] text-foreground shrink-0">
              <BarChart3 className="h-4 w-4 text-[#ece945] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-foreground dark:text-zinc-100">
                Synthesizing commercial telemetry...
              </span>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                Querying settlements, order records, and catalog thresholds
              </p>
            </div>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground shrink-0" />
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
        <div className="my-2 rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#13161a] p-2.5 text-xs text-foreground dark:text-zinc-200 shadow-hard-sm font-mono">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-foreground dark:text-zinc-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              Commercial Metrics Telemetry Loaded
            </span>
            <Badge
              variant="outline"
              className="border-border dark:border-white/10 text-foreground dark:text-zinc-200 bg-muted/40 dark:bg-[#181b20] text-[10px] rounded-none font-bold"
            >
              [ OVERVIEW ]
            </Badge>
          </div>
          {summary && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-border dark:border-white/10">
              <div>
                <span className="text-muted-foreground">Revenue: </span>
                <span className="font-bold text-foreground dark:text-[#ece945]">
                  {new Intl.NumberFormat("en-US").format(summary.totalRevenue || 0)}{" "}
                  {summary.currency || "VND"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Orders: </span>
                <span className="font-bold text-foreground dark:text-zinc-100">
                  {summary.totalOrders || 0} units
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
          <div className="my-2 flex items-center gap-2.5 rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#13161a] p-2.5 text-xs text-foreground dark:text-zinc-200 shadow-hard-sm font-mono">
            <div className="flex h-7 w-7 items-center justify-center border border-border dark:border-white/10 bg-muted/40 dark:bg-[#181b20] text-foreground shrink-0">
              <PackageSearch className="h-4 w-4 text-[#ece945] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-foreground dark:text-zinc-100">
                Querying catalog inventory status...
              </span>
              {parameters?.search && (
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  Keyword: "{parameters.search}"
                </p>
              )}
            </div>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground shrink-0" />
          </div>
        );
      }

      const data = result as { count?: number; products?: unknown[] };
      const count = data?.count ?? (data?.products?.length || 0);

      return (
        <div className="my-2 rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#13161a] p-2.5 text-xs text-foreground dark:text-zinc-200 shadow-hard-sm font-mono">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-foreground dark:text-zinc-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              Retrieved {count} catalog items
            </span>
            <Badge
              variant="outline"
              className="border-border dark:border-white/10 text-foreground dark:text-zinc-200 bg-muted/40 dark:bg-[#181b20] text-[10px] rounded-none font-bold"
            >
              [ CATALOG ]
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
          <div className="my-2 flex items-center gap-2.5 rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#13161a] p-2.5 text-xs text-foreground dark:text-zinc-200 shadow-hard-sm font-mono">
            <div className="flex h-7 w-7 items-center justify-center border border-border dark:border-white/10 bg-muted/40 dark:bg-[#181b20] text-foreground shrink-0">
              <Receipt className="h-4 w-4 text-[#ece945] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-foreground dark:text-zinc-100">
                Querying order lifecycle dossiers...
              </span>
              {parameters?.status && (
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  Status filter: {parameters.status}
                </p>
              )}
            </div>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground shrink-0" />
          </div>
        );
      }

      const data = result as { count?: number; orders?: unknown[] };
      const count = data?.count ?? (data?.orders?.length || 0);

      return (
        <div className="my-2 rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#13161a] p-2.5 text-xs text-foreground dark:text-zinc-200 shadow-hard-sm font-mono">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-foreground dark:text-zinc-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              Retrieved {count} order dossiers
            </span>
            <Badge
              variant="outline"
              className="border-border dark:border-white/10 text-foreground dark:text-zinc-200 bg-muted/40 dark:bg-[#181b20] text-[10px] rounded-none font-bold"
            >
              [ ORDERS ]
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
          <div className="my-2 flex items-center gap-2.5 rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#13161a] p-2.5 text-xs text-foreground dark:text-zinc-200 shadow-hard-sm font-mono">
            <div className="flex h-7 w-7 items-center justify-center border border-border dark:border-white/10 bg-muted/40 dark:bg-[#181b20] text-foreground shrink-0">
              <Users className="h-4 w-4 text-[#ece945] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-foreground dark:text-zinc-100">
                Querying customer registry...
              </span>
            </div>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground shrink-0" />
          </div>
        );
      }

      const data = result as { count?: number; customers?: unknown[] };
      const count = data?.count ?? (data?.customers?.length || 0);

      return (
        <div className="my-2 rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#13161a] p-2.5 text-xs text-foreground dark:text-zinc-200 shadow-hard-sm font-mono">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-foreground dark:text-zinc-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              Retrieved {count} customer profiles
            </span>
            <Badge
              variant="outline"
              className="border-border dark:border-white/10 text-foreground dark:text-zinc-200 bg-muted/40 dark:bg-[#181b20] text-[10px] rounded-none font-bold"
            >
              [ CUSTOMERS ]
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
          <div className="my-2 flex items-center gap-2 rounded-none border border-border dark:border-white/10 bg-card dark:bg-[#13161a] p-2 text-xs text-foreground dark:text-zinc-200 shadow-hard-sm font-mono">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground shrink-0" />
            <span>
              Executing directive: <strong>{name}</strong>...
            </span>
          </div>
        );
      }

      return (
        <div className="my-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
          <span>
            Completed <strong>{name}</strong>
          </span>
        </div>
      );
    },
  });
}
