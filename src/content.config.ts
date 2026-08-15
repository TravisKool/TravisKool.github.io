import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* ==========================================================================
   CONTENT COLLECTIONS
   --------------------------------------------------------------------------
   Two collections, deliberately separate rather than one collection split by
   tag: they have genuinely different shapes. Flight entries carry aircraft
   and route metadata that would be dead weight on an engineering post.

   The schemas are strict on purpose. A typo in frontmatter should fail the
   build, not ship a broken page.
   ========================================================================== */

/** Fields common to everything that renders as an article. */
const base = {
  title: z.string().max(120),
  /** Used in cards, meta description, and RSS. Keep it to one sentence. */
  description: z.string().max(240),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  /** Hides the entry from indexes and feeds but still builds the page. */
  draft: z.boolean().default(false),
  /** Pins an entry to the top of its index and the homepage. */
  featured: z.boolean().default(false),
};

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    ...base,
    tags: z.array(z.string()).default([]),
    /** Drives the mono kicker above the title. */
    kind: z
      .enum(['essay', 'postmortem', 'note', 'case-study'])
      .default('essay'),
  }),
});

const flying = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/flying' }),
  schema: z.object({
    ...base,
    /** e.g. "Cessna 172S" — rendered in the technical readout. */
    aircraft: z.string().optional(),
    /** e.g. ["KAPA", "KASE"] — rendered as KAPA → KASE. */
    route: z.array(z.string()).default([]),
    /** Hobbs or tach time for the flight. */
    hours: z.number().optional(),
    conditions: z.string().optional(),
  }),
});

export const collections = { writing, flying };
