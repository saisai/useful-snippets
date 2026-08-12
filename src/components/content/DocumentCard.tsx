import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { DocumentMeta } from '@/types/content';
import { formatDate } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';

interface DocumentCardProps {
  document: DocumentMeta;
  /** Hides the category label on pages that are already scoped to one. */
  showCategory?: boolean;
  className?: string;
}

/** Card used in grids on the homepage, category pages and tag pages. */
export function DocumentCard({ document, showCategory = true, className }: DocumentCardProps) {
  return (
    <Link
      href={document.href}
      className={cn(
        'group border-line bg-canvas hover:border-line-strong hover:bg-surface flex h-full flex-col gap-2 rounded-lg border p-4 transition-colors',
        className,
      )}
    >
      {showCategory ? (
        <span className="text-accent text-xs font-medium tracking-wide uppercase">
          {document.category.label}
        </span>
      ) : null}

      <h3 className="text-ink group-hover:text-accent font-medium">{document.title}</h3>

      <p className="text-ink-muted line-clamp-2 text-sm">{document.description}</p>

      <div className="text-ink-subtle mt-auto flex items-center gap-3 pt-2 text-xs">
        <time dateTime={document.updated}>{formatDate(document.updated)}</time>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3" aria-hidden />
          {document.readingTime} min read
        </span>
      </div>
    </Link>
  );
}
