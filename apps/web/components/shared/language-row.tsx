import { Badge } from "@repo/ui";

interface LanguageAbility {
  name: string;
  speaking: string;
  reading: string;
  writing: string;
}

interface LanguageRowProps {
  language: LanguageAbility;
}

export function LanguageRow({ language }: LanguageRowProps) {
  return (
    <div className="flex items-center gap-4 text-sm border-b border-[#F0F0F0] pb-2 last:border-0 last:pb-0 flex-wrap">
      <span className="font-medium text-[#2D2154] min-w-[80px]">
        {language.name}
      </span>
      <Badge variant="outline" className="text-xs">
        Speaking: {language.speaking}
      </Badge>
      <Badge variant="outline" className="text-xs">
        Reading: {language.reading}
      </Badge>
      <Badge variant="outline" className="text-xs">
        Writing: {language.writing}
      </Badge>
    </div>
  );
}
