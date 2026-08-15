/* ==========================================================================
   SITE CONFIGURATION — single source of truth for personal details.
   --------------------------------------------------------------------------
   Everything a human needs to edit lives in this file. No personal facts
   should be hardcoded into components or pages.

   Items marked `TODO` still need Travis's input. Everything else was sourced
   from the GitHub profile, LinkedIn, and the XC scoring sites.
   ========================================================================== */

export const site = {
  /** Deployed origin. Drives canonical URLs, sitemap, and RSS. */
  url: 'https://traviskool.github.io',

  name: 'Travis Kool',

  title: 'Travis Kool',

  /** Phrasing taken from your own LinkedIn summary. */
  role: 'Backend Architect & Engineering Leader',

  /** The one-sentence version of you, in the hero. */
  tagline: 'I build systems that outlast the team that shipped them.',

  /** Appears under the hero and as the default meta description. */
  intro:
    'Backend architect and engineering leader with over fifteen years building software. I care about decoupled, testable design, about automating the work that should never have been manual, and about leaving architecture behind that the next team can actually reason about.',

  location: 'Carson City, Nevada',

  timezone: 'America/Los_Angeles',

  /**
   * ⚠️ CONFLICT — needs your call.
   * LinkedIn currently reads "Independent"; your GitHub profile says
   * "WAO Holdings". Set this to whichever is true. `null` renders as
   * "Independent" in the hero stat.
   */
  company: 'WAO Holdings',

  /** Drives the amber "available" dot in the footer. Set false when not looking. */
  openToOpportunities: true,

  /**
   * Contact form endpoint.
   *
   * ⚠️ SETUP REQUIRED — the form is inert until you do this:
   *   1. Sign up free at https://formspree.io
   *   2. Create a form; you get an ID like `xbldgwvz`
   *   3. Paste the full endpoint URL below
   *
   * Free tier is 50 submissions/month, no backend, no database. Submissions
   * are emailed to you — your address is never exposed in the page source.
   * Set to null to hide the form entirely.
   */
  formEndpoint: 'https://formspree.io/f/TODO_YOUR_FORM_ID',

  /**
   * Deliberately NOT published on the site — a public mailto is a spam magnet.
   * The contact form is the only inbound channel.
   */
  email: null as string | null,

  /** External profiles. Order is preserved in the footer. */
  links: [
    { label: 'GitHub', href: 'https://github.com/TravisKool' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/traviskool' },
  ],

  /** Primary navigation. */
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
  location?: string;
  start: string;
  end: string | null;
  summary: string;
  /** 2–4 concrete outcomes. Numbers land harder than adjectives. */
  highlights: string[];
  stack: string[];
};

/**
 * ⚠️ TODO: LinkedIn did not expose your job titles and date ranges to an
 * automated fetch, so the entries below are SCAFFOLDING built from the
 * signals that were visible (locations, certifications, tech stack).
 * Replace the TODO lines with your real history.
 *
 * Locations visible on your profile, which may help you reconstruct these:
 * San Luis Obispo CA · Marina CA · Santa Cruz CA · Kalispell MT · Carson City NV
 */
export const roles: Role[] = [
  {
    company: 'WAO Holdings',
    title: 'Backend Architect & Engineering Leader',
    location: 'Carson City, NV',
    start: 'TODO',
    end: null,
    summary:
      'TODO: one sentence on scope — what you own architecturally and who you lead.',
    highlights: [
      'TODO: an architectural decision you made and what it changed.',
      'TODO: something you automated and the hours or errors it removed.',
      'TODO: how the team grew or improved under you.',
    ],
    stack: ['C#', '.NET', 'ASP.NET Core', 'SQL Server'],
  },
  {
    company: 'TODO: Previous Company',
    title: 'Senior Software Engineer',
    start: 'TODO',
    end: 'TODO',
    summary: 'TODO: scope and what you were accountable for.',
    highlights: [
      'TODO: a system you designed or rescued.',
      'TODO: a measurable improvement.',
    ],
    stack: ['C#', '.NET', 'Angular'],
  },
  {
    company: 'TODO: Earlier Company',
    title: 'Software Engineer',
    start: '2011',
    end: 'TODO',
    summary: 'TODO: where you learned the craft.',
    highlights: ['TODO: an early win worth keeping.'],
    stack: ['C#', 'SQL Server'],
  },
];

/* --------------------------------------------------------------------------
   EDUCATION & CERTIFICATIONS — rendered on /work
   -------------------------------------------------------------------------- */
export const education = {
  school: 'Sonoma State University',
  years: '2005 — 2010',
  focus: 'Computer security and web development',
};

export const certifications = [
  { name: 'Certified Scrum Master', issuer: 'Scrum Alliance', year: '2014' },
  { name: 'C#: Design Patterns', issuer: 'LinkedIn Learning', year: '2017' },
  {
    name: 'Angular & ASP.NET Core with Authentication',
    issuer: 'LinkedIn Learning',
    year: '2017',
  },
  { name: 'SQL Server Performance Tuning', issuer: 'Brent Ozar', year: '' },
];

/* --------------------------------------------------------------------------
   PRINCIPLES — rendered on / and /about
   Taken from the four brackets in your GitHub bio.
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

/* ==========================================================================
   PARAGLIDING
   ========================================================================== */

/** Public XC and competition profiles — rendered on /flying. */
export const flyingProfiles = [
  { label: 'XContest', href: 'https://www.xcontest.org/usa/pilots/detail:TravisKool' },
  { label: 'Paragliding Stats', href: 'https://paraglidingstats.com/pilot-94880/Travis-Kool' },
  { label: 'vol.flights', href: 'https://vol.flights/traviskool' },
];

/**
 * Competition record — rendered on /flying.
 * Sourced from paraglidingstats.com, August 2026. Update after each comp.
 */
export const competitions = [
  { name: 'Canadian Paragliding XC National Championship', date: 'Jul 2026' },
  { name: 'US Open of Paragliding', date: 'Jun 2026' },
  { name: 'Ozone Chelan Open', date: 'Jun 2026' },
  { name: 'Red Rocks Wide Open', date: 'Sep 2025' },
];

/**
 * Headline pilot stats. Sourced from paraglidingstats.com, August 2026.
 * ⚠️ TODO: add total airtime, total XC distance, and your best flight —
 * those were not exposed to an automated fetch. They are the numbers a
 * reader will care about most.
 */
export const pilotStats = [
  { label: 'World ranking', value: '#1015' },
  { label: 'Competitions', value: '4' },
  { label: 'Tasks flown', value: '14' },
  { label: 'Pilots beaten', value: '161' },
];
