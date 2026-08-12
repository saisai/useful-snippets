import type { Metadata } from 'next';
import Link from 'next/link';
import { FolderTree } from 'lucide-react';
import { getCategories } from '@/lib/content/store';
import { formatRelativeDate } from '@/lib/utils/date';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Every category in the knowledge base, with the number of notes it contains.',
  alternates: { canonical: '/categories' },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]} />

      <h1 className="text-ink mt-3 text-3xl font-semibold tracking-tight">Categories</h1>
      <p className="text-ink-muted mt-2 text-base">
        Notes are grouped by the directory they live in. {categories.length} categories so far.
      </p>

      <hr className="border-line my-6" />

      {categories.length === 0 ? (
        <EmptyState
          icon={<FolderTree className="size-6" />}
          title="No categories yet"
          description="Create a directory with a Markdown file inside to get started."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={category.href}
                className="group border-line bg-canvas hover:border-line-strong hover:bg-surface flex h-full flex-col gap-2 rounded-lg border p-4 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CategoryIcon name={category.icon} className="text-accent" />
                  <span className="text-ink group-hover:text-accent font-medium">
                    {category.label}
                  </span>
                  <span className="text-ink-subtle ml-auto text-xs">
                    {category.documents.length}
                  </span>
                </span>

                <span className="text-ink-muted line-clamp-2 text-sm">{category.description}</span>

                {category.updated ? (
                  <span className="text-ink-subtle mt-auto pt-1 text-xs">
                    Updated {formatRelativeDate(category.updated)}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
