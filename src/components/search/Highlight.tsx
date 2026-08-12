import { Fragment } from 'react';
import { splitByTerms } from '@/lib/search/client';

/** Renders text with the matched search terms emphasised. */
export function Highlight({ text, terms }: { text: string; terms: string[] }) {
  return (
    <>
      {splitByTerms(text, terms).map((fragment, position) => (
        <Fragment key={`${position}-${fragment.text}`}>
          {fragment.match ? (
            <mark className="bg-accent-soft text-accent rounded-sm px-0.5">{fragment.text}</mark>
          ) : (
            fragment.text
          )}
        </Fragment>
      ))}
    </>
  );
}
