import {
  Boxes,
  BrainCircuit,
  Cloud,
  Code2,
  Container,
  Database,
  FileText,
  GitBranch,
  KeyRound,
  Layers,
  MonitorCog,
  Network,
  Server,
  ShieldCheck,
  SquareTerminal,
  Terminal,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Icons available to `content/categories.json` through the `icon` field.
 * Keeping this an explicit map means only the icons in use are bundled.
 */
const ICONS: Record<string, LucideIcon> = {
  ai: BrainCircuit,
  cloud: Cloud,
  code: Code2,
  database: Database,
  docker: Container,
  git: GitBranch,
  kubernetes: Boxes,
  layers: Layers,
  linux: Terminal,
  network: Network,
  notes: FileText,
  security: ShieldCheck,
  server: Server,
  shell: SquareTerminal,
  ssh: KeyRound,
  tools: Wrench,
  windows: MonitorCog,
};

export function CategoryIcon({ name, className }: { name: string | null; className?: string }) {
  const Icon = (name && ICONS[name]) || FileText;
  return <Icon className={cn('size-4', className)} aria-hidden />;
}
