import { TemplateCard } from "./template-card";
import { TEMPLATE_CATEGORIES } from "../../constants/template-catalog";

interface TemplateLibraryProps {
  onUseTemplate: (prompt: string) => void;
  isRunning?: boolean;
}

export function TemplateLibrary({ onUseTemplate, isRunning }: TemplateLibraryProps) {
  return (
    <div className="flex flex-col gap-6 font-mono animate-in fade-in duration-300">
      <div className="border-b border-border pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
          COMMERCE COMMAND TEMPLATES
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Curated prompt templates for executing operational and analytic workflows.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {TEMPLATE_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="flex flex-col gap-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              [ {cat.category} ]
            </h3>
            <div className="grid gap-2.5">
              {cat.items.map((item, itemIdx) => (
                <TemplateCard
                  key={itemIdx}
                  item={item}
                  onUse={onUseTemplate}
                  disabled={isRunning}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
