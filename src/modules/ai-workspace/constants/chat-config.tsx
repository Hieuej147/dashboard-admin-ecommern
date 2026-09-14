import {
  ChatGPTThinking,
  AssistantBubble,
  UserBubble,
  ReasoningBubble,
} from "@/modules/dashboard/components/ui/ai-components/messages";
import {
  CustomTextArea,
  CustomSendButton,
} from "@/modules/dashboard/components/ui/ai-components/input";

export const CHAT_MESSAGE_VIEW = {
  assistantMessage: AssistantBubble,
  userMessage: UserBubble,
  reasoningMessage: ReasoningBubble,
  cursor: () => <ChatGPTThinking />,
  className: "bg-background text-foreground font-mono",
};

export const CHAT_SUGGESTION_VIEW = {
  suggestion:
    "text-xs px-2.5 py-1 rounded-none border border-border bg-card text-foreground hover:bg-muted hover:border-[#ece945] transition-colors font-mono font-bold shadow-hard-sm",
};

export const CHAT_INPUT = {
  textArea: CustomTextArea,
  sendButton: CustomSendButton,
  className:
    "border-t border-border dark:border-white/10 focus-within:border-[#ece945] dark:focus-within:border-[#ece945] focus-within:ring-1 focus-within:ring-[#ece945]/30 rounded-none shadow-none bg-card dark:bg-[#101215] p-2 transition-colors",
};

export const CHAT_LABELS = {
  chatInputPlaceholder: "Ask Copilot on revenue, inventory, order lifecycle, or enter command...",
};
