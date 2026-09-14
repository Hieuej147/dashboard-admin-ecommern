import {
  Sparkles,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { CapabilityCard } from "./capability-card";
import { CAPABILITY_CARDS } from "../../constants/capability-catalog";

interface CanvasEmptyShowcaseProps {
  onSelectPrompt: (prompt: string) => void;
  isRunning?: boolean;
}

export function CanvasEmptyShowcase({
  onSelectPrompt,
  isRunning,
}: CanvasEmptyShowcaseProps) {
  return (
    <div className="flex flex-col gap-4 font-mono animate-in fade-in duration-300">
      {/* Welcome Studio Banner */}
      <div className="border border-border bg-card p-5 shadow-hard-sm rounded-none">
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center border border-border bg-card text-foreground shadow-hard-sm">
                <Sparkles className="h-4 w-4 text-[#ece945]" />
              </span>
              <h2 className="text-sm sm:text-base font-heading font-bold uppercase tracking-wider text-foreground">
                DYNAMIC AI WORKSPACE & REAL-TIME CANVAS
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              When requesting revenue diagnostics, low-stock alerts, or settlement audits, results render dynamically on this canvas via interactive charts, telemetry tables, and operational action cards.
            </p>
          </div>
        </div>

        {/* Quick Capabilities Grid */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {CAPABILITY_CARDS.map((card) => (
            <CapabilityCard
              key={card.id}
              card={card}
              onSelect={onSelectPrompt}
              disabled={isRunning}
            />
          ))}
        </div>
      </div>

      {/* Operational Highlights */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-start gap-3 border border-border bg-card p-3.5 shadow-hard-sm rounded-none">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-border bg-muted/40 text-foreground">
            <BarChart3 className="h-4 w-4 text-[#ece945]" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">INTERACTIVE CHARTS</h4>
            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
              Real-time line graphs, bar charts, and metric distributions computed directly from backend microservices.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 border border-border bg-card p-3.5 shadow-hard-sm rounded-none">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-border bg-muted/40 text-foreground">
            <ShieldCheck className="h-4 w-4 text-[#ece945]" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">SAFETY & AUDIT GAUNTLET</h4>
            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
              Read-only telemetry queries with explicit administrative confirmation gates for mutations or inventory updates.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 border border-border bg-card p-3.5 shadow-hard-sm rounded-none">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-border bg-muted/40 text-foreground">
            <CheckCircle2 className="h-4 w-4 text-[#ece945]" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">A2UI ARCHITECTURE</h4>
            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
              Rich interactive interface widgets mount directly to this canvas plane, preserving conversation flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
