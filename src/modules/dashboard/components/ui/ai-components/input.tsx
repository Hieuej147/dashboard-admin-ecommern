import { forwardRef } from "react";
import type { TextareaHTMLAttributes, ButtonHTMLAttributes } from "react";
import { SendHorizontal } from "lucide-react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
type SendButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const CustomTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function CustomTextArea(props, ref) {
    return (
      <textarea
        ref={ref}
        {...props}
        rows={1}
        className="w-full resize-none bg-transparent outline-none text-xs font-mono px-3 py-2 text-foreground dark:text-zinc-100 placeholder:text-muted-foreground/70 dark:placeholder:text-zinc-500"
      />
    );
  },
);

export const CustomSendButton = forwardRef<HTMLButtonElement, SendButtonProps>(
  function CustomSendButton(props, ref) {
    return (
      <button
        ref={ref}
        {...props}
        aria-label="Send directive to Copilot"
        className="rounded-none border border-border bg-[#111315] text-[#ece945] dark:bg-[#ece945] dark:text-[#111315] dark:border-[#ece945] p-2 disabled:opacity-30 hover:opacity-90 transition-all cursor-pointer shadow-hard-sm shrink-0 flex items-center justify-center font-bold"
      >
        <SendHorizontal className="w-3.5 h-3.5 text-current" />
      </button>
    );
  },
);
