import { Layers, Wand2, Cpu, Database } from "lucide-react";
import { LiveCanvas } from "./live-canvas";
import { TemplateLibrary } from "../templates/template-library";
import { SystemContextPanel } from "../context/system-context-panel";
import type { AiWorkspaceTab } from "../../types/ai-workspace.types";

interface CanvasPanelProps {
  activeTab: AiWorkspaceTab;
  onTabChange: (tab: AiWorkspaceTab) => void;
  hasActiveDashboard: boolean;
  onSelectPrompt: (prompt: string) => void;
  isRunning?: boolean;
}

export function CanvasPanel({
  activeTab,
  onTabChange,
  hasActiveDashboard,
  onSelectPrompt,
  isRunning,
}: CanvasPanelProps) {
  return (
    <div className="hidden md:flex flex-1 min-w-0 flex-col rounded-none border border-border bg-card shadow-hard-sm overflow-hidden font-mono">
      {/* Canvas Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2 bg-muted/40 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onTabChange("canvas")}
            className={`flex items-center gap-1.5 rounded-none px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "canvas"
                ? "bg-primary text-primary-foreground shadow-hard-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-[#ece945]" />
            LIVE CANVAS
            {hasActiveDashboard && (
              <span className="h-1.5 w-1.5 bg-[#ece945]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("templates")}
            className={`flex items-center gap-1.5 rounded-none px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "templates"
                ? "bg-primary text-primary-foreground shadow-hard-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
            }`}
          >
            <Wand2 className="h-3.5 w-3.5 text-[#ece945]" />
            PROMPT TEMPLATES
          </button>

          <button
            type="button"
            onClick={() => onTabChange("context")}
            className={`flex items-center gap-1.5 rounded-none px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "context"
                ? "bg-primary text-primary-foreground shadow-hard-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-[#ece945]" />
            MICROSERVICES TELEMETRY
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="border border-border bg-card px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shadow-hard-sm">
            <Database className="h-3 w-3" />
            [ gRPC SERVICES: OK ]
          </span>
        </div>
      </div>

      {/* Canvas Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-5 min-h-0 bg-background text-foreground">
        {activeTab === "canvas" && (
          <LiveCanvas
            hasActiveDashboard={hasActiveDashboard}
            onSelectPrompt={onSelectPrompt}
            isRunning={isRunning}
          />
        )}

        {activeTab === "templates" && (
          <TemplateLibrary
            onUseTemplate={onSelectPrompt}
            isRunning={isRunning}
          />
        )}

        {activeTab === "context" && <SystemContextPanel />}
      </div>
    </div>
  );
}
