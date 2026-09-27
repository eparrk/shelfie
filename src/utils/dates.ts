const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/**
 * Whole days from `from` to `to`. Partial days are dropped,
 * so 1.5 days -> 1. Negative when `to` is before `from`.
 */
export function daysBetween(from: Date, to: Date): number {
  return Math.trunc((to.getTime() - from.getTime()) / MS_PER_DAY);
}
