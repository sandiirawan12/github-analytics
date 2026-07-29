import type { AnalyticsResult } from "../analytics/types.js";
import type { ShowOptions } from "../config/types.js";
import type { Theme } from "../themes/index.js";
import { clamp, escapeXml, formatNumber } from "../utils/index.js";
import { monthLabel, renderCardFrame, shortWeekday } from "./layout.js";

type Day = AnalyticsResult["contributions"]["calendar"][number];

export function renderActivityCard(
  stats: AnalyticsResult,
  theme: Theme,
  show: ShowOptions,
): string {
  const weeks = groupByWeek(stats.contributions.calendar);
  const gap = 3;
  const labelCol = 28;
  const px = theme.paddingX;
  const top = theme.headerHeight + 28;
  const available = 680;
  const cell = Math.max(
    9,
    Math.min(12, Math.floor((available - (weeks.length - 1) * gap) / Math.max(weeks.length, 1))),
  );
  const calendarWidth = weeks.length * cell + Math.max(0, weeks.length - 1) * gap;
  const calendarHeight = 7 * cell + 6 * gap;

  const months = stats.contributions.byMonth.slice(-12);
  const weekdays = stats.contributions.byWeekday;
  const maxMonth = Math.max(...months.map((m) => m.count), 1);
  const maxWeekday = Math.max(...weekdays.map((d) => d.count), 1);

  const chartsTop = top + calendarHeight + 28;
  const chartH = 72;
  const width = Math.max(px * 2 + labelCol + calendarWidth, 760);
  const halfGap = 20;
  const halfW = (width - px * 2 - halfGap) / 2;

  let productiveNote = "";
  if (show.productive_time) {
    productiveNote =
      stats.productive.mostActiveHour === null
        ? `Most active: ${stats.productive.mostActiveWeekday}`
        : `Most active: ${stats.productive.mostActiveWeekday}, ${String(stats.productive.mostActiveHour).padStart(2, "0")}:00`;
  }

  const height = chartsTop + chartH + 48 + (productiveNote ? 18 : 0);

  const monthLabels = buildMonthLabels(weeks, cell, gap)
    .map(
      (item) =>
        `<text x="${px + labelCol + item.x}" y="${theme.headerHeight + 18}" fill="${theme.label}" font-size="10">${item.label}</text>`,
    )
    .join("");

  const weekdayLabels = [
    { text: "Mon", row: 1 },
    { text: "Wed", row: 3 },
    { text: "Fri", row: 5 },
  ]
    .map(({ text, row }) => {
      const y = top + row * (cell + gap) + cell - 2;
      return `<text x="${px}" y="${y}" fill="${theme.label}" font-size="10">${text}</text>`;
    })
    .join("");

  const cells = weeks
    .map((week, weekIndex) =>
      week
        .map((day, dayIndex) => {
          if (!day) return "";
          const x = px + labelCol + weekIndex * (cell + gap);
          const y = top + dayIndex * (cell + gap);
          const fill = day.count > 0 ? day.color || levelColor(day.count, theme) : theme.heatmap[0];
          return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${escapeXml(fill)}"><title>${day.date}: ${day.count}</title></rect>`;
        })
        .join(""),
    )
    .join("");

  const monthBars = months
    .map((month, index) => {
      const barGap = 6;
      const barW = Math.floor((halfW - barGap * (months.length - 1)) / months.length);
      const h = clamp((month.count / maxMonth) * chartH, month.count > 0 ? 3 : 0, chartH);
      const x = px + index * (barW + barGap);
      const y = chartsTop + 18 + chartH - h;
      return `
    <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="3" fill="${theme.accent}"/>
    <text x="${x + barW / 2}" y="${chartsTop + 18 + chartH + 14}" fill="${theme.label}" font-size="9" text-anchor="middle">${monthLabel(month.month)}</text>`;
    })
    .join("");

  const weekdayBars = weekdays
    .map((day, index) => {
      const barGap = 8;
      const barW = Math.floor((halfW - barGap * (weekdays.length - 1)) / weekdays.length);
      const h = clamp((day.count / maxWeekday) * chartH, day.count > 0 ? 3 : 0, chartH);
      const x = px + halfW + halfGap + index * (barW + barGap);
      const y = chartsTop + 18 + chartH - h;
      const active = day.day === stats.productive.mostActiveWeekday;
      return `
    <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="3" fill="${active ? theme.success : theme.accent}"/>
    <text x="${x + barW / 2}" y="${chartsTop + 18 + chartH + 14}" fill="${theme.label}" font-size="9" text-anchor="middle">${shortWeekday(day.day)}</text>`;
    })
    .join("");

  const body = `
    ${monthLabels}
    ${weekdayLabels}
    ${cells}
    <text x="${px}" y="${chartsTop}" fill="${theme.value}" font-size="12" font-weight="600">Monthly</text>
    <text x="${px + halfW + halfGap}" y="${chartsTop}" fill="${theme.value}" font-size="12" font-weight="600">Weekday</text>
    ${monthBars}
    ${weekdayBars}
    ${
      productiveNote
        ? `<text x="${px}" y="${height - 12}" fill="${theme.label}" font-size="11">${escapeXml(productiveNote)}</text>`
        : ""
    }
  `;

  return renderCardFrame({
    width,
    height,
    title: "Activity",
    subtitle: `${formatNumber(stats.contributions.total)} contributions`,
    ariaLabel: `Activity for ${stats.username}`,
    theme,
    body,
    generatedAt: stats.generatedAt,
  });
}

function buildMonthLabels(
  weeks: (Day | null)[][],
  cell: number,
  gap: number,
): { label: string; x: number }[] {
  const labels: { label: string; x: number }[] = [];
  let lastMonth = "";

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find((day) => day !== null);
    if (!firstDay) return;
    const month = firstDay.date.slice(0, 7);
    if (month === lastMonth) return;
    lastMonth = month;
    const x = weekIndex * (cell + gap);
    const previous = labels[labels.length - 1];
    if (previous && x - previous.x < 28) return;
    labels.push({ label: monthLabel(month), x });
  });

  return labels;
}

function groupByWeek(calendar: Day[]): (Day | null)[][] {
  const weeks: (Day | null)[][] = [];
  let current: (Day | null)[] = [];

  for (const day of calendar) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (current.length === 0 && weekday !== 0) {
      for (let i = 0; i < weekday; i += 1) current.push(null);
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

function levelColor(count: number, theme: Theme): string {
  if (count >= 20) return theme.heatmap[4];
  if (count >= 10) return theme.heatmap[3];
  if (count >= 5) return theme.heatmap[2];
  return theme.heatmap[1];
}
