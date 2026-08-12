import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Shared presentation for "nothing here" states. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-line flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? <div className="text-ink-subtle">{icon}</div> : null}
      <div className="space-y-1">
        <p className="text-ink font-medium">{title}</p>
        {description ? <p className="text-ink-muted text-sm">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
