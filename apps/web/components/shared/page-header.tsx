"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
}

export function PageHeader({ title, subtitle, backHref }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <Button variant="ghost" size="icon" onClick={handleBack}>
        <ArrowLeft className="size-4" />
      </Button>
      <div className="flex-1">
        <h1 className="text-xl font-bold text-[#2D2154]">{title}</h1>
        {subtitle && (
          <p className="text-sm text-[#6B6B6B]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
