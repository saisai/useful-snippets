'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavGroup } from '@/types/content';
import { Sidebar } from './Sidebar';

/** Sidebar as a drawer for small screens. */
export function MobileNav({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        className="border-line bg-surface text-ink-muted hover:text-ink flex size-8 items-center justify-center rounded-lg border transition-colors lg:hidden"
      >
        <Menu className="size-4" aria-hidden />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" aria-hidden onClick={close} />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            tabIndex={-1}
            className="scrollbar-slim border-line bg-canvas absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col overflow-y-auto border-r p-4 shadow-xl outline-hidden"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-ink text-sm font-semibold">Navigation</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close navigation"
                className="text-ink-subtle hover:bg-surface hover:text-ink rounded-md p-1.5 transition-colors"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <Sidebar groups={groups} onNavigate={close} />
          </div>
        </div>
      ) : null}
    </>
  );
}
