import type { AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { 'data-external'?: string };

/**
 * Links inside Markdown: internal routes use client-side navigation, external
 * ones are marked visually and open in a new tab.
 */
export function MarkdownLink({ href, children, ...props }: Props) {
  if (!href) return <span {...props}>{children}</span>;

  const isExternal = props['data-external'] === 'true';
  const isHash = href.startsWith('#');

  if (isExternal) {
    return (
      <a {...props} href={href} className="markdown-link markdown-link--external">
        {children}
        <ArrowUpRight className="markdown-link__icon" aria-hidden />
      </a>
    );
  }

  if (isHash) {
    return (
      <a {...props} href={href}>
        {children}
      </a>
    );
  }

  return (
    <Link {...props} href={href} className="markdown-link">
      {children}
    </Link>
  );
}
