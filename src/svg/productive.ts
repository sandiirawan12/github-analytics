import type { AnalyticsResult } from "../analytics/types.js";
import { clamp, formatNumber } from "../utils/index.js";
import { renderCardFrame } from "./layout.js";
import { CARD_WIDTH, theme } from "./theme.js";

export function renderProductiveCard(stats: AnalyticsResult): string {
  const hours =
    stats.contributions.byHour ?? Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
  const width = CARD_WIDTH.lg;
  const px = theme.paddingX;
  const top = theme.headerHeight + 20;
  const chartHeight = 110;
  const gap = 4;
  const barWidth = Math.floor((width - px * 2 - gap * 23) / 24);
  const max = Math.max(...hours.map((h) => h.count), 1);
  const hasData = hours.some((h) => h.count > 0);
  const height = top + chartHeight + 56;

  const bars = hours
    .map((item, index) => {
      const h = hasData
        ? clamp((item.count / max) * chartHeight, item.count > 0 ? 3 : 0, chartHeight)
        : 0;
      const x = px + index * (barWidth + gap);
      const y = top + chartHeight - h;
      const active = item.hour === stats.productive.mostActiveHour;
      const showLabel = index % 3 === 0;
      return `
    <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="2" fill="${active ? theme.success : theme.accent}"/>
    ${showLabel ? `<text x="${x + barWidth / 2}" y="${top + chartHeight + 18}" fill="${theme.label}" font-size="10" text-anchor="middle">${String(item.hour).padStart(2, "0")}</text>` : ""}`;
    })
    .join("");

  const footnote = hasData
    ? stats.productive.mostActiveHour === null
      ? `Most active weekday: ${stats.productive.mostActiveWeekday}`
      : `Peak hour ${String(stats.productive.mostActiveHour).padStart(2, "0")}:00 · ${stats.productive.mostActiveWeekday}`
    : `Most active weekday: ${stats.productive.mostActiveWeekday} (hour data unavailable)`;

  const empty = hasData
    ? ""
    : `<text x="${px}" y="${top + 40}" fill="${theme.label}" font-size="12">No recent public event timestamps for hourly chart</text>`;

  return renderCardFrame({
    width,
    height,
    title: "Productive Time",
    subtitle: formatNumber(hours.reduce((sum, h) => sum + h.count, 0)) + " sampled events",
    ariaLabel: `Productive time for ${stats.username}`,
    body: `
    ${bars}
    ${empty}
    <text x="${px}" y="${height - 14}" fill="${theme.label}" font-size="12">${footnote}</text>
    `,
  });
}
