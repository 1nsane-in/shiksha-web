import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/img/logo.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1607013407627-6ee814329547?q=80&w=964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
          sizes="50vw"
        />
      </div>
    </div>
  );
}
