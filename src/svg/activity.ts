import type { AnalyticsResult } from "../analytics/types.js";
import { clamp, escapeXml, formatNumber } from "../utils/index.js";
import { theme } from "./theme.js";

export function renderActivityCard(stats: AnalyticsResult): string {
  const width = theme.width.activity;
  const paddingX = 24;
  const headerHeight = 48;
  const cell = 11;
  const gap = 3;
  const weeks = groupByWeek(stats.contributions.calendar);
  const calendarWidth = weeks.length * (cell + gap);
  const calendarHeight = 7 * (cell + gap);
  const monthBars = stats.contributions.byMonth.slice(-12);
  const maxMonth = Math.max(...monthBars.map((m) => m.count), 1);
  const barAreaHeight = 70;
  const barGap = 8;
  const barWidth =
    monthBars.length > 0
      ? Math.floor((width - paddingX * 2 - barGap * (monthBars.length - 1)) / monthBars.length)
      : 0;

  const heatmapY = headerHeight + 16;
  const barsY = heatmapY + calendarHeight + 36;
  const height = barsY + barAreaHeight + 40;

  const cells = weeks
    .map((week, weekIndex) =>
      week
        .map((day, dayIndex) => {
          if (!day) return "";
          const x = paddingX + weekIndex * (cell + gap);
          const y = heatmapY + dayIndex * (cell + gap);
          const fill = day.count > 0 ? day.color || levelColor(day.count) : "#161b22";
          return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${escapeXml(fill)}"><title>${day.date}: ${day.count}</title></rect>`;
        })
        .join(""),
    )
    .join("");

  const bars = monthBars
    .map((month, index) => {
      const h = clamp(
        (month.count / maxMonth) * barAreaHeight,
        month.count > 0 ? 3 : 0,
        barAreaHeight,
      );
      const x = paddingX + index * (barWidth + barGap);
      const y = barsY + barAreaHeight - h;
      const label = month.month.slice(5);
      return `
  <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="3" fill="${theme.accent}"/>
  <text x="${x + barWidth / 2}" y="${barsY + barAreaHeight + 16}" fill="${theme.label}" font-size="10" text-anchor="middle">${label}</text>`;
    })
    .join("");

  const productive =
    stats.productive.mostActiveHour === null
      ? `Most active: ${stats.productive.mostActiveWeekday}`
      : `Most active: ${stats.productive.mostActiveWeekday}, ${String(stats.productive.mostActiveHour).padStart(2, "0")}:00`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Activity graph for ${escapeXml(stats.username)}">
  <title>Activity — ${escapeXml(stats.username)}</title>
  <rect width="${width}" height="${height}" rx="8" fill="${theme.background}" stroke="${theme.border}"/>
  <text x="${paddingX}" y="30" fill="${theme.title}" font-size="16" font-weight="700" font-family="${theme.fontFamily}">Activity</text>
  <text x="${width - paddingX}" y="30" fill="${theme.label}" font-size="12" text-anchor="end" font-family="${theme.fontFamily}">${formatNumber(stats.contributions.total)} contributions</text>
  <line x1="${paddingX}" y1="${headerHeight}" x2="${width - paddingX}" y2="${headerHeight}" stroke="${theme.border}"/>
  <g>${cells}</g>
  <text x="${paddingX}" y="${heatmapY + calendarHeight + 22}" fill="${theme.label}" font-size="12" font-family="${theme.fontFamily}">${escapeXml(productive)}</text>
  <text x="${paddingX}" y="${barsY - 10}" fill="${theme.value}" font-size="13" font-family="${theme.fontFamily}">Contributions per month</text>
  <g font-family="${theme.fontFamily}">${bars}
  </g>
  <!-- heatmap span hint: ${calendarWidth}px -->
</svg>
`;
}

function groupByWeek(
  calendar: AnalyticsResult["contributions"]["calendar"],
): (AnalyticsResult["contributions"]["calendar"][number] | null)[][] {
  const weeks: (AnalyticsResult["contributions"]["calendar"][number] | null)[][] = [];
  let current: (AnalyticsResult["contributions"]["calendar"][number] | null)[] = [];

  for (const day of calendar) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (current.length === 0 && weekday !== 0) {
      for (let i = 0; i < weekday; i += 1) {
        current.push(null);
      }
    }
    current.push(day);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  }

  if (current.length > 0) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }

  return weeks;
}

function levelColor(count: number): string {
  if (count >= 20) return "#39d353";
  if (count >= 10) return "#26a641";
  if (count >= 5) return "#006d32";
  return "#0e4429";
}
