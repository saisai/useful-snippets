import Link from 'next/link';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import {
  getCategories,
  getContentStats,
  getFeaturedDocuments,
  getRecentlyUpdatedDocuments,
} from '@/lib/content/store';
import { site } from '@/lib/site';
import { DocumentCard } from '@/components/content/DocumentCard';
import { DocumentRow } from '@/components/content/DocumentRow';
import { SearchTrigger } from '@/components/search/SearchTrigger';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function HomePage() {
  const [stats, categories, featured, recent] = await Promise.all([
    getContentStats(),
    getCategories(),
    getFeaturedDocuments(4),
    getRecentlyUpdatedDocuments(8),
  ]);

  if (stats.documents === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState
          icon={<FileText className="size-6" />}
          title="No notes found"
          description="Create a Markdown file inside a category directory, for example content/git/git-basics.md, then refresh this page."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="border-line border-b py-16 sm:py-20">
        <p className="text-ink-subtle flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          <Sparkles className="text-accent size-3.5" aria-hidden />
          {stats.documents} notes · {stats.categories} categories · {stats.tags} tags
        </p>

        <h1 className="text-ink mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {site.name}
        </h1>

        <p className="text-ink-muted mt-4 max-w-xl text-base sm:text-lg">{site.description}</p>

        <div className="mt-8 max-w-xl">
          <SearchTrigger variant="hero" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="text-ink-subtle">Jump to</span>
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="text-ink-muted hover:text-accent transition-colors"
            >
              {category.label}
            </Link>
          ))}
          <Link href="/categories" className="text-accent hover:underline">
            All categories
          </Link>
        </div>
      </section>

      {featured.length > 0 ? (
        <section aria-labelledby="featured-heading" className="border-line border-b py-12">
          <div className="flex items-baseline justify-between">
            <h2 id="featured-heading" className="text-ink text-lg font-semibold">
              Featured
            </h2>
            <span className="text-ink-subtle text-xs">Marked with featured: true</span>
          </div>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {featured.map((document) => (
              <li key={document.href}>
                <DocumentCard document={document} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="categories-heading" className="border-line border-b py-12">
        <div className="flex items-baseline justify-between">
          <h2 id="categories-heading" className="text-ink text-lg font-semibold">
            Categories
          </h2>
          <Link
            href="/categories"
            className="text-accent inline-flex items-center gap-1 text-sm hover:underline"
          >
            View all
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={category.href}
                className="group border-line hover:border-line-strong hover:bg-surface flex items-center gap-2.5 rounded-lg border px-3.5 py-3 transition-colors"
              >
                <CategoryIcon name={category.icon} className="text-accent" />
                <span className="text-ink group-hover:text-accent truncate text-sm font-medium">
                  {category.label}
                </span>
                <span className="text-ink-subtle ml-auto text-xs">{category.documents.length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recent-heading" className="py-12">
        <h2 id="recent-heading" className="text-ink text-lg font-semibold">
          Recently updated
        </h2>

        <ul className="divide-line mt-3 divide-y">
          {recent.map((document) => (
            <li key={document.href}>
              <DocumentRow document={document} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
