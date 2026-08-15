# AGENTS.md

Guidance for AI coding agents working in this repository.
(`CLAUDE.md` is a symlink to this file — edit this one.)

## What this is

Travis Kool's personal portfolio and writing site. A static Astro site, no
database, no server, deployed to GitHub Pages. Its audience is recruiters,
hiring managers, and peers — so polish, correctness, and load speed matter more
than feature count.

## Commands

```bash
npm run dev       # dev server at http://localhost:4321 (drafts visible)
npm run build     # production build to dist/ (drafts excluded)
npm run preview   # serve dist/ locally — always check here before pushing
npm run og        # regenerate public/og.png after changing name/role/tagline
```

Astro 7 supports a background dev server: `npx astro dev --background`, managed
with `astro dev stop`, `astro dev status`, and `astro dev logs`. Prefer this
over a blocking foreground process.

## Architecture

```
src/
  data/site.ts          Single source of truth for ALL personal details
  content.config.ts     Zod schemas for the two content collections
  content/writing/      Essays, postmortems, notes  (Markdown/MDX)
  content/flying/       Flight entries              (Markdown/MDX)
  lib/collections.ts    Shared query helpers — draft filtering, sorting
  styles/tokens.css     Every colour, size, and font in the system
  styles/global.css     Reset, base typography, layout + signature elements
  components/           Presentational only, no data fetching
  layouts/              Base (chrome) and Article (long-form)
  pages/                Routes
scripts/make-og.mjs     Generates the social card
```

### Rules that matter

1. **Never hardcode personal details in a component or page.** Name, role,
   links, employer, timeline — all of it lives in `src/data/site.ts`.
2. **Never hardcode a colour, font, or spacing value.** Use the custom
   properties from `tokens.css`. If a value is genuinely missing, add a token
   rather than a literal.
3. **Query content through `src/lib/collections.ts`**, not `getCollection`
   directly. That is what keeps draft filtering consistent across pages.
4. **Component styles stay in the component's `<style>` block.** Astro scopes
   them automatically. Only genuinely global concerns belong in `global.css`.
5. **Content is data, not markup.** If something belongs in frontmatter, put it
   in frontmatter and extend the Zod schema — do not write it inline in the
   body.

## The design system

The look is deliberate and has a name: **Editorial-Technical**. It pairs the
authority of editorial print with the precision of instrumentation.

- **Newsreader** (serif) — headlines, article body, anything carrying authority
- **Inter** (sans) — UI and supporting copy; never the star
- **JetBrains Mono** — dates, tags, labels, routes, numbers. Always uppercase
  with `--tracking-label` letterspacing. This is the single most
  identity-defining detail on the site.

Four signature elements, defined in `global.css`:

1. `.label` — the mono micro-label
2. `SectionRule` — mono label + hairline running to the end of the line
3. `.grid-backdrop` — faint vertical hairlines behind hero sections only
4. `[data-reveal]` — the scroll reveal

**Motion budget is deliberately small**: page transitions, scroll reveals, hover
states. Nothing else. Every animation must be gated behind
`prefers-reduced-motion`. If you are adding a fifth kind of motion, reconsider.

**Accent colour discipline**: `--accent` (teal) is for interaction and emphasis.
`--signal` (amber) means "live / current / available" and appears in exactly
three places — the footer availability dot, the current role marker, and
featured flags. Do not spend it elsewhere.

## Adding content

Create a Markdown file in `src/content/writing/` or `src/content/flying/`. The
filename becomes the URL slug. Frontmatter is validated at build time — a typo
fails the build rather than shipping broken.

Set `draft: true` while working; it renders in dev and is excluded from
production. Files prefixed `_` are templates — copy them, do not edit in place.

### Flying is paragliding, not general aviation

Travis is a cross-country and competition **paraglider** pilot. The vocabulary
matters and getting it wrong is immediately obvious to any other pilot:

- **wing**, not aircraft or plane
- **launch** / **site** / **LZ**, not airport or runway
- **XC distance in km** is the headline number, not hours
- **airtime**, **cloudbase**, **thermals**, **glide**, **track log**

His public record lives on XContest, paraglidingstats.com, and vol.flights —
linked from `flyingProfiles` in `site.ts`. Competition results and pilot stats
in that file are sourced from those sites and dated; refresh them rather than
estimating.

## Contact

There is **no email address anywhere on the site** — that is deliberate, to
avoid scraping. The only inbound channel is the Formspree-backed
`ContactForm` component, configured via `formEndpoint` in `site.ts`. Do not
reintroduce a `mailto:` link.

## Images

GitHub Pages has a soft 1 GB repo limit, and git history is forever. **Never
commit an unprocessed camera JPEG.** Resize and convert first:

```bash
npx @squoosh/cli --resize '{"width":1600}' --webp auto -d public/photos/ input.jpg
```

Target ~1600px on the long edge and under ~300 KB. Put photos in
`public/photos/` and reference them as `/photos/name.webp`.

## Deployment

Push to `main`. `.github/workflows/deploy.yml` builds and publishes to GitHub
Pages. No manual step. Check the Actions tab if the site does not update.

## Placeholders

`src/data/site.ts` and `src/pages/about.astro` contain `TODO` markers for
details that were guessed at scaffold time and need Travis's real input. When
working on adjacent code, leave them alone unless asked — but flag any you
notice as still outstanding.

## Astro reference

- [Routing and dynamic routes](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [View transitions](https://docs.astro.build/en/guides/view-transitions/)
