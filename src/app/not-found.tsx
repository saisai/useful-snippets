import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <FileQuestion className="text-ink-subtle mx-auto size-8" aria-hidden />

      <h1 className="text-ink mt-4 text-2xl font-semibold tracking-tight">Page not found</h1>

      <p className="text-ink-muted mt-2">
        This note may have been renamed or moved. Try searching for it, or browse the categories.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
        <Link
          href="/"
          className="border-line bg-surface text-ink-muted hover:text-ink rounded-lg border px-3 py-2 transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/search"
          className="border-line bg-surface text-ink-muted hover:text-ink rounded-lg border px-3 py-2 transition-colors"
        >
          Search notes
        </Link>
        <Link
          href="/categories"
          className="border-line bg-surface text-ink-muted hover:text-ink rounded-lg border px-3 py-2 transition-colors"
        >
          Browse categories
        </Link>
      </div>
    </div>
  );
}
