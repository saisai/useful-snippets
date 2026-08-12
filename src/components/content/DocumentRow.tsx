import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { DocumentMeta } from '@/types/content';
import { formatRelativeDate } from '@/lib/utils/date';

/** Compact list row used for "Recently updated" and category listings. */
export function DocumentRow({
  document,
  showCategory = true,
}: {
  document: DocumentMeta;
  showCategory?: boolean;
}) {
  return (
    <Link
      href={document.href}
      className="group hover:bg-surface flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-ink group-hover:text-accent truncate font-medium">
            {document.title}
          </span>
          {showCategory ? (
            <span className="text-ink-subtle shrink-0 text-xs">{document.category.label}</span>
          ) : null}
        </div>
        <p className="text-ink-muted truncate text-sm">{document.description}</p>
      </div>

      <span className="text-ink-subtle hidden shrink-0 text-xs sm:block">
        Updated {formatRelativeDate(document.updated)}
      </span>
      <ChevronRight
        className="text-ink-subtle size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
