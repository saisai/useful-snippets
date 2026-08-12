'use client';

import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const OPTIONS = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
] as const;

/**
 * Three-state theme switcher rendered as a radio group so it is operable and
 * announced correctly with a keyboard or screen reader.
 */
export function ThemeToggle() {
  // `theme` is undefined until the provider has read the stored preference,
  // which keeps the server and the first client render identical.
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="border-line bg-surface flex items-center gap-0.5 rounded-full border p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const checked = theme === value;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setTheme(value)}
            className={cn(
              'flex size-6 items-center justify-center rounded-full transition-colors',
              checked ? 'bg-canvas text-ink shadow-xs' : 'text-ink-subtle hover:text-ink',
            )}
          >
            <Icon className="size-3.5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
