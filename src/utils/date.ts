const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function weekdayName(date: string): string {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return WEEKDAYS[day] ?? "Sunday";
}

export function monthKey(date: string): string {
  return date.slice(0, 7);
}

export function mode(values: number[]): number | null {
  if (values.length === 0) return null;

  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  let best: number | null = null;
  let bestCount = -1;
  for (const [value, count] of counts) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}
