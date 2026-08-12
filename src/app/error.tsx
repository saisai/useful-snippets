'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

/**
 * Route level error boundary. Readers get a short explanation instead of a
 * stack trace; the details stay in the server logs and the dev overlay.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <TriangleAlert className="text-ink-subtle mx-auto size-8" aria-hidden />

      <h1 className="text-ink mt-4 text-2xl font-semibold tracking-tight">Something went wrong</h1>

      <p className="text-ink-muted mt-2">
        This page could not be rendered. If it happens repeatedly, the source Markdown file may
        contain invalid frontmatter.
      </p>

      {error.digest ? (
        <p className="text-ink-subtle mt-2 font-mono text-xs">Reference: {error.digest}</p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
        <button
          type="button"
          onClick={reset}
          className="border-line bg-surface text-ink-muted hover:text-ink rounded-lg border px-3 py-2 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border-line bg-surface text-ink-muted hover:text-ink rounded-lg border px-3 py-2 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
