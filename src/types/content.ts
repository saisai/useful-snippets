/**
 * Shared content types.
 *
 * Markdown files on disk are the single source of truth. Everything in this
 * file describes the normalised shape those files are parsed into before any
 * UI code touches them.
 */

/** Raw frontmatter as authored in a Markdown file. Every field is optional. */
export interface DocumentFrontmatter {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  date?: string;
  updated?: string;
  published?: boolean;
  featured?: boolean;
  author?: string;
  /** Manual override, in minutes, for the estimated reading time. */
  readingTime?: number;
}

/** A reference to the category a document belongs to. */
export interface CategoryRef {
  /** URL segment, e.g. `linux-command`. */
  slug: string;
  /** Human readable label, e.g. `Linux Commands`. */
  label: string;
}

/** Everything known about a document except its Markdown body. */
export interface DocumentMeta {
  /** Route segments, e.g. `['linux', 'ubuntu', 'static-ip']`. */
  slug: string[];
  /** Absolute route, e.g. `/linux/ubuntu/static-ip`. */
  href: string;
  /** Path of the source file relative to the project root. */
  filePath: string;
  title: string;
  description: string;
  category: CategoryRef;
  /** Optional sub-directory label between the category and the file. */
  section: string | null;
  tags: string[];
  /** ISO date the note was created (frontmatter, or file birth time). */
  date: string;
  /** ISO date the note was last changed (frontmatter, or file mtime). */
  updated: string;
  published: boolean;
  featured: boolean;
  author: string | null;
  /** Estimated reading time in minutes, always at least 1. */
  readingTime: number;
  wordCount: number;
  /** `false` when the file has no frontmatter block and metadata was inferred. */
  hasFrontmatter: boolean;
}

/** A document plus its raw Markdown body. */
export interface Document extends DocumentMeta {
  /** Markdown body with the frontmatter block removed. */
  body: string;
}

/** A category with its aggregated documents. */
export interface Category extends CategoryRef {
  description: string;
  /** Name of a Lucide icon, resolved through `categoryIcons`. */
  icon: string | null;
  /** Manual sort weight; lower sorts first. */
  order: number;
  href: string;
  documents: DocumentMeta[];
  /** Most recent `updated` value across the category's documents. */
  updated: string | null;
}

/** A tag with its aggregated documents. */
export interface Tag {
  slug: string;
  label: string;
  href: string;
  documents: DocumentMeta[];
}

/** A single entry in the "On this page" table of contents. */
export interface TocEntry {
  id: string;
  text: string;
  depth: number;
}

/** Sidebar navigation nodes. */
export type NavNode = NavGroup | NavLink;

export interface NavGroup {
  kind: 'group';
  /** Stable identifier used to persist the collapsed state. */
  id: string;
  label: string;
  /** Present when the group maps to a category page. */
  href: string | null;
  children: NavNode[];
}

export interface NavLink {
  kind: 'link';
  id: string;
  label: string;
  href: string;
}

/** Serialisable entry of the client-side search index. */
export interface SearchEntry {
  id: string;
  href: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  tags: string[];
  /** Plain-text excerpt of the body, truncated for index size. */
  content: string;
}
