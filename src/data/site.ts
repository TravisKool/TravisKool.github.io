/* ==========================================================================
   SITE CONFIGURATION — single source of truth for personal details.
   --------------------------------------------------------------------------
   Everything a human needs to edit lives in this file. No personal facts
   should be hardcoded into components or pages.
   ========================================================================== */

export const site = {
  /** Deployed origin. Drives canonical URLs, sitemap, and RSS. */
  url: 'https://traviskool.github.io',

  name: 'Travis Kool',

  title: 'Travis Kool',

  /** Phrasing taken from your own LinkedIn summary. */
  role: 'Backend Architect & Engineering Leader',

  /**
   * The one-sentence version of you, in the hero.
   *
   * Deliberately "outlast me" rather than "outlast the team that shipped
   * them": the original split the sentence into the builder and the mere
   * shippers, and implied the team did not survive — an odd note given the
   * M&A integration work. Making yourself the thing being outlasted keeps the
   * durability claim and drops the comparison to anyone else.
   */
  tagline: 'I build systems that outlast me.',

  /** Appears under the hero and as the default meta description. */
  intro:
    'Fifteen years building software — the last eight scaling high-stakes fintech infrastructure, and the last four leading the team that built it. Now working independently: building agentic AI systems, and flying cross-country competitions.',

  location: 'Nevada',

  timezone: 'America/Los_Angeles',

  /**
   * Rendered in the hero "Currently" stat.
   *
   * Deliberately "Independent" rather than "Sabbatical": a sabbatical is a
   * break you return from, which frames this period as a gap rather than as
   * work. Promote to a founder/company label only when there is something
   * public to point at.
   */
  status: 'Independent',

  /**
   * Portrait for /about. When this is null the page renders as a single
   * column — deliberately, so the live site never shows an empty placeholder
   * box. Cropped to 4:5, which is the ratio the portrait slot renders at.
   */
  portrait: '/portrait.webp' as string | null,

  /**
   * Drives the footer STATUS readout: true renders "Open to conversations"
   * with the amber signal dot, false renders "Heads down".
   *
   * Deliberately named for conversations, not opportunities. Travis is not
   * looking for a role right now, and this is not a job-seeking signal — it
   * mirrors the line on his LinkedIn profile: happy to talk about agentic
   * engineering, fintech architecture, or flying. Set false when he wants the
   * inbound to stop entirely, not merely when he is not job-hunting.
   */
  openToConversations: true,

  /**
   * There is deliberately NO email address and NO contact form on this site.
   * Anyone who finds this page already has the LinkedIn profile, which is the
   * single inbound channel. Do not reintroduce a mailto link.
   */
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/traviskool' },
    { label: 'GitHub', href: 'https://github.com/TravisKool' },
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
   CURRENTLY — the sabbatical block on the homepage.
   The most distinctive thing about you right now, and the thing that ties the
   engineering and the flying halves of this site together.
   -------------------------------------------------------------------------- */
export const currently = {
  headline: 'Building in Nevada, between competitions.',
  body: [
    'This started as a sabbatical, and it opened with three months in Brazil — three weeks of flying in the north, hiking the Santa Catarina coast, and getting far enough into Portuguese to hold a simple conversation. I came back in May.',
    'Everything since has been the deepest flying season I have had: an SIV clinic, two fly-ins, four competitions across Washington and British Columbia, and a 184 km day out of Golden that reset three personal records in a single flight. The season runs through Mexico in January.',
    'Between trips I am based in Nevada and going deep on agentic programming — building a new application end to end with agents doing the writing and the reviewing. At Retired.com I watched AI take over the writing of code and SQL while contracts, contract review, and PR review stayed stubbornly human. That is the part I care about now: whether autonomous agents can hold precision, decoupling, and long-term quality there under real velocity, rather than quietly trading them away for speed. There will be a post about the application itself.',
    'Mornings are the terminal. Afternoons are outside, or somewhere around 18,000 feet.',
  ],
  facts: [
    { key: 'Since', value: 'Mar 2026' },
    { key: 'Based', value: 'Nevada' },
    { key: 'Focus', value: 'Agentic AI · XC paragliding' },
  ],
};

/* --------------------------------------------------------------------------
   CAREER TIMELINE — rendered on /work
   Grouped by company so multiple positions at one employer read as a single
   tenure with a progression, rather than three disconnected jobs.
   -------------------------------------------------------------------------- */
export type Position = {
  title: string;
  start: string;
  end: string | null;
  /** e.g. "Remote", "Hybrid" */
  arrangement?: string;
  highlights: { label?: string; body: string }[];
};

export type Employer = {
  company: string;
  location?: string;
  /** Total tenure, shown against the company. */
  start: string;
  end: string | null;
  summary?: string;
  positions: Position[];
  stack: string[];
};

export const employers: Employer[] = [
  {
    company: 'Independent',
    location: 'Nevada, US · Brazil',
    start: 'Mar 2026',
    end: null,
    summary:
      'Independent — agentic AI research, building a new application, and competition paragliding. Began as a professional sabbatical in March 2026.',
    positions: [
      {
        title: 'Agentic AI Research & Building',
        start: 'Mar 2026',
        end: null,
        highlights: [
          {
            label: 'Agentic AI',
            body: 'Experimenting with agentic patterns for AI-native systems in which autonomous agents operate as a collaborative engineering team — enforcing precision, decoupling, and long-term quality under aggressive velocity.',
          },
          {
            label: 'Cross-country flying',
            body: 'Advancing XC paragliding with real-time data, tracking software, variometers, and navigation technology. Four competitions and two fly-ins in the 2026 season across Brazil, the western US, and British Columbia.',
          },
          {
            label: 'Building',
            body: 'Now building a new application end to end with agentic tooling — the practical test of the ideas above, rather than another opinion about them. Writeup to come.',
          },
        ],
      },
    ],
    stack: ['Agentic AI', 'Claude Code', 'C#', '.NET'],
  },
  {
    company: 'Retired.com',
    location: 'United States · Remote',
    start: 'May 2018',
    end: 'Mar 2026',
    summary:
      'Seven years and eleven months across three roles, from founding C# engineer to backend architecture lead.',
    positions: [
      {
        title: 'Software Engineering Manager · Backend Architecture Lead',
        start: 'Sep 2023',
        end: 'Mar 2026',
        arrangement: 'Remote',
        highlights: [
          {
            label: 'Engineering leadership',
            body: 'One of four architects and technical leads on the architecture review board, owning backend architecture for my team — guiding engineers through their service contracts, refining them, and presenting them for final review.',
          },
          {
            label: 'Instant Settlement',
            body: 'The largest project of this role. Delivered an in-house double-entry accounting ledger as the platform’s source of truth for balances, demoted the external ledger to an isolated downstream backup, and refactored the surrounding systems and operational workflows onto it. Moving those operations onto asynchronous, decoupled messaging over the platform’s existing Azure Service Bus — with steady tuning alongside it — contributed to trading error rates dropping below 1%.',
          },
          {
            label: 'Limit order trading',
            body: 'Led the team that brought limit orders to the trading platform.',
          },
          {
            label: 'Compliance platform',
            body: 'Led the team behind the custom compliance platform for real-time account locking and fraud prevention.',
          },
          {
            label: 'Acquisition onboarding',
            body: 'Absorbed the acquired Choice (Kingdom Trust), Rocket Dollar, and Shrimpy platforms into the team’s scope, setting architectural direction and standards for the consolidation.',
          },
          {
            label: 'AI-first delivery',
            body: 'Led the team through the company’s AI-first shift, with agents writing code and SQL across the development cycle behind AI linters and reviewers — holding architectural integrity with automated acceptance tests as generation outpaced human review.',
          },
          {
            label: 'Team',
            body: 'Six engineers reporting to me, working alongside two QA engineers, a product manager, and a project manager.',
          },
          {
            label: 'Cross-functional decisions',
            body: 'Worked with product, UX, executives, and other departments to shape decisions on in-flight and upcoming projects — translating between business intent and what the backend could carry.',
          },
          {
            label: 'Operations',
            body: 'Owned end-to-end people operations, production releases, and critical production support for the unified ecosystem — and stayed in the pull request review rotation throughout.',
          },
        ],
      },
      {
        title: 'Technical Lead of Engineering',
        start: 'Apr 2022',
        end: 'Aug 2023',
        arrangement: 'Remote',
        highlights: [
          {
            label: 'Leadership transition',
            body: 'Eased into architectural leadership — contributing solution designs and recommendations in architecture review for a team of senior engineers, while remaining hands-on with code the majority of the time.',
          },
          {
            label: 'Quality gatekeeper',
            body: 'Primary code merger and production releaser, keeping distributed services stable and aligned with organizational standards during rapid scaling.',
          },
        ],
      },
      {
        title: 'Senior Software Engineer',
        start: 'May 2018',
        end: 'Apr 2022',
        arrangement: 'Hybrid',
        highlights: [
          {
            label: 'Founding C# engineer, Bitcoin IRA',
            body: 'Hired as the first C# engineer on the platform, joining behind the solutions architect as a major code contributor across the digital asset trading platform, its core APIs, and the trading engines.',
          },
          {
            label: 'Architectural foundations',
            body: 'Practiced and implemented the iDesign approach working closely under an expert architect, establishing a maintainable backend foundation for the growing platform.',
          },
          {
            label: 'APIs and pipelines',
            body: 'Designed the primary API integrations and established the initial production release pipelines for reliable, automated deployments.',
          },
        ],
      },
    ],
    stack: ['C#', '.NET', 'iDesign', 'Distributed services', 'Fintech', 'Crypto'],
  },
  {
    company: 'MINDBODY, Inc.',
    location: 'San Luis Obispo, CA',
    start: 'Apr 2014',
    end: 'Apr 2018',
    positions: [
      {
        title: 'Staff Software Engineer',
        start: 'Apr 2014',
        end: 'Apr 2018',
        highlights: [
          {
            body: 'Full-stack engineer in fast-paced scrum teams serving the wellness industry, working across complex multi-tiered systems.',
          },
          {
            label: 'Focus areas',
            body: 'Third-party integrations, payment processing, and web applications across the full SDLC.',
          },
          {
            label: 'Practice',
            body: 'Unit and integration testing, design patterns, dependency injection, and micro-services.',
          },
        ],
      },
    ],
    stack: ['C#', '.NET', 'SQL Server', 'Micro-services', 'TFS', 'Git'],
  },
  {
    company: 'Eldridge Products, Inc.',
    location: 'Marina, CA',
    start: 'Sep 2011',
    end: 'Oct 2014',
    positions: [
      {
        title: 'Software Engineer Consultant',
        start: 'Sep 2011',
        end: 'Oct 2014',
        highlights: [
          {
            label: 'Business platform',
            body: 'Built a web application from the ground up covering point of sale, finance, accounting, receiving, inventory management, and quote generation.',
          },
          {
            label: 'Instrumentation',
            body: 'Engineered a multi-threaded temperature compensation Windows application that calibrates flow meters algorithmically.',
          },
        ],
      },
    ],
    stack: ['C#', 'ASP.NET', 'IdentityServer', 'SQLite', 'jQuery'],
  },
  {
    company: 'Infinite Vision, LLC',
    location: 'Santa Cruz, CA',
    start: 'Jan 2011',
    end: 'Apr 2014',
    positions: [
      {
        title: 'Software Engineer Consultant',
        start: 'Jan 2011',
        end: 'Apr 2014',
        highlights: [
          {
            label: 'Medical device industry',
            body: 'Lead software engineer for a road-safety Windows Embedded service now running in over 1,000 EMS vehicles — real-time data streaming, firmware and configuration updates, calibration settings, and high-priority cloud messaging.',
          },
        ],
      },
    ],
    stack: ['C#', '.NET', 'SQLite', 'Windows Embedded'],
  },
  {
    company: 'Torrent Technologies, Inc.',
    location: 'Kalispell, MT',
    start: 'May 2008',
    end: 'Aug 2008',
    positions: [
      {
        title: 'Software Developer Intern',
        start: 'May 2008',
        end: 'Aug 2008',
        highlights: [
          {
            body: 'First exposure to C#.NET and web development, generating reports and linking them into an existing ASP.NET flood insurance application in an agile environment.',
          },
        ],
      },
    ],
    stack: ['C#', 'ASP.NET', 'HTML', 'CSS'],
  },
];

/* --------------------------------------------------------------------------
   EDUCATION & CERTIFICATIONS — rendered on /work
   -------------------------------------------------------------------------- */
export const education = {
  school: 'Sonoma State University',
  years: '2005 — 2010',
  degree: "Bachelor's, Computer Science",
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
   CAREER MILESTONES
   The raw dates the hero stats are computed from. Edit these, never the
   rendered numbers — see src/lib/career.ts.
   -------------------------------------------------------------------------- */
export const milestones = {
  /**
   * Infinite Vision, Jan 2011 — first professional engineering role.
   * The 2008 Torrent Technologies internship is deliberately excluded: it was
   * a four-month intern stint followed by a two-and-a-half year gap, and
   * counting from it would overstate the number.
   */
  careerStart: '2011-01',

  /** Technical Lead of Engineering at Retired.com. */
  leadershipStart: '2022-04',
  /** Sabbatical began, so leadership tenure stopped accruing. */
  leadershipEnd: '2026-03',

  /** Hired as founding C# engineer, Bitcoin IRA. */
  fintechStart: '2018-05',
  fintechEnd: '2026-03',
} as const;

/* --------------------------------------------------------------------------
   PRINCIPLES — rendered on / and /about

   PROVENANCE: written from Travis's own stated positions (Aug 2026), built on
   the four bracketed pillars in his GitHub bio. "A drive to automate" has
   evolved into "AI-first teams" — the same instinct, matured, and grounded in
   having led teams through an AI-first delivery shift at Retired.com.
   -------------------------------------------------------------------------- */
export const principles = [
  {
    title: 'Clean code, especially now',
    body: 'We will read less code as agents write more of it. That makes architecture matter more, not less — an agent maintaining a system needs honest boundaries for the same reasons a person does, and it cannot walk over and ask.',
  },
  {
    title: 'iDesign architecture',
    body: 'Decompose by volatility, not by function. Systems organized around what changes survive the changes.',
  },
  {
    title: 'Decoupled, testable design',
    body: 'If it is hard to test, that is the design telling you something. Testability is also what makes velocity safe: automated verification is the only thing that scales as fast as generation does.',
  },
  {
    title: 'AI-first teams',
    body: 'Code generated by agents and reviewed by agents — given well-defined hooks, boundaries, and roles — can build large platforms that last and scale. Feature-level documentation is part of that scaffolding: it is how an agent knows what it is working on.',
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
 * Career totals. Source: vol.flights, August 2026.
 * Refresh after a big season — everything on /flying reads from here.
 */
export const pilotTotals = [
  { label: 'Flights', value: '131' },
  { label: 'Free distance', value: '4,304', unit: 'km' },
  { label: 'Airtime', value: '254', unit: 'h 36m' },
  { label: 'Score', value: '4,850.5', unit: 'pts' },
];

/** Personal bests. */
export const pilotRecords = [
  { label: 'Best free distance', value: '184', unit: 'km', date: 'Jul 29, 2026' },
  { label: 'Best flat triangle', value: '177', unit: 'km', date: 'Jul 29, 2026' },
  { label: 'Best FAI triangle', value: '98', unit: 'km', date: 'Jun 21, 2026' },
  { label: 'Most airtime', value: '7h 7m', unit: '', date: 'Jul 29, 2026' },
  { label: 'Best score', value: '249.2', unit: 'pts', date: 'Jul 29, 2026' },
  {
    label: 'Max altitude',
    value: '5,834',
    unit: 'm',
    /** ~19,140 ft — the number that lands for a non-metric reader. */
    note: '19,140 ft',
    date: 'Sep 1, 2025',
  },
];

/**
 * The standout flight. Jul 29 2026 set three personal records in one day —
 * best distance, best score, and most airtime — so it gets its own block.
 */
export const bestFlight = {
  date: 'Jul 29, 2026',
  time: '1:15 PM',
  site: 'Mt 7',
  place: 'Golden, British Columbia, Canada',
  routeType: 'Flat triangle',
  facts: [
    { key: 'Free distance', value: '184 km' },
    { key: 'Score', value: '249.2 pts' },
    { key: 'Flight time', value: '7h 7m' },
    { key: 'Avg speed', value: '25.9 km/h' },
    { key: 'Max altitude', value: '3,694 m' },
  ],
  note: 'Three personal records in a single flight — distance, score, and airtime.',
};

/** Typical flight, which gives the records their context. */
export const pilotAverages = [
  { label: 'Avg distance', value: '32 km' },
  { label: 'Avg duration', value: '1h 56m' },
  { label: 'Avg speed', value: '16.2 km/h' },
  { label: 'Avg score', value: '37.0 pts' },
  { label: 'Biggest month', value: 'Jun 2026 · 888 km' },
  { label: 'Biggest year', value: '2026 · 2,476 km' },
];

/** Where the flying happens. */
export const pilotPlaces = {
  sites: 32,
  countries: ['US', 'BR', 'CA', 'CU', 'CO', 'FR'],
  mostFlown: 'Woodrat Mountain',
};

/* --------------------------------------------------------------------------
   THE SEASON — rendered on /flying

   The calendar, past and future. This is the honest answer to "what has he
   been doing all year", and it is the one block on the site that goes stale on
   a schedule: move entries from `seasonAhead` to `season2026` as they happen,
   and drop `tentative` once a trip is booked.

   Deliberately just the calendar. The narrative for an event lives in its
   writeup in src/content/flying/, not here.
   -------------------------------------------------------------------------- */
export type SeasonEntry = {
  /** Rendered as a mono label, so it is written out rather than parsed. */
  dates: string;
  name: string;
  place: string;
  kind: 'Competition' | 'Fly-in' | 'XC' | 'SIV' | 'Local' | 'Hike & fly';
  /** Planned but not committed — renders a TBC marker. */
  tentative?: boolean;
};

export const season2026: SeasonEntry[] = [
  { dates: 'Mar 24 — Apr 5', name: 'Brazil season', place: 'Northern Brazil', kind: 'XC' },
  { dates: 'May 7 — 10', name: 'SIV clinic', place: 'Lake Berryessa, CA', kind: 'SIV' },
  { dates: 'May 16 — 17', name: 'NorCal XC League', place: 'Dunlap, CA', kind: 'Competition' },
  { dates: 'May 18', name: 'Tollhouse', place: 'Tollhouse, CA', kind: 'XC' },
  { dates: 'May 19', name: 'Griswold convergence', place: 'Griswold, CA', kind: 'Hike & fly' },
  { dates: 'May 22', name: 'Whaleback', place: 'Mt Shasta, CA', kind: 'Local' },
  { dates: 'May 23 — Jun 8', name: 'Woodrat Mountain', place: 'Ruch, OR', kind: 'XC' },
  { dates: 'Jun 8 — 13', name: 'Rat Route 238 Fly-In', place: 'Woodrat Mountain, OR', kind: 'Fly-in' },
  { dates: 'Jun 14 — 20', name: 'Ozone Chelan Open', place: 'Chelan, WA', kind: 'Competition' },
  { dates: 'Jun 20 — 27', name: 'Ozone US Open', place: 'Chelan, WA', kind: 'Competition' },
  { dates: 'Jul 3 — 8', name: 'Canadian Open', place: 'Golden, BC', kind: 'Competition' },
  { dates: 'Jul 25 — Aug 2', name: 'Willi XC Challenge', place: 'Golden, BC', kind: 'Competition' },
];

export const seasonAhead: SeasonEntry[] = [
  { dates: 'Aug 29 — 31', name: 'PNW SIV', place: 'Washington', kind: 'SIV' },
  { dates: 'Sep 5 — 7', name: 'NorCal XC League', place: 'Owens Valley, CA', kind: 'Competition' },
  { dates: 'Sep 10 — 14', name: 'Eastern Sierra Fly-In', place: 'California', kind: 'Fly-in' },
  { dates: 'Sep 19 — 26', name: 'Red Rocks Wide Open', place: 'Utah', kind: 'Competition', tentative: true },
  /** Sports-Class Racing Series, Advance edition — the sixth and final stop of
      the 2026 series. Sports class only: EN-C and below, so the GTO 3 is in. */
  { dates: 'Nov 7 — 14', name: 'SRS Advance Edition', place: 'Tapalpa, Mexico', kind: 'Competition' },
  { dates: 'Dec 14 — 19', name: 'Club Peñón', place: 'Valle de Bravo, Mexico', kind: 'Fly-in' },
  { dates: 'Jan 10 — 16, 2027', name: 'Monarca Open', place: 'Valle de Bravo, Mexico', kind: 'Competition' },
];

/**
 * Sits under the "What's ahead" rule.
 *
 * Deliberate: a list of seven booked trips running to January reads as "not
 * available until then", which is not what the calendar means and not a signal
 * worth sending on a site people may read professionally. Plans flex.
 */
export const seasonAheadNote =
  'Plans rather than commitments. The flying calendar has always moved when there was something worth moving it for.';

/** The gear line under the season. Both wings are two-liners. */
export const seasonNote =
  'On a Gin GTO 3 — size L, 6.5 aspect ratio — since demoing one at the Rat Route in June and never giving it back. A step up from the Nova Vortex at 6.1 that I flew through Brazil and the spring.';

/* ==========================================================================
   PHOTOGRAPHY
   --------------------------------------------------------------------------
   Every photo on the site is registered here, never inline in a page. The
   intrinsic `width`/`height` are the real dimensions of the processed file —
   they let the browser reserve space so nothing reflows as photos load. If you
   replace a file, update its numbers too.

   Source files were resized to <=1600px on the long edge, converted to webp
   under 300 KB, and stripped of EXIF (the originals were geotagged). See the
   Images section of AGENTS.md for the command.

   `meta` is the mono line under the frame. Dates come from the original file
   timestamps and are safe. Launch sites are deliberately NOT named: they were
   not recorded with the photos and guessing one wrong is the sort of detail
   another pilot spots immediately. Add real site names here when you have
   them — that is the one thing these captions are missing.
   ========================================================================== */
export type Photo = {
  src: string;
  /** Describes the image for screen readers. Not the same job as `caption`. */
  alt: string;
  /** Short line under the frame. Omit for a photo that speaks for itself. */
  caption?: string;
  /** Mono metadata — a date, a comp name. Set in the same register as a label. */
  meta?: string;
  width: number;
  height: number;
};

/** The three that open /flying. Portrait crops, so they sit as a triptych. */
export const flyingLead: Photo[] = [
  {
    src: '/photos/flying-annecy-lake.webp',
    alt: 'Travis under a red and blue paraglider wing, high above a turquoise alpine lake with the sun behind the wing.',
    caption: 'High over the lake.',
    meta: 'Jun 2024',
    width: 900,
    height: 1600,
  },
  {
    src: '/photos/flying-cockpit.webp',
    alt: 'View from the harness looking forward over an instrument cockpit toward a sharp forested ridge falling away to a valley and lake.',
    caption: 'The office — cockpit, risers, and the ridge ahead.',
    meta: 'Jun 2024',
    width: 900,
    height: 1600,
  },
  {
    src: '/photos/flying-brazil-river.webp',
    alt: 'Helmet-mounted selfie in flight, a wide brown river winding through green Brazilian farmland far below.',
    caption: 'Following the river, Brazil.',
    meta: 'Mar 2026',
    width: 1200,
    height: 1600,
  },
];

/** The gallery further down /flying. */
export const flyingGallery: Photo[] = [
  {
    src: '/photos/flying-annecy-wing.webp',
    alt: 'Paraglider wing overhead seen from below, lake and mountains in the background.',
    caption: 'Wing overhead, lake below.',
    width: 900,
    height: 1600,
  },
  {
    src: '/photos/flying-annecy-ridge.webp',
    alt: 'Wing inflated overhead on launch, pointing down a steep forested spine toward the valley.',
    caption: 'Wing up, committed.',
    meta: 'Jun 2024',
    width: 900,
    height: 1600,
  },
  {
    src: '/photos/flying-brazil-hills.webp',
    alt: 'Helmet and sunglasses selfie in flight over green rolling hills under a heavy overcast sky.',
    caption: 'Flying the day the sky was not helping.',
    meta: 'Mar 2026',
    width: 1200,
    height: 1600,
  },
  {
    src: '/photos/flying-red-rocks.webp',
    alt: 'In flight in a competition jersey, one hand on the brake, wing above and terrain curving away below.',
    caption: 'Red Rocks Wide Open.',
    meta: 'Sep 2025',
    width: 900,
    height: 1600,
  },
  {
    src: '/photos/flying-wing-clouds.webp',
    alt: 'Wide selfie-stick view of Travis seated in his pod harness with the wing above and cloud-covered ridges below.',
    caption: 'Cloud street, working the ridges.',
    width: 900,
    height: 1600,
  },
  {
    src: '/photos/flying-crew-launch.webp',
    alt: 'A dozen pilots with packed wings on their backs posing on a dry, dusty launch under a clear sky.',
    caption: 'Crew on launch.',
    meta: 'May 2026',
    width: 1600,
    height: 1200,
  },
  {
    src: '/photos/flying-crew-group.webp',
    alt: 'A large group of pilots in matching shirts throwing their hands in the air beside packed gear.',
    caption: 'The rest of the gaggle.',
    meta: 'May 2026',
    width: 1024,
    height: 768,
  },
  {
    src: '/photos/flight-analysis.webp',
    alt: 'A flight track replayed in 3D over terrain, coloured by climb rate, with individual thermals annotated by strength.',
    caption: 'The debrief — every thermal, annotated by climb rate.',
    meta: 'Jun 2026',
    /** Cropped to 4:5 at source: a screenshot should never be cropped by CSS. */
    width: 1200,
    height: 1500,
  },
];

/** The pair beside the sabbatical block on the homepage. */
export const currentlyPhotos: Photo[] = [
  {
    src: '/photos/flying-brazil-cloudbase.webp',
    alt: 'Selfie under the wing beside a tall building cumulus cloud, Brazilian mountains far below.',
    caption: 'Cumulus building.',
    meta: 'Mar 2026',
    width: 1200,
    height: 1600,
  },
  {
    src: '/photos/canada-lake-shore.webp',
    alt: 'Travis standing on a rock at the edge of a still turquoise glacial lake below a wall of snow-streaked peaks.',
    caption: 'Rest day between tasks, Golden.',
    meta: 'Jul 2026',
    width: 1200,
    height: 1600,
  },
];

/** "Away from the keyboard" on /about. */
export const awayGallery: Photo[] = [
  {
    src: '/photos/canada-lake-shore.webp',
    alt: 'Travis standing on a rock at the edge of a still turquoise glacial lake below a wall of snow-streaked peaks.',
    caption: 'Rest day between tasks.',
    meta: 'Jul 2026',
    width: 1200,
    height: 1600,
  },
  {
    src: '/photos/canada-alpine-lake.webp',
    alt: 'Travis in a down jacket standing barefoot on the shore of a partly frozen alpine lake beneath a snowfield.',
    meta: 'Jul 2026',
    width: 1200,
    height: 1600,
  },
  {
    src: '/photos/brazil-pier.webp',
    alt: 'Travis leaning on a wooden railing above calm green water, jungle-covered headland and an empty beach behind.',
    caption: 'Mornings are slower here.',
    meta: 'Mar 2026',
    width: 1200,
    height: 1600,
  },
  {
    src: '/photos/brazil-trail.webp',
    alt: 'Travis crossing a rough wooden footbridge on a trail through steep green coastal hills.',
    meta: 'Feb 2026',
    width: 768,
    height: 1024,
  },
  {
    src: '/photos/cat-sierra.webp',
    alt: 'A long-haired tabby cat sitting on a granite slab in a high alpine meadow, photographed from the photographer’s feet.',
    caption: 'Also hikes.',
    meta: 'Jun 2022',
    width: 1024,
    height: 1024,
  },
  {
    src: '/photos/cat-upside-down.webp',
    alt: 'Close-up of a long-haired tabby cat lying upside down on a blanket, looking straight into the camera.',
    caption: 'The senior engineer.',
    meta: 'Aug 2025',
    width: 960,
    height: 1280,
  },
  {
    src: '/photos/cat-closeup.webp',
    alt: 'Wide-angle close-up of the same cat riding in a carrier outdoors, eyes wide, whiskers flared, hills behind.',
    caption: 'Unimpressed by the commute.',
    meta: 'Jul 2022',
    width: 1200,
    height: 1600,
  },
];

/** Competition ranking. Source: paraglidingstats.com, August 2026. */
export const compStats = [
  { label: 'World ranking', value: '#1015' },
  { label: 'Competitions', value: '4' },
  { label: 'Tasks flown', value: '14' },
  { label: 'Pilots beaten', value: '161' },
];
