import React from "react";
import { Phone, Building2 } from "lucide-react";

export type TabId = "consultation" | "university";

export interface TabItem {
  id: TabId;
  label: string;
  icon: typeof Phone;
}

const TABS: TabItem[] = [
  { id: "consultation", label: "Free Consultation", icon: Phone },
  { id: "university", label: "Request University", icon: Building2 },
];

/**
 * Pill-style tab switcher for toggling between consultation and university request forms.
 */
export function FormTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-white text-[#1A153A] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Icon className="h-4 w-4" />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
