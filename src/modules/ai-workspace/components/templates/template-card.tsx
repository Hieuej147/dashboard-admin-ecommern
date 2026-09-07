import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TemplateItem } from "../../types/ai-workspace.types";

interface TemplateCardProps {
  item: TemplateItem;
  onUse: (prompt: string) => void;
  disabled?: boolean;
}

export function TemplateCard({ item, onUse, disabled }: TemplateCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs hover:border-blue-300 hover:shadow-xs transition">
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800">
          {item.title}
        </p>
        <p className="text-[11px] text-slate-500 italic line-clamp-2">
          "{item.prompt}"
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUse(item.prompt)}
        disabled={disabled}
        className="h-7 shrink-0 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        Sử dụng
        <ArrowRight className="ml-1 h-3 w-3" />
      </Button>
    </div>
  );
}
