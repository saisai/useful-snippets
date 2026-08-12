import Link from 'next/link';
import { Clock, FileText, PenLine, User } from 'lucide-react';
import type { Document, DocumentMeta, TocEntry } from '@/types/content';
import type { DocumentSiblings } from '@/lib/content/store';
import { formatDate } from '@/lib/utils/date';
import { sourceUrl } from '@/lib/site';
import { Breadcrumbs, type Crumb } from '@/components/navigation/Breadcrumbs';
import { DocumentPager } from '@/components/navigation/DocumentPager';
import { TableOfContents } from '@/components/navigation/TableOfContents';
import { RelatedArticles } from '@/components/content/RelatedArticles';
import { TagPill } from '@/components/ui/TagPill';

interface DocumentViewProps {
  document: Document;
  content: React.ReactNode;
  toc: TocEntry[];
  siblings: DocumentSiblings;
  related: DocumentMeta[];
}

function buildCrumbs(document: Document): Crumb[] {
  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    { label: document.category.label, href: `/${document.category.slug}` },
  ];

  if (document.section) crumbs.push({ label: document.section });
  crumbs.push({ label: document.title });

  return crumbs;
}

/** Article page: header, Markdown body, tags, pager and related notes. */
export function DocumentView({ document, content, toc, siblings, related }: DocumentViewProps) {
  const editUrl = sourceUrl(document.filePath);

  return (
    <div className="flex gap-10">
      <article className="max-w-content min-w-0 flex-1">
        <header>
          <Breadcrumbs items={buildCrumbs(document)} />

          <h1 className="text-ink mt-3 text-3xl font-semibold tracking-tight">{document.title}</h1>

          <p className="text-ink-muted mt-2 text-base">{document.description}</p>

          <div className="text-ink-subtle mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span>
              Updated <time dateTime={document.updated}>{formatDate(document.updated)}</time>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden />
              {document.readingTime} min read
            </span>
            {document.author ? (
              <span className="inline-flex items-center gap-1">
                <User className="size-3" aria-hidden />
                {document.author}
              </span>
            ) : null}
            <Link
              href={`/${document.category.slug}`}
              className="hover:text-ink inline-flex items-center gap-1 transition-colors"
            >
              <FileText className="size-3" aria-hidden />
              {document.category.label}
            </Link>
          </div>
        </header>

        <hr className="border-line my-6" />

        {toc.length > 1 ? (
          <div className="mb-6">
            <TableOfContents entries={toc} variant="inline" />
          </div>
        ) : null}

        <div className="markdown">{content}</div>

        {document.tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {document.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        ) : null}

        <div className="border-line text-ink-subtle mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs">
          <span className="font-mono">{document.filePath}</span>
          {editUrl ? (
            <a
              href={editUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-ink inline-flex items-center gap-1.5 transition-colors"
            >
              <PenLine className="size-3" aria-hidden />
              Edit this page
            </a>
          ) : null}
        </div>

        <div className="mt-10 space-y-10">
          <DocumentPager previous={siblings.previous} next={siblings.next} />
          <RelatedArticles documents={related} />
        </div>
      </article>

      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="top-header sticky pt-2">
          <TableOfContents entries={toc} />
        </div>
      </aside>
    </div>
  );
}
