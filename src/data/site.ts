/* ==========================================================================
   SITE CONFIGURATION — single source of truth for personal details.
   --------------------------------------------------------------------------
   Everything a human needs to edit lives in this file. No personal facts
   should be hardcoded into components or pages.

   ⚠️  ITEMS MARKED `TODO` ARE PLACEHOLDERS WRITTEN BY CLAUDE.
       They are informed guesses from the GitHub profile (TravisKool /
       WAO Holdings) and need to be replaced with real details.
   ========================================================================== */

export const site = {
  /** Deployed origin. Drives canonical URLs, sitemap, and RSS. */
  url: 'https://traviskool.github.io',

  name: 'Travis Kool',

  /** Shown in the browser tab and as the SEO title suffix. */
  title: 'Travis Kool',

  /** TODO: your real title. This is the single most important line on the site. */
  role: 'Software Architect & Engineering Lead',

  /** TODO: confirm. Used in the hero as the one-sentence version of you. */
  tagline: 'I build systems that outlast the team that shipped them.',

  /** TODO: 2–3 sentences. Appears under the hero and in search results. */
  intro:
    'Fifteen years building software, the last three leading the people who build it. I care about decoupled, testable design, about automating the work that should never have been manual, and about leaving architecture behind that the next team can actually reason about.',

  /** TODO: your city. Appears in the footer readout. Set to null to hide. */
  location: 'United States',

  /** TODO: IANA timezone for the live clock in the footer readout. */
  timezone: 'America/Denver',

  /** Current employer. Set to null if you would rather not say. */
  company: 'WAO Holdings',

  /** Drives the amber "available" dot in the footer. Set false when not looking. */
  openToOpportunities: true,

  /** TODO: replace with your real address, or delete to drop the contact link. */
  email: 'koolsuccess@gmail.com',

  /** External profiles. Order is preserved in the footer. */
  links: [
    { label: 'GitHub', href: 'https://github.com/TravisKool' },
    // TODO: add your real LinkedIn slug — this is a guess and may 404.
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/traviskool/' },
  ],

  /** Primary navigation. Add or remove freely; the nav renders whatever is here. */
  nav: [
    { label: 'Work', href: '/work/' },
    { label: 'Writing', href: '/writing/' },
    { label: 'Flying', href: '/flying/' },
    { label: 'About', href: '/about/' },
  ],
} as const;

/* --------------------------------------------------------------------------
   CAREER TIMELINE — rendered on /work
   Newest first. `end: null` renders as "Present" with a live amber marker.
   -------------------------------------------------------------------------- */
export type Role = {
  company: string;
  title: string;
  start: string;
  end: string | null;
  summary: string;
  /** 2–4 concrete outcomes. Numbers land harder than adjectives. */
  highlights: string[];
  stack: string[];
};

/** ⚠️ TODO: All roles below are PLACEHOLDER SCAFFOLDING. Replace with real history. */
export const roles: Role[] = [
  {
    company: 'WAO Holdings',
    title: 'Software Architect / Engineering Lead',
    start: '2023',
    end: null,
    summary:
      'Reporting to the CTO. Own architectural direction across the platform, and lead the team that delivers it.',
    highlights: [
      'TODO: an architectural decision you made and what it changed.',
      'TODO: something you automated and the hours or errors it removed.',
      'TODO: how the team grew or improved under you.',
    ],
    stack: ['TODO', 'Add', 'Your', 'Stack'],
  },
  {
    company: 'TODO: Previous Company',
    title: 'Senior Software Engineer',
    start: '2018',
    end: '2023',
    summary: 'TODO: one sentence on scope and what you were accountable for.',
    highlights: [
      'TODO: a system you designed or rescued.',
      'TODO: a measurable improvement.',
    ],
    stack: ['TODO'],
  },
  {
    company: 'TODO: Earlier Company',
    title: 'Software Engineer',
    start: '2011',
    end: '2018',
    summary: 'TODO: where you learned the craft.',
    highlights: ['TODO: an early win worth keeping.'],
    stack: ['TODO'],
  },
];

/* --------------------------------------------------------------------------
   PRINCIPLES — rendered on /about
   Taken from the four brackets in your GitHub bio. These read as genuinely
   yours, so they anchor the About page.
   -------------------------------------------------------------------------- */
export const principles = [
  {
    title: 'Clean code',
    body: 'Code is read far more often than it is written. Clarity is a feature, and it is the one that compounds.',
  },
  {
    title: 'iDesign architecture',
    body: 'Decompose by volatility, not by function. Systems organized around what changes survive the changes.',
  },
  {
    title: 'Decoupled, testable design',
    body: 'If it is hard to test, that is the design telling you something. Testability is a proxy for good boundaries.',
  },
  {
    title: 'A drive to automate',
    body: 'Anything done manually twice is a candidate. The compounding return on removed toil is nearly always underestimated.',
  },
];
