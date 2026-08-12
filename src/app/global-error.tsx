'use client';

import { useEffect } from 'react';
import './globals.css';

/**
 * Last resort boundary, used when even the root layout fails to render — for
 * example when a Markdown file has invalid frontmatter and the content index
 * cannot be built. The details go to the logs, not to the reader.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-ink text-2xl font-semibold tracking-tight">
            This site could not be loaded
          </h1>
          <p className="text-ink-muted mt-2">
            The content index failed to build. If you are running the site locally, run{' '}
            <code className="font-mono">npm run content:check</code> to find the file that needs
            attention.
          </p>
          {/* A full reload, not a client navigation: the router may be broken too. */}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="border-line bg-surface text-ink-muted mt-6 inline-block rounded-lg border px-3 py-2 text-sm"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
