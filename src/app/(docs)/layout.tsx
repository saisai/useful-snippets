import type { ReactNode } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { getNavigation } from '@/lib/content/store';

/**
 * Shell shared by every content page: a persistent sidebar on large screens and
 * a single scrolling column everywhere else.
 */
export default async function DocsLayout({ children }: { children: ReactNode }) {
  const groups = await getNavigation();

  return (
    <div className="mx-auto flex max-w-[100rem] gap-8 px-4">
      <aside className="hidden w-60 shrink-0 lg:block xl:w-64">
        <div className="scrollbar-slim top-header sticky max-h-[calc(100vh-var(--spacing-header))] overflow-y-auto py-8 pr-2">
          <Sidebar groups={groups} />
        </div>
      </aside>

      <div className="min-w-0 flex-1 py-8">{children}</div>
    </div>
  );
}
