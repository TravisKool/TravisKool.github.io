/**
 * Generates public/og.png — the social preview card.
 *
 * Run with `npm run og` after changing your name, role, or the accent colour.
 * Uses sharp, which is already a transitive Astro dependency, to rasterise an
 * SVG built from the same design tokens as the site.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Kept in sync with src/data/site.ts and src/styles/tokens.css by hand — this
// script runs outside Astro, so it cannot import the TypeScript module.
const NAME = 'Travis Kool';
const ROLE = 'Backend Architect & Engineering Leader';
const TAGLINE = 'I build systems that outlast\nthe team that shipped them.';

const PAPER = '#fbfaf7';
const INK = '#16181c';
const MUTED = '#565c65';
const ACCENT = '#0f6a60';
const RULE = '#e4e1da';

/** SVG is XML — any of these characters in your name or role breaks the parse. */
const esc = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const lines = TAGLINE.split('\n');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>

  <!-- Faint vertical grid, matching the site's hero backdrop -->
  <g stroke="${RULE}" stroke-width="1" opacity="0.75">
    ${Array.from({ length: 11 }, (_, i) => {
      const x = 100 * (i + 1);
      return `<line x1="${x}" y1="0" x2="${x}" y2="380"/>`;
    }).join('\n    ')}
  </g>

  <!-- Accent mark, rotated square -->
  <rect x="72" y="70" width="18" height="18" fill="${ACCENT}"
        transform="rotate(45 81 79)"/>

  <text x="110" y="86" font-family="JetBrains Mono, monospace" font-size="20"
        letter-spacing="3" fill="${INK}" font-weight="600">${esc(NAME.toUpperCase())}</text>

  ${lines
    .map(
      (line, i) =>
        `<text x="72" y="${268 + i * 76}" font-family="Newsreader, Georgia, serif"
        font-size="68" fill="${INK}" letter-spacing="-1.5">${esc(line)}</text>`
    )
    .join('\n  ')}

  <line x1="72" y1="482" x2="1128" y2="482" stroke="${RULE}" stroke-width="1"/>

  <text x="72" y="524" font-family="JetBrains Mono, monospace" font-size="20"
        letter-spacing="3" fill="${MUTED}">${esc(ROLE.toUpperCase())}</text>
</svg>
`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(join(root, 'public', 'og.png'), png);
console.log('✓ public/og.png written (1200×630)');
