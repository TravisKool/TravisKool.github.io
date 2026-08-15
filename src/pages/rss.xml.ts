import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { getWriting, getFlying } from '../lib/collections';

/**
 * One combined feed covering both collections — a reader subscribing to a
 * personal site wants the whole person, not just the engineering half.
 */
export const GET: APIRoute = async (context) => {
  const [writing, flying] = await Promise.all([getWriting(), getFlying()]);

  const items = [
    ...writing.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: `/writing/${entry.id}/`,
      categories: [entry.data.kind, ...entry.data.tags],
    })),
    ...flying.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: `/flying/${entry.id}/`,
      categories: ['flying'],
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${site.name} — ${site.role}`,
    description: site.intro,
    site: context.site ?? site.url,
    items,
    customData: '<language>en-us</language>',
  });
};
