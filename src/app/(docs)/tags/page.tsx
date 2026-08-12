import type { Metadata } from 'next';
import Link from 'next/link';
import { Hash } from 'lucide-react';
import { getTags } from '@/lib/content/store';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse every tag used across the knowledge base.',
  alternates: { canonical: '/tags' },
};

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="max-w-4xl">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Tags' }]} />

      <h1 className="text-ink mt-3 text-3xl font-semibold tracking-tight">Tags</h1>
      <p className="text-ink-muted mt-2 text-base">
        {tags.length} tags collected from the frontmatter of every note.
      </p>

      <hr className="border-line my-6" />

      {tags.length === 0 ? (
        <EmptyState
          icon={<Hash className="size-6" />}
          title="No tags yet"
          description="Add a tags list to the frontmatter of a note to see it here."
        />
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={tag.href}
                className="border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors"
              >
                <span className="font-mono">#{tag.label}</span>
                <span className="text-ink-subtle text-xs">{tag.documents.length}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
