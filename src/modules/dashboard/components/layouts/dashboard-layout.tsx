import { Header } from "@/modules/dashboard/components/ui/common/header";
import { CopilotSidebar } from "@copilotkit/react-core/v2";
import {
  ChatGPTThinking,
  AssistantBubble,
  UserBubble,
} from "@/modules/dashboard/components/ui/ai-components/messages";
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
  openIcon: <Sparkles className="w-5 h-5 text-[#ece945]" />,
  className:
    "!bg-card !text-foreground hover:!bg-muted !border !border-border !rounded-none !shadow-hard-md hover:!scale-105 transition-transform !absolute !bottom-6 !right-6 cursor-pointer",
};

const COPILOT_MESSAGE_VIEW = {
  assistantMessage: AssistantBubble,
  userMessage: UserBubble,
  cursor: () => <ChatGPTThinking />,
  className: "bg-background text-foreground font-mono",
};

const COPILOT_SUGGESTION_VIEW = {
  suggestion:
    "text-xs px-2.5 py-1 rounded-none border border-border bg-card text-foreground hover:bg-muted hover:border-[#ece945] transition-colors font-mono font-bold shadow-hard-sm",
};

const COPILOT_INPUT = {
  textArea: CustomTextArea,
  sendButton: CustomSendButton,
  className:
    "border-t border-border focus-within:border-[#ece945] rounded-none shadow-none bg-card p-1.5",
};

const COPILOT_LABELS = {
  modalHeaderTitle: "Executive AI Copilot",
  chatInputPlaceholder: "Ask about revenue, stock, orders...",
};

const COPILOT_HEADER = {
  closeButton:
    "!text-muted-foreground hover:!text-foreground hover:!bg-muted !rounded-none !p-1.5 transition",
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
    <div className="flex h-screen overflow-hidden bg-background text-foreground tactical-grid">
      {!isAiWorkspace && (
        <CopilotSidebar
          defaultOpen={false}
          threadId={activeThreadId ?? undefined}
          toggleButton={COPILOT_TOGGLE_BUTTON}
          width={440}
          header={COPILOT_HEADER}
          messageView={COPILOT_MESSAGE_VIEW}
          suggestionView={COPILOT_SUGGESTION_VIEW}
          input={COPILOT_INPUT}
          scrollView="bg-background px-3 py-2 flex-1 overflow-y-auto font-mono"
          disclaimer="text-[10px] text-muted-foreground text-center py-1.5 font-mono uppercase tracking-wider"
          labels={COPILOT_LABELS}
        />
      )}
      <Sidebar />
      <div className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-background/90">
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
