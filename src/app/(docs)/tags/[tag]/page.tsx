import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findTag, getTags } from '@/lib/content/store';
import { absoluteUrl } from '@/lib/site';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { DocumentCard } from '@/components/content/DocumentCard';

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams(): Promise<Array<{ tag: string }>> {
  const tags = await getTags();
  return tags.map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = await findTag(slug);
  if (!tag) return {};

  const title = `#${tag.label}`;
  const description = `${tag.documents.length} ${
    tag.documents.length === 1 ? 'note' : 'notes'
  } tagged “${tag.label}”.`;

  return {
    title,
    description,
    alternates: { canonical: tag.href },
    openGraph: { type: 'website', title, description, url: absoluteUrl(tag.href) },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag: slug } = await params;
  const tag = await findTag(slug);
  if (!tag) notFound();

  return (
    <div className="max-w-4xl">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tags', href: '/tags' },
          { label: `#${tag.label}` },
        ]}
      />

      <h1 className="text-ink mt-3 font-mono text-3xl font-semibold tracking-tight">
        #{tag.label}
      </h1>
      <p className="text-ink-muted mt-2 text-base">
        {tag.documents.length} {tag.documents.length === 1 ? 'note' : 'notes'} tagged with this
        keyword.
      </p>

      <hr className="border-line my-6" />

      <ul className="grid gap-3 sm:grid-cols-2">
        {tag.documents.map((document) => (
          <li key={document.href}>
            <DocumentCard document={document} />
          </li>
        ))}
      </ul>
    </div>
  );
}
