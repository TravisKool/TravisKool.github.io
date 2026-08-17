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
    /** Wing make and model, e.g. "Ozone Zeno 2". Renders as the kicker. */
    wing: z.string().optional(),
    /** Launch site, e.g. "Chelan Butte". */
    site: z.string().optional(),
    /** Free-distance or task distance in kilometres. */
    distance: z.number().optional(),
    /** Airtime in hours, e.g. 3.5. */
    airtime: z.number().optional(),
    /** Max altitude in metres, matching the units used by vol.flights. */
    maxAltitude: z.number().optional(),
    /** Conditions, e.g. "Strong thermals, 1200 fpm climbs". */
    conditions: z.string().optional(),
    /**
     * What sort of entry this is — drives the mono kicker, the way `kind` does
     * on the writing collection.
     *
     * Not every entry in this collection is one flight. A competition or a
     * fly-in wrap-up covers a week, and a trip covers months; labelling those
     * with a wing name (the old behaviour) told the reader nothing about what
     * they were about to read.
     */
    kind: z
      .enum([
        'xc',
        'competition',
        'fly-in',
        'trip',
        'siv',
        'local',
        'hike-and-fly',
        'acro',
      ])
      .default('xc'),
    /** Link to the flight on XContest, vol.flights, etc. */
    trackLog: z.url().optional(),
  }),
});

export const collections = { writing, flying };
