'use client';

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { NavGroup, NavNode } from '@/types/content';
import { cn } from '@/lib/utils/cn';
import { readKey, subscribeToKey, writeKey } from '@/lib/utils/client-store';

const STORAGE_KEY = 'kb:sidebar:groups';

type Overrides = Record<string, boolean>;

function containsHref(node: NavNode, href: string): boolean {
  if (node.kind === 'link') return node.href === href;
  if (node.href === href) return true;
  return node.children.some((child) => containsHref(child, href));
}

function parseOverrides(raw: string | null): Overrides {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? (parsed as Overrides) : {};
  } catch {
    return {};
  }
}

const subscribe = subscribeToKey(STORAGE_KEY);
const readSnapshot = () => readKey(STORAGE_KEY);
const readServerSnapshot = () => null;

interface TreeProps {
  nodes: NavNode[];
  depth: number;
  pathname: string;
  isOpen: (node: NavGroup) => boolean;
  toggle: (id: string) => void;
}

function NavTree({ nodes, depth, pathname, isOpen, toggle }: TreeProps) {
  return (
    <ul className={cn(depth > 0 && 'border-line ml-3 border-l pl-2')}>
      {nodes.map((node) => {
        if (node.kind === 'link') {
          const active = node.href === pathname;

          return (
            <li key={node.id}>
              <Link
                href={node.href}
                aria-current={active ? 'page' : undefined}
                data-active={active || undefined}
                className={cn(
                  'block rounded-md px-2 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-accent-soft text-accent font-medium'
                    : 'text-ink-muted hover:bg-surface hover:text-ink',
                )}
              >
                {node.label}
              </Link>
            </li>
          );
        }

        const open = isOpen(node);
        const panelId = `nav-${node.id.replace(/[^\w-]/g, '-')}`;
        const count = countLinks(node);

        return (
          <li key={node.id} className={depth === 0 ? 'mt-1' : undefined}>
            <button
              type="button"
              onClick={() => toggle(node.id)}
              aria-expanded={open}
              aria-controls={panelId}
              className={cn(
                'hover:bg-surface flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors',
                depth === 0
                  ? 'text-ink text-xs font-semibold tracking-wide uppercase'
                  : 'text-ink-muted text-sm font-medium',
              )}
            >
              <ChevronRight
                className={cn(
                  'text-ink-subtle size-3.5 shrink-0 transition-transform',
                  open && 'rotate-90',
                )}
                aria-hidden
              />
              <span className="flex-1 truncate">{node.label}</span>
              <span className="text-ink-subtle text-[0.6875rem] font-normal">{count}</span>
            </button>

            <div id={panelId} hidden={!open}>
              {node.href ? (
                <ul className="border-line ml-3 border-l pl-2">
                  <li>
                    <Link
                      href={node.href}
                      aria-current={node.href === pathname ? 'page' : undefined}
                      className={cn(
                        'block rounded-md px-2 py-1.5 text-sm transition-colors',
                        node.href === pathname
                          ? 'bg-accent-soft text-accent font-medium'
                          : 'text-ink-subtle hover:bg-surface hover:text-ink',
                      )}
                    >
                      Overview
                    </Link>
                  </li>
                </ul>
              ) : null}
              <NavTree
                nodes={node.children}
                depth={depth + 1}
                pathname={pathname}
                isOpen={isOpen}
                toggle={toggle}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function countLinks(node: NavNode): number {
  if (node.kind === 'link') return 1;
  return node.children.reduce((total, child) => total + countLinks(child), 0);
}

/**
 * Sidebar generated from the content directory structure.
 *
 * Groups containing the current page start expanded; anything the reader
 * expands or collapses is remembered in localStorage.
 */
export function Sidebar({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  const stored = useSyncExternalStore(subscribe, readSnapshot, readServerSnapshot);
  const overrides = useMemo(() => parseOverrides(stored), [stored]);

  const toggle = useCallback(
    (id: string) => {
      const group = findGroup(groups, id);
      const fallback = group ? containsHref(group, pathname) : false;
      const current = parseOverrides(readKey(STORAGE_KEY));

      writeKey(STORAGE_KEY, JSON.stringify({ ...current, [id]: !(current[id] ?? fallback) }));
    },
    [groups, pathname],
  );

  const isOpen = useCallback(
    (group: NavGroup) => overrides[group.id] ?? containsHref(group, pathname),
    [overrides, pathname],
  );

  // Keep the current page visible when the sidebar is taller than the viewport.
  useEffect(() => {
    navRef.current?.querySelector('[data-active]')?.scrollIntoView({ block: 'nearest' });
  }, [pathname]);

  // Selecting a page closes the mobile drawer; expanding a group does not.
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).closest('a')) onNavigate?.();
    },
    [onNavigate],
  );

  return (
    <nav ref={navRef} aria-label="Documentation" onClick={handleClick}>
      <p className="text-ink-subtle px-2 pb-2 text-xs font-semibold tracking-wide uppercase">
        Documentation
      </p>
      <NavTree nodes={groups} depth={0} pathname={pathname} isOpen={isOpen} toggle={toggle} />
    </nav>
  );
}

function findGroup(nodes: NavNode[], id: string): NavGroup | null {
  for (const node of nodes) {
    if (node.kind !== 'group') continue;
    if (node.id === id) return node;
    const nested = findGroup(node.children, id);
    if (nested) return nested;
  }
  return null;
}
