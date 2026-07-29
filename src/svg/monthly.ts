import type { AnalyticsResult } from "../analytics/types.js";
import { clamp, formatNumber } from "../utils/index.js";
import { monthLabel, renderCardFrame } from "./layout.js";
import { CARD_WIDTH, theme } from "./theme.js";

export function renderMonthlyCard(stats: AnalyticsResult): string {
  const months = stats.contributions.byMonth.slice(-12);
  const width = CARD_WIDTH.lg;
  const px = theme.paddingX;
  const top = theme.headerHeight + 24;
  const chartHeight = 140;
  const labelH = 22;
  const valueH = 16;
  const gap = 10;
  const barWidth =
    months.length > 0
      ? Math.floor((width - px * 2 - gap * (months.length - 1)) / months.length)
      : 0;
  const max = Math.max(...months.map((m) => m.count), 1);
  const height = top + valueH + chartHeight + labelH + 28;

  const bars = months
    .map((month, index) => {
      const h = clamp((month.count / max) * chartHeight, month.count > 0 ? 4 : 0, chartHeight);
      const x = px + index * (barWidth + gap);
      const y = top + valueH + chartHeight - h;
      return `
    <text x="${x + barWidth / 2}" y="${y - 6}" fill="${theme.label}" font-size="10" text-anchor="middle">${formatNumber(month.count)}</text>
    <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="4" fill="${theme.accent}"/>
    <text x="${x + barWidth / 2}" y="${top + valueH + chartHeight + 18}" fill="${theme.label}" font-size="11" text-anchor="middle">${monthLabel(month.month)}</text>`;
    })
    .join("");

  return renderCardFrame({
    width,
    height,
    title: "Monthly Contributions",
    subtitle: `Peak ${formatNumber(max)}`,
    ariaLabel: `Monthly contributions for ${stats.username}`,
    body:
      bars ||
      `<text x="${px}" y="${top}" fill="${theme.label}" font-size="13">No monthly data</text>`,
  });
}
