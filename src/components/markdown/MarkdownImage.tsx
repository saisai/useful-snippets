import type { ImgHTMLAttributes } from 'react';

/**
 * Images inside Markdown.
 *
 * A plain `<img>` is used on purpose: Markdown authors do not declare intrinsic
 * dimensions, and remote images would each need to be allow-listed for
 * `next/image`. Lazy loading and async decoding keep the cost low.
 */
export function MarkdownImage({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- see note above.
    <img {...props} alt={alt ?? ''} loading="lazy" decoding="async" className="markdown-image" />
  );
}
