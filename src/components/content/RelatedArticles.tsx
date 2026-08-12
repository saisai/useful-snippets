import Link from 'next/link';
import type { DocumentMeta } from '@/types/content';

/** Suggests neighbouring notes at the end of an article. */
export function RelatedArticles({ documents }: { documents: DocumentMeta[] }) {
  if (documents.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-ink text-sm font-semibold tracking-wide uppercase">
        Related articles
      </h2>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {documents.map((document) => (
          <li key={document.href}>
            <Link
              href={document.href}
              className="group border-line hover:border-line-strong hover:bg-surface flex h-full flex-col gap-1 rounded-lg border px-4 py-3 transition-colors"
            >
              <span className="text-ink-subtle text-xs">{document.category.label}</span>
              <span className="text-ink group-hover:text-accent text-sm font-medium">
                {document.title}
              </span>
              <span className="text-ink-muted line-clamp-2 text-xs">{document.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
