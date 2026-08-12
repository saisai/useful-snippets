import type { ReactNode } from 'react';
import {
  Info,
  Lightbulb,
  MessageSquareWarning,
  OctagonAlert,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  note: Info,
  tip: Lightbulb,
  important: MessageSquareWarning,
  warning: TriangleAlert,
  caution: OctagonAlert,
};

/** Icon for a GitHub style alert. The alert type arrives as the element's text. */
export function CalloutIcon({ children }: { children?: ReactNode }) {
  const type = typeof children === 'string' ? children : 'note';
  const Icon = ICONS[type] ?? Info;

  return <Icon className="callout__icon" aria-hidden />;
}
