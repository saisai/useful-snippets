'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useTheme } from 'next-themes';

function toSource(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children))
    return children.filter((child) => typeof child === 'string').join('');
  return '';
}

/**
 * Renders ```mermaid fences as diagrams.
 *
 * Mermaid is large, so it is imported dynamically and only ever downloaded by
 * readers who open a page that actually contains a diagram.
 */
export function MermaidDiagram({ children }: { children?: ReactNode }) {
  const source = toSource(children).trim();
  const { resolvedTheme } = useTheme();
  const rawId = useId();
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          fontFamily: 'inherit',
        });
        const result = await mermaid.render(id, source);
        if (!cancelled) {
          setSvg(result.svg);
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    if (source) void render();

    return () => {
      cancelled = true;
    };
  }, [id, source, resolvedTheme]);

  if (failed) {
    return (
      <div className="mermaid mermaid--failed">
        <p className="mermaid__notice">This diagram could not be rendered. Source:</p>
        <pre>
          <code>{source}</code>
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div ref={containerRef} className="mermaid mermaid--loading">
        <span className="mermaid__loading">Rendering diagram…</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid"
      role="img"
      aria-label="Diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
