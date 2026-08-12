import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchPageView } from '@/components/search/SearchPageView';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search every note, command and guide in the knowledge base.',
  alternates: { canonical: '/search' },
  robots: { index: false, follow: true },
};

/**
 * The query lives in the URL and is read on the client, which keeps this page
 * static: searching never hits the server.
 */
export const dynamic = 'force-static';

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-ink-subtle text-sm">Loading search…</p>}>
      <SearchPageView />
    </Suspense>
  );
}
