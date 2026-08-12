'use client';

import type { ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

/**
 * Light / dark / system themes. `next-themes` writes the class on <html> before
 * paint, so there is no flash of the wrong theme on first load, and the choice
 * is persisted in localStorage.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
