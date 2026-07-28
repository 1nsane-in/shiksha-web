"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }) }, [pathname]);
  return <QueryProvider>{children}</QueryProvider>;
}

