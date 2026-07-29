import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { brand } from "@/lib/brand";
import type { Components } from "react-markdown";

const SLUG_MAP: Record<string, string> = {
  "privacy-policy": "privacy-policy.md",
  "terms-and-conditions": "terms-and-conditions.md",
  "refund-policy": "refund-policy.md",
} as const;

export function generateStaticParams() {
  return Object.keys(SLUG_MAP).map((slug) => ({ slug }));
}

const md: Components = {
  h1: ({ children }) => (
    <h1
      className="pb-2 text-3xl font-bold tracking-tight sm:text-4xl"
      style={{ color: brand.ink, borderBottom: `1px solid ${brand.hairline}` }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="mt-10 text-xl font-semibold tracking-tight sm:text-2xl"
      style={{ color: brand.ink }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="mt-8 text-lg font-semibold"
      style={{ color: brand.ink }}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="leading-relaxed" style={{ color: brand.inkMuted }}>
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-1.5" style={{ color: brand.inkMuted }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-1.5" style={{ color: brand.inkMuted }}>
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong style={{ color: brand.ink, fontWeight: 600 }}>{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="underline underline-offset-2 transition-colors hover:no-underline"
      style={{ color: brand.gold }}
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-8" style={{ borderColor: brand.hairline }} />,
};

export default async function MarkdownPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filename = SLUG_MAP[slug];

  if (!filename) notFound();

  const filePath = path.join(
    process.cwd(),
    "components",
    "markdown",
    filename
  );
  const content = await fs.readFile(filePath, "utf-8");

  return (
    <main className="mx-auto max-w-3xl lg:max-w-5xl px-4 py-16 mt-10">
      <article className="space-y-5">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
