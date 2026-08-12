'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

const RESET_DELAY_MS = 2000;

async function writeToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for browsers that block the async clipboard API on http origins.
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

/**
 * Copy button injected into every code block.
 *
 * It reads the code from the rendered `<pre>` next to it, which keeps the raw
 * source out of the client payload and guarantees the language label and other
 * chrome are never copied.
 */
export function CopyButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const copy = useCallback(async () => {
    const code = buttonRef.current?.closest('.code-block')?.querySelector('pre')?.textContent ?? '';

    try {
      await writeToClipboard(code);
      setState('copied');
    } catch {
      setState('error');
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setState('idle'), RESET_DELAY_MS);
  }, []);

  const copied = state === 'copied';

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={copy}
      className="code-block__copy"
      aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      <span>{state === 'error' ? 'Failed' : copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
