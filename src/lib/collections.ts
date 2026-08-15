import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Shared query helpers so every page filters and sorts identically.
 *
 * Drafts are visible while running `astro dev` and excluded from production
 * builds — you can preview work in progress locally without it leaking.
 */

type Writing = CollectionEntry<'writing'>;
type Flying = CollectionEntry<'flying'>;

const isPublished = (entry: { data: { draft: boolean } }) =>
  import.meta.env.PROD ? !entry.data.draft : true;

const byNewest = (a: { data: { pubDate: Date } }, b: { data: { pubDate: Date } }) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

export async function getWriting(): Promise<Writing[]> {
  const entries = await getCollection('writing', isPublished);
  return entries.sort(byNewest);
}

export async function getFlying(): Promise<Flying[]> {
  const entries = await getCollection('flying', isPublished);
  return entries.sort(byNewest);
}

/** Featured entries first, then newest. Used on the homepage. */
export function featuredFirst<T extends { data: { featured: boolean; pubDate: Date } }>(
  entries: T[]
): T[] {
  return [...entries].sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return byNewest(a, b);
  });
}

/** Every distinct tag across the writing collection, alphabetised. */
export function collectTags(entries: Writing[]): string[] {
  const tags = new Set<string>();
  entries.forEach((entry) => entry.data.tags.forEach((tag) => tags.add(tag)));
  return [...tags].sort((a, b) => a.localeCompare(b));
}
