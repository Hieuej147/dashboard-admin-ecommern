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
    <div className="flex flex-col gap-5 font-mono animate-in fade-in duration-300">
      <div className="border-b border-border pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
          MICROSERVICES ECOSYSTEM & TELEMETRY
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Copilot securely queries cluster services via API Gateway with role-based access control.
        </p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <MicroserviceCard
          title="Catalog Service"
          badge="gRPC Online"
          description="Product catalog, SKU variant management, inventory quantities, category trees, and unit pricing."
          icon={Package}
        />

        <MicroserviceCard
          title="Order Service"
          badge="gRPC Online"
          description="Order lifecycle fulfillment state machine (Pending, Paid, Dispatched, Completed, Cancelled) and revenue metrics."
          icon={ShoppingCart}
        />

        <MicroserviceCard
          title="Customer Service"
          badge="gRPC Online"
          description="Customer accounts, user roles, order history, shipping addresses, and Clerk identity records."
          icon={Users}
        />

        <MicroserviceCard
          title="A2UI Protocol"
          badge="Dynamic Surface"
          description="Transforms analytical telemetry into interactive UI artifacts (Recharts, data grids, action triggers) on the Canvas."
          icon={Layers}
        />
      </div>

      <div className="border border-border bg-card p-4 shadow-hard-sm">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="h-4 w-4 text-[#ece945] shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-bold text-foreground uppercase tracking-wider">[ SAFETY OPERATIONAL POLICY ]</p>
            <p>
              All analytics queries, chart renderings, and summary reports run in strict read-only mode.
              For bulk price modifications or inventory reallocations, Copilot requires explicit admin approval before executing commands via the API Gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
