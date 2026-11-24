import React from "react";
import { Phone, Building2 } from "lucide-react";

export type TabId = "consultation" | "university";

export interface TabItem {
  id: TabId;
  label: string;
  icon: typeof Phone;
}

const TABS: TabItem[] = [
  { id: "consultation", label: "Consultation", icon: Phone },
  { id: "university", label: "University request", icon: Building2 },
];

/**
 * Two quiet tabs for the consultation and university request forms.
 */
export function FormTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <div className="mb-8 flex gap-4 border-b border-brand-hairline">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`-mb-px flex flex-1 items-center justify-center gap-2 border-b-2 px-2 pb-3 pt-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/30 ${
              isActive
                ? "border-brand-ink text-brand-ink"
                : "border-transparent text-brand-ink-muted hover:text-brand-ink"
            }`}
          >
            <Icon className="size-4" strokeWidth={1.5} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
