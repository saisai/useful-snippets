'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type MiniSearch from 'minisearch';
import type { SearchEntry } from '@/types/content';
import { createSearchIndex, SEARCH_INDEX_URL } from '@/lib/search/client';
import { SearchDialog } from './SearchDialog';

type Status = 'idle' | 'loading' | 'ready' | 'error';

interface SearchContextValue {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  status: Status;
  entries: SearchEntry[];
  index: MiniSearch<SearchEntry> | null;
  /** Downloads the index on demand; safe to call repeatedly. */
  load: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch(): SearchContextValue {
  const value = useContext(SearchContext);
  if (!value) throw new Error('useSearch must be used inside <SearchProvider>.');
  return value;
}

/**
 * Owns the search index and the command palette.
 *
 * The index is fetched the first time search is used rather than on page load,
 * so reading a note costs nothing extra.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const requested = useRef(false);

  const load = useCallback(() => {
    if (requested.current) return;
    requested.current = true;
    setStatus('loading');

    fetch(SEARCH_INDEX_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        return response.json() as Promise<SearchEntry[]>;
      })
      .then((data) => {
        setEntries(data);
        setStatus('ready');
      })
      .catch(() => {
        requested.current = false;
        setStatus('error');
      });
  }, []);

  const openSearch = useCallback(() => {
    load();
    setOpen(true);
  }, [load]);

  const closeSearch = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => {
          if (!previous) load();
          return !previous;
        });
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [load]);

  const index = useMemo(() => (entries.length > 0 ? createSearchIndex(entries) : null), [entries]);

  const value = useMemo<SearchContextValue>(
    () => ({ open, openSearch, closeSearch, status, entries, index, load }),
    [open, openSearch, closeSearch, status, entries, index, load],
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
      {/* Mounted only while open, so the query resets itself on every close. */}
      {open ? <SearchDialog /> : null}
    </SearchContext.Provider>
  );
}
