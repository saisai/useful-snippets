import Link from 'next/link';
import { Library } from 'lucide-react';
import { getNavigation } from '@/lib/content/store';
import { site } from '@/lib/site';
import { MobileNav } from '@/components/navigation/MobileNav';
import { SearchTrigger } from '@/components/search/SearchTrigger';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { GitHubIcon } from '@/components/ui/GitHubIcon';

const LINKS = [
  { href: '/categories', label: 'Categories' },
  { href: '/tags', label: 'Tags' },
];

export async function Header() {
  const groups = await getNavigation();

  return (
    <header className="border-line bg-canvas/85 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="h-header mx-auto flex max-w-[100rem] items-center gap-3 px-4">
        <MobileNav groups={groups} />

        <Link
          href="/"
          className="text-ink hover:text-accent flex shrink-0 items-center gap-2 text-sm font-semibold transition-colors"
        >
          <Library className="text-accent size-4" aria-hidden />
          <span className="truncate">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="ml-2 hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-muted hover:bg-surface hover:text-ink rounded-md px-2 py-1 text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchTrigger />
          <ThemeToggle />

          {site.github ? (
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View source on GitHub"
              className="border-line bg-surface text-ink-muted hover:text-ink flex size-8 items-center justify-center rounded-lg border transition-colors"
            >
              <GitHubIcon className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
