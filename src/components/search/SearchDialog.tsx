'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CornerDownLeft, FileText, Search, X } from 'lucide-react';
import { runSearch, type SearchHit } from '@/lib/search/client';
import { cn } from '@/lib/utils/cn';
import { Kbd } from '@/components/ui/Kbd';
import { Highlight } from './Highlight';
import { useSearch } from './SearchProvider';

const MAX_RESULTS = 12;

export function SearchDialog() {
  const { closeSearch, status, entries, index } = useSearch();
  const router = useRouter();
  const listId = useId();

  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [lastQuery, setLastQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const hits = useMemo<SearchHit[]>(
    () => (index ? runSearch(index, entries, query, MAX_RESULTS) : []),
    [index, entries, query],
  );

  const categories = useMemo(() => {
    const counts = new Map<string, { label: string; slug: string; count: number }>();
    for (const entry of entries) {
      const existing = counts.get(entry.categorySlug);
      if (existing) existing.count += 1;
      else
        counts.set(entry.categorySlug, {
          label: entry.category,
          slug: entry.categorySlug,
          count: 1,
        });
    }
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 8);
  }, [entries]);

  // Typing starts again from the first result. Adjusting during render avoids an
  // extra pass through the effect queue.
  if (lastQuery !== query) {
    setLastQuery(query);
    setActive(0);
  }

  // Focus management: move focus into the dialog, then back where it came from.
  useEffect(() => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
      restoreFocusTo.current?.focus();
    };
  }, []);

  const go = useCallback(
    (href: string) => {
      closeSearch();
      router.push(href);
    },
    [closeSearch, router],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch();
        return;
      }

      if (event.key === 'Tab') {
        // Simple focus trap: keep Tab cycling inside the panel.
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'input, button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (hits.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActive((current) => (current + 1) % hits.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActive((current) => (current - 1 + hits.length) % hits.length);
      } else if (event.key === 'Enter') {
        const hit = hits[active];
        if (hit) {
          event.preventDefault();
          go(hit.entry.href);
        }
      }
    },
    [active, closeSearch, go, hits],
  );

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    node?.scrollIntoView({ block: 'nearest' });
  }, [active, hits]);

  const activeId = hits[active] ? `${listId}-option-${active}` : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-[12vh]">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-hidden
        onClick={closeSearch}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onKeyDown={onKeyDown}
        className="border-line bg-canvas relative flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border shadow-2xl"
      >
        <div className="border-line flex items-center gap-2 border-b px-3">
          <Search className="text-ink-subtle size-4 shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            placeholder="Search documentation…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="text-ink placeholder:text-ink-subtle h-12 flex-1 bg-transparent text-sm outline-hidden"
          />
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="text-ink-subtle hover:bg-surface hover:text-ink rounded-md p-1.5 transition-colors"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="scrollbar-slim overflow-y-auto">
          {status === 'loading' ? (
            <p className="text-ink-subtle px-4 py-8 text-center text-sm">Loading search index…</p>
          ) : null}

          {status === 'error' ? (
            <p className="text-ink-muted px-4 py-8 text-center text-sm">
              The search index could not be loaded. Please try again.
            </p>
          ) : null}

          {status === 'ready' && query.trim().length === 0 ? (
            <div className="px-4 py-5">
              <p className="text-ink-subtle text-xs font-medium tracking-wide uppercase">
                Browse categories
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => go(`/${category.slug}`)}
                    className="border-line text-ink-muted hover:border-line-strong hover:text-ink rounded-md border px-2.5 py-1 text-sm transition-colors"
                  >
                    {category.label}
                    <span className="text-ink-subtle ml-1.5 text-xs">{category.count}</span>
                  </button>
                ))}
              </div>
              <p className="text-ink-subtle mt-5 text-sm">
                Search titles, descriptions, tags and the full text of every note.
              </p>
            </div>
          ) : null}

          {status === 'ready' && query.trim().length > 0 && hits.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-ink text-sm font-medium">No results for “{query.trim()}”</p>
              <p className="text-ink-muted mt-1 text-sm">
                Try a different keyword, or search for a command name.
              </p>
            </div>
          ) : null}

          {hits.length > 0 ? (
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label="Search results"
              className="p-2"
            >
              {hits.map((hit, position) => (
                <li key={hit.entry.id} role="none">
                  <button
                    type="button"
                    id={`${listId}-option-${position}`}
                    role="option"
                    aria-selected={position === active}
                    data-active={position === active}
                    onMouseMove={() => setActive(position)}
                    onClick={() => go(hit.entry.href)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                      position === active ? 'bg-surface' : 'hover:bg-surface',
                    )}
                  >
                    <FileText className="text-ink-subtle mt-0.5 size-4 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="text-ink truncate text-sm font-medium">
                          <Highlight text={hit.entry.title} terms={hit.terms} />
                        </span>
                        <span className="text-ink-subtle shrink-0 text-xs">
                          {hit.entry.category}
                        </span>
                      </span>
                      <span className="text-ink-muted mt-0.5 line-clamp-2 block text-xs">
                        <Highlight text={hit.snippet} terms={hit.terms} />
                      </span>
                      <span className="text-ink-subtle mt-1 block truncate font-mono text-[0.6875rem]">
                        {hit.entry.href.replace(/^\//, '').split('/').join(' / ')}
                      </span>
                    </span>
                    {position === active ? (
                      <CornerDownLeft
                        className="text-ink-subtle mt-0.5 size-3.5 shrink-0"
                        aria-hidden
                      />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="border-line bg-surface text-ink-subtle flex items-center gap-4 border-t px-4 py-2 text-xs">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            to navigate
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            to open
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>esc</Kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  );
}
