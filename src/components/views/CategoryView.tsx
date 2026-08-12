import { FileText } from 'lucide-react';
import type { Category } from '@/types/content';
import { formatRelativeDate } from '@/lib/utils/date';
import { slugify } from '@/lib/utils/slug';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { DocumentCard } from '@/components/content/DocumentCard';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { EmptyState } from '@/components/ui/EmptyState';
import { TagPill } from '@/components/ui/TagPill';

/** Collects the tags used by the documents in a category, most common first. */
function collectTags(category: Category): string[] {
  const counts = new Map<string, { label: string; count: number }>();

  for (const document of category.documents) {
    for (const tag of document.tags) {
      const key = slugify(tag);
      const existing = counts.get(key);
      if (existing) existing.count += 1;
      else counts.set(key, { label: tag, count: 1 });
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 12)
    .map((entry) => entry.label);
}

export function CategoryView({ category }: { category: Category }) {
  const tags = collectTags(category);

  return (
    <div className="max-w-4xl">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Categories', href: '/categories' },
          { label: category.label },
        ]}
      />

      <header className="mt-3">
        <h1 className="text-ink flex items-center gap-2.5 text-3xl font-semibold tracking-tight">
          <CategoryIcon name={category.icon} className="text-accent size-6" />
          {category.label}
        </h1>

        <p className="text-ink-muted mt-2 text-base">{category.description}</p>

        <div className="text-ink-subtle mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span className="inline-flex items-center gap-1">
            <FileText className="size-3" aria-hidden />
            {category.documents.length} {category.documents.length === 1 ? 'article' : 'articles'}
          </span>
          {category.updated ? (
            <span>Last updated {formatRelativeDate(category.updated)}</span>
          ) : null}
        </div>

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        ) : null}
      </header>

      <hr className="border-line my-6" />

      {category.documents.length === 0 ? (
        <EmptyState
          title="No articles yet"
          description="Add a Markdown file to this directory and it will appear here."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {category.documents.map((document) => (
            <li key={document.href}>
              <DocumentCard document={document} showCategory={false} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
