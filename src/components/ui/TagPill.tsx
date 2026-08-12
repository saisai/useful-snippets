import Link from 'next/link';
import { slugify } from '@/lib/utils/slug';
import { cn } from '@/lib/utils/cn';

/** Links a tag to its page, rendered as `#tag`. */
export function TagPill({ tag, className }: { tag: string; className?: string }) {
  return (
    <Link
      href={`/tags/${slugify(tag)}`}
      className={cn(
        'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-xs transition-colors',
        className,
      )}
    >
      #{tag}
    </Link>
  );
}
