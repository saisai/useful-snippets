import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { DocumentSiblings } from '@/lib/content/store';

/** Previous / next links following the sidebar order. */
export function DocumentPager({ previous, next }: DocumentSiblings) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="Previous and next document" className="grid gap-3 sm:grid-cols-2">
      {previous ? (
        <Link
          href={previous.href}
          rel="prev"
          className="group border-line hover:border-line-strong hover:bg-surface flex flex-col gap-1 rounded-lg border px-4 py-3 transition-colors"
        >
          <span className="text-ink-subtle flex items-center gap-1.5 text-xs">
            <ArrowLeft
              className="size-3 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            />
            Previous
          </span>
          <span className="text-ink group-hover:text-accent truncate text-sm font-medium">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}

      {next ? (
        <Link
          href={next.href}
          rel="next"
          className="group border-line hover:border-line-strong hover:bg-surface flex flex-col items-end gap-1 rounded-lg border px-4 py-3 text-right transition-colors sm:col-start-2"
        >
          <span className="text-ink-subtle flex items-center gap-1.5 text-xs">
            Next
            <ArrowRight
              className="size-3 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
          <span className="text-ink group-hover:text-accent w-full truncate text-sm font-medium">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
