import type { ContributionDay } from "../github/types.js";

export interface StreakResult {
  current: number;
  longest: number;
}

export function computeStreaks(days: ContributionDay[], today = new Date()): StreakResult {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length === 0) {
    return { current: 0, longest: 0 };
  }

  let longest = 0;
  let run = 0;
  let previousDate: string | null = null;

  for (const day of sorted) {
    if (day.contributionCount > 0) {
      if (previousDate && isNextDay(previousDate, day.date)) {
        run += 1;
      } else {
        run = 1;
      }
      longest = Math.max(longest, run);
      previousDate = day.date;
    } else {
      run = 0;
      previousDate = null;
    }
  }

  const todayKey = toDateKey(today);
  const yesterdayKey = toDateKey(addDays(today, -1));
  const byDate = new Map(sorted.map((d) => [d.date, d.contributionCount]));

  let current = 0;
  let cursor = byDate.get(todayKey) && (byDate.get(todayKey) ?? 0) > 0 ? todayKey : yesterdayKey;

  while ((byDate.get(cursor) ?? 0) > 0) {
    current += 1;
    cursor = toDateKey(addDays(parseDateKey(cursor), -1));
  }

  return { current, longest };
}

function isNextDay(previous: string, current: string): boolean {
  return toDateKey(addDays(parseDateKey(previous), 1)) === current;
}

function parseDateKey(key: string): Date {
  return new Date(`${key}T00:00:00Z`);
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + amount);
  return next;
}
