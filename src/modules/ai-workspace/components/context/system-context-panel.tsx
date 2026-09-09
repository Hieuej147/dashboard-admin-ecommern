import {
  Package,
  ShoppingCart,
  Users,
  Layers,
  HelpCircle,
} from "lucide-react";
import { MicroserviceCard } from "./microservice-card";

export function SystemContextPanel() {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      <div>
        <h2 className="text-sm font-semibold text-slate-800">
          Microservices Ecosystem & AI Tools
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Copilot assistant securely queries microservices via the API Gateway with role-based access control.
        </p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <MicroserviceCard
          title="Catalog Service"
          badge="gRPC Live"
          description="Manages product items, variants, stock counts, categories, brands, and active promotional pricing."
          icon={Package}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <MicroserviceCard
          title="Order Service"
          badge="gRPC Live"
          description="Manages order lifecycles (PENDING_PAYMENT, PAID, DELIVERING, COMPLETED, CANCELLED) and revenue metrics."
          icon={ShoppingCart}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        <MicroserviceCard
          title="Customer Service"
          badge="gRPC Live"
          description="Customer profiles, account roles, order histories, shipping addresses, and contact information."
          icon={Users}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />

        <MicroserviceCard
          title="A2UI Protocol Engine"
          badge="Active Portal"
          description="Dynamic schema transforming agent analytics into generative UI surfaces (Recharts, grid tables, action buttons) mounted to the Canvas."
          icon={Layers}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-medium text-slate-800">Safe Operations Policy</p>
            <p>
              All analytical queries, chart renderings, and summaries execute in safe read-only mode.
              For batch price modifications or inventory updates, Copilot prompts for human administrator confirmation before executing requests via API Gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
