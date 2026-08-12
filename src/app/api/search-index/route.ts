import { getSearchEntries } from '@/lib/content/store';

/**
 * The search index is generated at build time and served as a static JSON file.
 * The browser downloads it the first time search is used, then queries it
 * locally with MiniSearch: no search server, no request per keystroke.
 */
export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  const entries = await getSearchEntries();

  return Response.json(entries, {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
