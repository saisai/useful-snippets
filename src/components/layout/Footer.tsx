import Link from 'next/link';
import { getContentStats } from '@/lib/content/store';
import { site } from '@/lib/site';

export async function Footer() {
  const stats = await getContentStats();

  return (
    <footer className="border-line mt-16 border-t">
      <div className="text-ink-subtle mx-auto flex max-w-[100rem] flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} — {stats.documents} notes across {stats.categories} categories, written in
          Markdown.
        </p>

        <div className="flex items-center gap-4">
          <Link href="/categories" className="hover:text-ink transition-colors">
            Categories
          </Link>
          <Link href="/tags" className="hover:text-ink transition-colors">
            Tags
          </Link>
          {site.github ? (
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-ink transition-colors"
            >
              Source
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
