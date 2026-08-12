import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb trail shown above page titles. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-ink-subtle flex flex-wrap items-center gap-1 text-xs">
        {items.map((item, position) => (
          <li key={`${item.label}-${position}`} className="flex items-center gap-1">
            {position > 0 ? <ChevronRight className="size-3" aria-hidden /> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-ink transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink-muted">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
