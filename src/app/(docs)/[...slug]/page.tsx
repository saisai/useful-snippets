import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { renderMarkdown } from '@/lib/markdown/render';
import {
  findCategory,
  findDocumentBySlug,
  getContentIndex,
  getDocumentSiblings,
  getRelatedDocuments,
} from '@/lib/content/store';
import { absoluteUrl } from '@/lib/site';
import { CategoryView } from '@/components/views/CategoryView';
import { DocumentView } from '@/components/views/DocumentView';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * Every Markdown file and every category directory becomes a static page.
 * Adding a file to the content tree is all it takes to publish a new page.
 *
 * `dynamicParams` is left at its default so a file added after the build is
 * still rendered on demand instead of 404ing, which is what keeps the write-and-
 * refresh loop instant in development.
 */
export async function generateStaticParams(): Promise<Array<{ slug: string[] }>> {
  const index = await getContentIndex();

  return [
    ...index.categories.map((category) => ({ slug: [category.slug] })),
    ...index.documents.map((document) => ({ slug: document.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug.length === 1) {
    const category = await findCategory(slug[0] as string);
    if (!category) return {};

    return {
      title: category.label,
      description: category.description,
      alternates: { canonical: category.href },
      openGraph: {
        type: 'website',
        title: category.label,
        description: category.description,
        url: absoluteUrl(category.href),
      },
      twitter: {
        card: 'summary_large_image',
        title: category.label,
        description: category.description,
      },
    };
  }

  const document = await findDocumentBySlug(slug);
  if (!document) return {};

  return {
    title: document.title,
    description: document.description,
    keywords: document.tags.length > 0 ? document.tags : undefined,
    authors: document.author ? [{ name: document.author }] : undefined,
    alternates: { canonical: document.href },
    openGraph: {
      type: 'article',
      title: document.title,
      description: document.description,
      url: absoluteUrl(document.href),
      publishedTime: document.date,
      modifiedTime: document.updated,
      tags: document.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: document.title,
      description: document.description,
    },
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug.length === 1) {
    const category = await findCategory(slug[0] as string);
    if (!category) notFound();
    return <CategoryView category={category} />;
  }

  const [document, index] = await Promise.all([findDocumentBySlug(slug), getContentIndex()]);
  if (!document) notFound();

  const [{ content, toc }, siblings, related] = await Promise.all([
    renderMarkdown(document.body, {
      documentSlug: document.slug,
      knownRoutes: new Set(index.byHref.keys()),
    }),
    getDocumentSiblings(document.href),
    getRelatedDocuments(document),
  ]);

  return (
    <DocumentView
      document={document}
      content={content}
      toc={toc}
      siblings={siblings}
      related={related}
    />
  );
}
