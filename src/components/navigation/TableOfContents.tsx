'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@/types/content';
import { cn } from '@/lib/utils/cn';

const HEADER_OFFSET = 96;

/** Tracks which heading the reader is currently looking at. */
function useActiveHeading(entries: TocEntry[]): string | null {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (entries.length === 0) return;

    let frame = 0;

    function update() {
      frame = 0;
      let current: string | null = null;

      for (const entry of entries) {
        const element = document.getElementById(entry.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top - HEADER_OFFSET <= 0) current = entry.id;
      }

      // Before the first heading scrolls past, highlight it anyway.
      setActive(current ?? entries[0]?.id ?? null);
    }

    function onScroll() {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [entries]);

  return active;
}

interface TableOfContentsProps {
  entries: TocEntry[];
  /** `panel` is the sticky desktop aside, `inline` the collapsible mobile version. */
  variant?: 'panel' | 'inline';
}

export function TableOfContents({ entries, variant = 'panel' }: TableOfContentsProps) {
  const active = useActiveHeading(entries);

  if (entries.length === 0) return null;

  const list = (
    <ul className="space-y-0.5 text-sm">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            aria-current={entry.id === active ? 'location' : undefined}
            className={cn(
              'block rounded-md py-1 pr-2 transition-colors',
              entry.depth === 2 && 'pl-2',
              entry.depth === 3 && 'pl-5',
              entry.depth >= 4 && 'pl-8',
              entry.id === active ? 'text-accent font-medium' : 'text-ink-muted hover:text-ink',
            )}
          >
            {entry.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === 'inline') {
    return (
      <details className="border-line bg-surface rounded-lg border px-3 py-2 xl:hidden">
        <summary className="text-ink-subtle cursor-pointer text-xs font-semibold tracking-wide uppercase">
          On this page
        </summary>
        <div className="mt-2">{list}</div>
      </details>
    );
  }

  return (
    <nav
      aria-labelledby="toc-heading"
      className="scrollbar-slim max-h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <p
        id="toc-heading"
        className="text-ink-subtle px-2 pb-2 text-xs font-semibold tracking-wide uppercase"
      >
        On this page
      </p>
      {list}
    </nav>
  );
}
