'use client';

import { useSyncExternalStore } from 'react';
import { Search } from 'lucide-react';
import { Kbd } from '@/components/ui/Kbd';
import { cn } from '@/lib/utils/cn';
import { isApplePlatform, subscribeToNothing } from '@/lib/utils/client-store';
import { useSearch } from './SearchProvider';

/** `null` while rendering on the server, where the platform is unknown. */
function useShortcutLabel(): string | null {
  const isApple = useSyncExternalStore(subscribeToNothing, isApplePlatform, () => null);
  if (isApple === null) return null;
  return isApple ? '⌘K' : 'Ctrl K';
}

interface SearchTriggerProps {
  variant?: 'header' | 'hero';
  className?: string;
}

/** Opens the command palette. Also used as the homepage search field. */
export function SearchTrigger({ variant = 'header', className }: SearchTriggerProps) {
  const { openSearch, load } = useSearch();
  const shortcut = useShortcutLabel();

  const shared =
    'group flex items-center gap-2 rounded-lg border border-line bg-surface text-ink-subtle transition-colors hover:border-line-strong hover:text-ink-muted';

  if (variant === 'hero') {
    return (
      <button
        type="button"
        onClick={openSearch}
        onPointerEnter={load}
        className={cn(shared, 'w-full px-4 py-3 text-left', className)}
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="flex-1 text-sm">Search documentation…</span>
        <span className="min-w-14 text-right">{shortcut ? <Kbd>{shortcut}</Kbd> : null}</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        onPointerEnter={load}
        className={cn(shared, 'hidden h-8 w-56 px-2.5 sm:flex', className)}
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="flex-1 text-left text-sm">Search…</span>
        <span className="min-w-12 text-right">{shortcut ? <Kbd>{shortcut}</Kbd> : null}</span>
      </button>

      <button
        type="button"
        onClick={openSearch}
        aria-label="Search documentation"
        className="border-line bg-surface text-ink-subtle hover:text-ink flex size-8 items-center justify-center rounded-lg border transition-colors sm:hidden"
      >
        <Search className="size-4" aria-hidden />
      </button>
    </>
  );
}
