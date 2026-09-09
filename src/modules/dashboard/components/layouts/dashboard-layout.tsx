import { Header } from "@/modules/dashboard/components/ui/common/header";
import { CopilotSidebar } from "@copilotkit/react-core/v2";
import { ChatGPTThinking } from "@/modules/dashboard/components/ui/ai-components/messages";
import {
  CustomTextArea,
  CustomSendButton,
} from "@/modules/dashboard/components/ui/ai-components/input";
import { CopilotSidebarHeader } from "@/modules/dashboard/components/ui/ai-components/copilot-sidebar-header";
import { useEffect, type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Sidebar } from "@/modules/dashboard/components/ui/common/sidebar";
import { useLocation } from "react-router-dom";
import { useCopilotSync } from "@/modules/ai-workspace";
import { useAppSelector } from "@/lib/store/store";

type ChildrenProps = { children: ReactNode };

const COPILOT_TOGGLE_BUTTON = {
  openIcon: <Sparkles className="w-5 h-5 text-white" />,
  className:
    "!bg-blue-600 !shadow-lg !shadow-blue-500/20 hover:!scale-105 transition-transform !absolute !bottom-6 !right-6",
};

const COPILOT_MESSAGE_VIEW = {
  cursor: () => <ChatGPTThinking />,
  className: "bg-white",
};

const COPILOT_SUGGESTION_VIEW = {
  suggestion:
    "text-sm px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors",
};

const COPILOT_INPUT = {
  textArea: CustomTextArea,
  sendButton: CustomSendButton,
  className:
    "border-slate-200 focus-within:border-blue-400 rounded-2xl shadow-sm bg-white",
};

const COPILOT_LABELS = {
  modalHeaderTitle: "AI Assistant",
  chatInputPlaceholder: "Ask about sales, orders, products...",
};

const COPILOT_HEADER = {
  closeButton:
    "!text-slate-500 hover:!text-slate-800 hover:!bg-slate-100 !rounded-full !p-1.5 transition",
  children: CopilotSidebarHeader,
};

export default function DashboardLayout({ children }: ChildrenProps) {
  const location = useLocation();
  const isAiWorkspace = location.pathname.startsWith("/ai-workspace");

  // Sync context, tools, and dynamic suggestions across the entire dashboard
  useCopilotSync();

  // Active thread from Redux store
  const activeThreadId = useAppSelector(
    (state) => state.dashboardUi.activeThreadId
  );

  // Clear any sidebar margin offset on document.body when on AI Workspace
  useEffect(() => {
    if (isAiWorkspace && typeof document !== "undefined") {
      document.body.style.marginInlineEnd = "";
      document.body.style.marginInlineStart = "";
      document.body.style.marginRight = "";
      document.body.style.marginLeft = "";
      document.body.style.transition = "";
    }
  }, [isAiWorkspace]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {!isAiWorkspace && (
        <CopilotSidebar
          defaultOpen={true}
          threadId={activeThreadId ?? undefined}
          toggleButton={COPILOT_TOGGLE_BUTTON}
          width={440}
          header={COPILOT_HEADER}
          messageView={COPILOT_MESSAGE_VIEW}
          suggestionView={COPILOT_SUGGESTION_VIEW}
          input={COPILOT_INPUT}
          scrollView="bg-slate-50/50 px-4"
          disclaimer="text-xs text-slate-400 text-center py-2"
          labels={COPILOT_LABELS}
        />
      )}
      <Sidebar />
      <div className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-0 flex h-full flex-1 flex-col">
          <Header />
          <main
            className={
              isAiWorkspace
                ? "w-full flex-1 min-h-0 overflow-hidden p-3 sm:p-4 lg:p-5"
                : "w-full flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
            }
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
