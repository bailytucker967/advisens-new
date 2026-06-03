export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
      <div>
        {eyebrow && (
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-600">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-[30px] font-light leading-tight tracking-tight text-mahogany sm:text-[36px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-mahogany-500">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-mahogany/10 bg-cream-50 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-mahogany/15 bg-cream-50 p-12 text-center">
      <h3 className="font-display text-[18px] text-mahogany">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-mahogany-500">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
