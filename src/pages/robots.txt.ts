import type { APIRoute } from 'astro';
import { site } from '../data/site';

/**
 * Generated rather than dropped in public/ so the sitemap URL comes from
 * `site.url` and cannot drift if the domain ever changes.
 */
export const GET: APIRoute = ({ site: configured }) => {
  const origin = (configured ?? new URL(site.url)).href.replace(/\/$/, '');

  return new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${origin}/sitemap-index.xml`, ''].join(
      '\n'
    ),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
};
