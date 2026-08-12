import type { MetadataRoute } from 'next';
import { getContentIndex } from '@/lib/content/store';
import { absoluteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const index = await getContentIndex();
  const now = new Date();

  return [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'daily', priority: 1 },
    {
      url: absoluteUrl('/categories'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    { url: absoluteUrl('/tags'), lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    ...index.categories.map((category) => ({
      url: absoluteUrl(category.href),
      lastModified: category.updated ? new Date(category.updated) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...index.tags.map((tag) => ({
      url: absoluteUrl(tag.href),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    })),
    ...index.documents.map((document) => ({
      url: absoluteUrl(document.href),
      lastModified: new Date(document.updated),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
