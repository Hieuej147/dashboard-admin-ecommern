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
    <div className="flex items-center justify-between gap-4 rounded-none border border-border bg-card p-3.5 shadow-hard-sm hover:border-[#ece945] transition-colors font-mono">
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground">
          {item.title}
        </p>
        <p className="text-[11px] text-muted-foreground italic line-clamp-2">
          "{item.prompt}"
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUse(item.prompt)}
        disabled={disabled}
        className="h-7 shrink-0 text-xs font-bold uppercase text-foreground border border-border bg-card hover:bg-muted rounded-none shadow-hard-sm cursor-pointer"
      >
        APPLY
        <ArrowRight className="ml-1 h-3 w-3 text-[#ece945]" />
      </Button>
    </div>
  );
}
