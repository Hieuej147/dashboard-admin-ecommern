import { TemplateCard } from "./template-card";
import { TEMPLATE_CATEGORIES } from "../../constants/template-catalog";

interface TemplateLibraryProps {
  onUseTemplate: (prompt: string) => void;
  isRunning?: boolean;
}

export function TemplateLibrary({ onUseTemplate, isRunning }: TemplateLibraryProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-sm font-semibold text-slate-800">
          E-Commerce Workflow Template Library
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Curated prompts empowering administrators to execute common workflows instantly without drafting from scratch.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {TEMPLATE_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {cat.category}
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
