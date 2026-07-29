import type { AnalyticsResult } from "../analytics/types.js";
import { clamp, formatNumber } from "../utils/index.js";
import { renderCardFrame, shortWeekday } from "./layout.js";
import { CARD_WIDTH, theme } from "./theme.js";

export function renderWeekdayCard(stats: AnalyticsResult): string {
  const days = stats.contributions.byWeekday;
  const width = CARD_WIDTH.md;
  const px = theme.paddingX;
  const top = theme.headerHeight + 24;
  const chartHeight = 120;
  const gap = 14;
  const barWidth =
    days.length > 0 ? Math.floor((width - px * 2 - gap * (days.length - 1)) / days.length) : 0;
  const max = Math.max(...days.map((d) => d.count), 1);
  const height = top + 16 + chartHeight + 36;

  const bars = days
    .map((day, index) => {
      const h = clamp((day.count / max) * chartHeight, day.count > 0 ? 4 : 0, chartHeight);
      const x = px + index * (barWidth + gap);
      const y = top + 16 + chartHeight - h;
      const active = day.day === stats.productive.mostActiveWeekday;
      return `
    <text x="${x + barWidth / 2}" y="${y - 6}" fill="${theme.label}" font-size="10" text-anchor="middle">${formatNumber(day.count)}</text>
    <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="4" fill="${active ? theme.success : theme.accent}"/>
    <text x="${x + barWidth / 2}" y="${top + 16 + chartHeight + 18}" fill="${active ? theme.value : theme.label}" font-size="11" font-weight="${active ? 700 : 400}" text-anchor="middle">${shortWeekday(day.day)}</text>`;
    })
    .join("");

  return renderCardFrame({
    width,
    height,
    title: "Activity by Weekday",
    subtitle: `Best: ${stats.productive.mostActiveWeekday}`,
    ariaLabel: `Weekday activity for ${stats.username}`,
    body: bars,
  });
}
