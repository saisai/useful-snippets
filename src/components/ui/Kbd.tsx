import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/** Small keyboard key indicator. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'border-line bg-surface text-ink-subtle inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[0.6875rem] font-medium',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
