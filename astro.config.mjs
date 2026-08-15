// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  /**
   * Deployed at the user root (traviskool.github.io), so no `base` is needed.
   * If you ever move this to a project repo, add `base: '/repo-name'` here and
   * every internal link will follow automatically.
   */
  site: 'https://traviskool.github.io',

  integrations: [mdx(), sitemap()],

  // Trailing slashes are emitted consistently so canonical URLs and internal
  // links never disagree — a common source of duplicate-content warnings.
  trailingSlash: 'always',

  build: {
    format: 'directory',
  },

  markdown: {
    shikiConfig: {
      // Two themes so fenced code follows the site's light/dark setting.
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: true,
    },
  },
});
