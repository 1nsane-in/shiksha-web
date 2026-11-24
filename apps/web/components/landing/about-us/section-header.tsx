interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}

/**
 * Quiet section header for the about page.
 * Sentence-case label, one medium-weight headline, one short description.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  dark,
}: SectionHeaderProps) {
  return (
    <div className="mb-10 max-w-2xl sm:mb-12">
      <p
        className={`text-xs font-medium ${
          dark ? "text-white/70" : "text-brand-ink-muted"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-3xl font-medium leading-[1.12] tracking-[-0.01em] sm:text-4xl ${
          dark ? "text-white" : "text-brand-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-xl text-sm leading-relaxed sm:text-base ${
            dark ? "text-white/70" : "text-brand-ink-muted"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
