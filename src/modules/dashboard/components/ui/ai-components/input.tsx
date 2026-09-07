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
        className="w-full resize-none bg-transparent outline-none text-sm px-3 py-2 placeholder:text-slate-400"
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
        className="rounded-full bg-indigo-600 text-white p-2 disabled:opacity-40 hover:bg-indigo-700 transition-colors"
      >
        <SendHorizontal className="w-4 h-4" />
      </button>
    );
  },
);
