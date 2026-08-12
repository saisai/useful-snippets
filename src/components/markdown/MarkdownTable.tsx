import type { TableHTMLAttributes } from 'react';

/** Wraps tables so wide command references scroll instead of breaking the layout. */
export function MarkdownTable(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="table-wrapper" role="region" aria-label="Table" tabIndex={0}>
      <table {...props} />
    </div>
  );
}
