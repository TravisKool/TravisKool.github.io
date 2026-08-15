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

  /** The one-sentence version of you, in the hero. */
  tagline: 'I build systems that outlast the team that shipped them.',

  /** Appears under the hero and as the default meta description. */
  intro:
    'Fifteen years building software — the last eight scaling high-stakes fintech infrastructure, and the last four leading the teams that built it. Currently on sabbatical in Brazil, flying cross-country and researching agentic AI systems.',

  location: 'Brazil',

  /** Brasília time. Update when you are back stateside (America/Los_Angeles). */
  timezone: 'America/Sao_Paulo',

  /** Rendered in the hero "Currently" stat. */
  status: 'Sabbatical',

  /** Drives the amber "available" dot in the footer. Set false when not looking. */
  openToOpportunities: true,

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
  headline: 'On sabbatical in Brazil.',
  body: [
    'Since March 2026 I have been taking a deliberate professional sabbatical — advancing cross-country paragliding with real-time data, tracking software, variometers and navigation tech, while going deep on agentic AI systems.',
    'The two halves are more related than they look. After eight years scaling high-stakes fintech infrastructure, I am interested in AI-native systems where autonomous agents operate as a collaborative engineering team — actively enforcing precision, decoupling, and long-term quality even under aggressive velocity. The question I care about is whether rapid scaling can strengthen engineering standards rather than quietly compromise them.',
    'Mornings are pão de queijo and Portuguese practice. Afternoons are the terminal, or 18,000 feet.',
  ],
  facts: [
    { key: 'Since', value: 'Mar 2026' },
    { key: 'Based', value: 'Brazil' },
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
    location: 'Brazil',
    start: 'Mar 2026',
    end: null,
    summary:
      'Professional sabbatical — aviation and agentic AI research.',
    positions: [
      {
        title: 'Professional Sabbatical · Aviation & Agentic AI Research',
        start: 'Mar 2026',
        end: null,
        highlights: [
          {
            label: 'Agentic AI',
            body: 'Experimenting with agentic patterns for AI-native systems in which autonomous agents operate as a collaborative engineering team — enforcing precision, decoupling, and long-term quality under aggressive velocity.',
          },
          {
            label: 'Cross-country flying',
            body: 'Advancing XC paragliding with real-time data, tracking software, variometers, and navigation technology.',
          },
          {
            label: 'Next',
            body: 'Considering building my own product to put these ideas into practice.',
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
      'Seven years and eleven months across three roles, from founding C# engineer to the platform’s primary architectural decision-maker.',
    positions: [
      {
        title: 'Software Engineering Manager · Backend Architecture Lead',
        start: 'Sep 2023',
        end: 'Mar 2026',
        arrangement: 'Remote',
        highlights: [
          {
            label: 'Engineering leadership',
            body: 'Primary architectural decision-maker across the Retired.com ecosystem, bridging high-level strategy with technical execution.',
          },
          {
            label: 'M&A integration',
            body: 'Led the backend engineering teams through the technical acquisition and integration of Choice (Kingdom Trust), Rocket Dollar, and Shrimpy — overseeing platform migrations and cross-team alignment.',
          },
          {
            label: 'High-stakes fintech delivery',
            body: 'Led the teams that engineered the Instant Settlement Engine — a double-entry ledger — and the custom compliance platform for real-time account locking and fraud prevention.',
          },
          {
            label: 'AI-first transformation',
            body: 'Spearheaded the move to AI-augmented development, integrating the company’s first AI-powered PR reviewer and automated acceptance tests to hold quality during high-velocity cycles.',
          },
          {
            label: 'Operations',
            body: 'Owned end-to-end people operations, production release cycles, and critical production support for the unified ecosystem.',
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
            body: 'Guided decision-making and architectural solution design for a team of senior engineers while remaining hands-on with code the majority of the time.',
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
            body: 'Hired as the first C# engineer and a core contributor building the digital asset trading platform and its core APIs.',
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

/** Competition ranking. Source: paraglidingstats.com, August 2026. */
export const compStats = [
  { label: 'World ranking', value: '#1015' },
  { label: 'Competitions', value: '4' },
  { label: 'Tasks flown', value: '14' },
  { label: 'Pilots beaten', value: '161' },
];
