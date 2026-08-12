'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, SearchX } from 'lucide-react';
import { runSearch } from '@/lib/search/client';
import { EmptyState } from '@/components/ui/EmptyState';
import { Highlight } from './Highlight';
import { useSearch } from './SearchProvider';

const MAX_RESULTS = 40;

/** Full page search, so results can be linked and shared. */
export function SearchPageView() {
  const { entries, index, status, load } = useSearch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');

  useEffect(() => load(), [load]);

  // Keep the URL in sync so a search can be bookmarked or shared.
  useEffect(() => {
    const trimmed = query.trim();
    const target = trimmed ? `${pathname}?q=${encodeURIComponent(trimmed)}` : pathname;
    const timer = setTimeout(() => router.replace(target, { scroll: false }), 300);
    return () => clearTimeout(timer);
  }, [query, pathname, router]);

  const hits = useMemo(
    () => (index ? runSearch(index, entries, query, MAX_RESULTS) : []),
    [index, entries, query],
  );

  const trimmed = query.trim();

  return (
    <div className="max-w-3xl">
      <h1 className="text-ink text-3xl font-semibold tracking-tight">Search</h1>
      <p className="text-ink-muted mt-2 text-base">
        Full text search across every note, including titles, descriptions, tags and content.
      </p>

      <div className="border-line bg-surface mt-6 flex items-center gap-2 rounded-lg border px-3">
        <Search className="text-ink-subtle size-4 shrink-0" aria-hidden />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search documentation…"
          aria-label="Search documentation"
          className="text-ink placeholder:text-ink-subtle h-11 flex-1 bg-transparent text-sm outline-hidden"
        />
      </div>

      <div className="mt-6">
        {status === 'loading' ? (
          <p className="text-ink-subtle text-sm">Loading search index…</p>
        ) : null}

        {status === 'error' ? (
          <p className="text-ink-muted text-sm">
            The search index could not be loaded. Please reload the page.
          </p>
        ) : null}

        {status === 'ready' && trimmed.length === 0 ? (
          <p className="text-ink-subtle text-sm">
            Type to search {entries.length} notes. Press{' '}
            <span className="font-mono">Ctrl&nbsp;K</span> anywhere to open the quick search.
          </p>
        ) : null}

        {status === 'ready' && trimmed.length > 0 ? (
          <>
            <p className="text-ink-subtle text-xs">
              {hits.length} {hits.length === 1 ? 'result' : 'results'} for “{trimmed}”
            </p>

            {hits.length === 0 ? (
              <EmptyState
                className="mt-4"
                icon={<SearchX className="size-6" />}
                title="No matching notes"
                description="Try a shorter keyword, a command name, or browse the categories instead."
              />
            ) : (
              <ul className="divide-line mt-3 divide-y">
                {hits.map((hit) => (
                  <li key={hit.entry.id}>
                    <Link href={hit.entry.href} className="group block py-3">
                      <span className="flex items-baseline gap-2">
                        <span className="text-ink group-hover:text-accent font-medium">
                          <Highlight text={hit.entry.title} terms={hit.terms} />
                        </span>
                        <span className="text-ink-subtle text-xs">{hit.entry.category}</span>
                      </span>
                      <span className="text-ink-muted mt-1 line-clamp-2 block text-sm">
                        <Highlight text={hit.snippet} terms={hit.terms} />
                      </span>
                      <span className="text-ink-subtle mt-1 block font-mono text-xs">
                        {hit.entry.href.replace(/^\//, '').split('/').join(' / ')}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
