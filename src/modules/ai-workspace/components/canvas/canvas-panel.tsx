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
    <div className="hidden md:flex flex-1 min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Canvas Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 bg-slate-50/70 shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onTabChange("canvas")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "canvas"
                ? "bg-white text-blue-700 shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Live Canvas
            {hasActiveDashboard && (
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("templates")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "templates"
                ? "bg-white text-blue-700 shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70"
            }`}
          >
            <Wand2 className="h-3.5 w-3.5" />
            AI Templates
          </button>

          <button
            type="button"
            onClick={() => onTabChange("context")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "context"
                ? "bg-white text-blue-700 shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            Capabilities & Systems
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Database className="h-3 w-3 text-emerald-500" />
            Microservices gRPC Connected
          </span>
        </div>
      </div>

      {/* Canvas Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-5 min-h-0 bg-gradient-to-b from-white to-slate-50/50">
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
