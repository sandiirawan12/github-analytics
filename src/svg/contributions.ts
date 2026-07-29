import type { AnalyticsResult } from "../analytics/types.js";
import type { Theme } from "../themes/index.js";
import { clamp, formatNumber } from "../utils/index.js";
import { monthLabel, renderCardFrame } from "./layout.js";

export function renderContributionsCard(stats: AnalyticsResult, theme: Theme): string {
  const months = stats.contributions.byMonth.slice(-12);
  const width = 520;
  const px = theme.paddingX;
  const top = theme.headerHeight + 20;
  const chartH = 130;
  const gap = 8;
  const barW =
    months.length > 0
      ? Math.floor((width - px * 2 - gap * (months.length - 1)) / months.length)
      : 0;
  const max = Math.max(...months.map((m) => m.count), 1);
  const height = top + 18 + chartH + 36;

  const bars = months
    .map((month, index) => {
      const h = clamp((month.count / max) * chartH, month.count > 0 ? 4 : 0, chartH);
      const x = px + index * (barW + gap);
      const y = top + 18 + chartH - h;
      return `
    <text x="${x + barW / 2}" y="${y - 6}" fill="${theme.label}" font-size="9" text-anchor="middle">${formatNumber(month.count)}</text>
    <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="4" fill="${theme.accent}"/>
    <text x="${x + barW / 2}" y="${top + 18 + chartH + 16}" fill="${theme.label}" font-size="10" text-anchor="middle">${monthLabel(month.month)}</text>`;
    })
    .join("");

  return renderCardFrame({
    width,
    height,
    title: "Contributions",
    subtitle: `${formatNumber(stats.contributions.total)} total · ${formatNumber(stats.activeDays)} active days`,
    ariaLabel: `Contributions for ${stats.username}`,
    theme,
    body:
      bars ||
      `<text x="${px}" y="${top}" fill="${theme.label}" font-size="13">No contribution data</text>`,
  });
}
