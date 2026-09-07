import { ChatGPTThinking } from "@/modules/dashboard/components/ui/ai-components/messages";
import {
  CustomTextArea,
  CustomSendButton,
} from "@/modules/dashboard/components/ui/ai-components/input";

export const CHAT_MESSAGE_VIEW = {
  cursor: () => <ChatGPTThinking />,
  className: "bg-white",
};

export const CHAT_SUGGESTION_VIEW = {
  suggestion:
    "text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors",
};

export const CHAT_INPUT = {
  textArea: CustomTextArea,
  sendButton: CustomSendButton,
  className:
    "border-slate-200 focus-within:border-blue-400 rounded-2xl shadow-sm bg-white",
};

export const CHAT_LABELS = {
  chatInputPlaceholder: "Hỏi về doanh số, tồn kho, đơn hàng hoặc yêu cầu AI tạo báo cáo...",
};
