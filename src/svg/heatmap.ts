import type { AnalyticsResult } from "../analytics/types.js";
import { escapeXml, formatNumber } from "../utils/index.js";
import { monthLabel, renderCardFrame } from "./layout.js";
import { theme } from "./theme.js";

type Day = AnalyticsResult["contributions"]["calendar"][number];

export function renderHeatmapCard(stats: AnalyticsResult): string {
  const weeks = groupByWeek(stats.contributions.calendar);
  const gap = 3;
  const labelCol = 28;
  const px = theme.paddingX;
  const top = theme.headerHeight + 28;
  const available = 700;
  const cell = Math.max(
    9,
    Math.min(12, Math.floor((available - (weeks.length - 1) * gap) / Math.max(weeks.length, 1))),
  );
  const calendarWidth = weeks.length * cell + Math.max(0, weeks.length - 1) * gap;
  const calendarHeight = 7 * cell + 6 * gap;
  const width = px * 2 + labelCol + calendarWidth;
  const monthLabels = buildMonthLabels(weeks, cell, gap);
  const height = top + calendarHeight + 36;

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

  const months = monthLabels
    .map(
      (item) =>
        `<text x="${px + labelCol + item.x}" y="${theme.headerHeight + 18}" fill="${theme.label}" font-size="10">${item.label}</text>`,
    )
    .join("");

  const cells = weeks
    .map((week, weekIndex) =>
      week
        .map((day, dayIndex) => {
          if (!day) return "";
          const x = px + labelCol + weekIndex * (cell + gap);
          const y = top + dayIndex * (cell + gap);
          const fill = day.count > 0 ? day.color || levelColor(day.count) : "#161b22";
          return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${escapeXml(fill)}"><title>${day.date}: ${day.count}</title></rect>`;
        })
        .join(""),
    )
    .join("");

  const body = `
    ${months}
    ${weekdayLabels}
    ${cells}
    <text x="${px}" y="${height - 14}" fill="${theme.label}" font-size="11">Less</text>
    ${legend(px + 36, height - 22)}
    <text x="${px + 108}" y="${height - 14}" fill="${theme.label}" font-size="11">More</text>
  `;

  return renderCardFrame({
    width,
    height,
    title: "Contribution Heatmap",
    subtitle: `${formatNumber(stats.contributions.total)} in last year`,
    ariaLabel: `Contribution heatmap for ${stats.username}`,
    body,
  });
}

function legend(x: number, y: number): string {
  const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
  return colors
    .map(
      (color, index) =>
        `<rect x="${x + index * 14}" y="${y}" width="10" height="10" rx="2" fill="${color}"/>`,
    )
    .join("");
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
    if (previous && x - previous.x < 28) {
      return;
    }
    labels.push({
      label: monthLabel(month),
      x,
    });
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

function levelColor(count: number): string {
  if (count >= 20) return "#39d353";
  if (count >= 10) return "#26a641";
  if (count >= 5) return "#006d32";
  return "#0e4429";
}
