/**
 * Career duration maths.
 *
 * These numbers are DERIVED, never hand-written, so they can never drift out
 * of sync with the timeline on /work or quietly go stale in the hero.
 *
 * Note on staleness: this is a static site, so the values are frozen at build
 * time. `.github/workflows/deploy.yml` runs a monthly scheduled rebuild for
 * exactly this reason — otherwise "15 yrs" would still say 15 long after it
 * became 16.
 */

/** Parses 'YYYY-MM' or 'YYYY-MM-DD' as a local date. */
function parse(date: string): Date {
  const [year, month, day = '1'] = date.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/** Total whole months between two dates. */
function monthsBetween(from: string, to?: string): number {
  const start = parse(from);
  const end = to ? parse(to) : new Date();

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;

  return Math.max(0, months);
}

/**
 * Years of an ONGOING span, rounded DOWN.
 *
 * You have 15 years of experience the day you complete the fifteenth, not the
 * day you pass 14½. Flooring is the conservative, defensible reading and it
 * matches how people describe themselves ("over fifteen years").
 */
export function yearsSoFar(from: string): number {
  return Math.floor(monthsBetween(from) / 12);
}

/**
 * Years of a COMPLETED span, rounded to NEAREST.
 *
 * A tenure of 3 years 11 months is described by every normal person — and
 * every résumé — as four years. Flooring it to three would understate a
 * finished job by a month, which is the wrong kind of wrong.
 */
export function tenureYears(from: string, to: string): number {
  return Math.round(monthsBetween(from, to) / 12);
}

/**
 * Whole years and months elapsed, for precise strings like "15 yrs 7 mos".
 * Used in the tooltip/title attribute rather than the headline number.
 */
export function durationBetween(from: string, to?: string): string {
  const months = monthsBetween(from, to);
  const years = Math.floor(months / 12);
  const rest = months % 12;

  if (years === 0) return `${rest} mo${rest === 1 ? '' : 's'}`;
  if (rest === 0) return `${years} yr${years === 1 ? '' : 's'}`;
  return `${years} yr${years === 1 ? '' : 's'} ${rest} mo${rest === 1 ? '' : 's'}`;
}
