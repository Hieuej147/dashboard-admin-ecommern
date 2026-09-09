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
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Welcome Studio Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-purple-500/10 p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Live Generative Canvas & Dynamic Workspace
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              When you ask the AI assistant to generate sales reports, inventory alerts, or performance diagnostics, results render dynamically via A2UI with interactive charts, grids, and action cards right on this canvas.
            </p>
          </div>
        </div>

        {/* Quick Capabilities Grid */}
        <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
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
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BarChart3 className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-xs font-semibold text-slate-800">Interactive Charts</h4>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Automatically renders real-time Recharts line, bar, and pie graphs from backend API data.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-xs font-semibold text-slate-800">Safety & Oversight</h4>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Safe read-only analytical queries, requiring human administrator confirmation for write operations.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-xs font-semibold text-slate-800">Portal Architecture</h4>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Dynamic A2UI components mount directly to the canvas surface without cluttering the chat thread.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
