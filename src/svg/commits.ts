import type { AnalyticsResult } from "../analytics/types.js";
import { formatNumber } from "../utils/index.js";
import { renderCardFrame } from "./layout.js";
import { CARD_WIDTH, theme } from "./theme.js";

export function renderCommitsCard(stats: AnalyticsResult): string {
  const width = CARD_WIDTH.md;
  const px = theme.paddingX;
  const top = theme.headerHeight + 18;
  const total = Math.max(stats.commits.total, 1);
  const publicRatio = stats.commits.public / total;
  const privateRatio = stats.commits.private / total;

  const cx = px + 78;
  const cy = top + 78;
  const radius = 58;
  const stroke = 18;
  const c = 2 * Math.PI * radius;
  const publicLen = publicRatio * c;
  const privateLen = privateRatio * c;

  const barTop = top + 20;
  const barX = cx + 100;
  const barW = width - barX - px;
  const height = top + 170;

  const body = `
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${theme.barTrack}" stroke-width="${stroke}"/>
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${theme.public}" stroke-width="${stroke}"
      stroke-dasharray="${publicLen} ${c - publicLen}" stroke-dashoffset="${c / 4}" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${theme.private}" stroke-width="${stroke}"
      stroke-dasharray="${privateLen} ${c - privateLen}" stroke-dashoffset="${c / 4 - publicLen}" stroke-linecap="round"/>
    <text x="${cx}" y="${cy - 4}" fill="${theme.value}" font-size="20" font-weight="700" text-anchor="middle">${formatNumber(stats.commits.total)}</text>
    <text x="${cx}" y="${cy + 16}" fill="${theme.label}" font-size="11" text-anchor="middle">commits</text>

    <text x="${barX}" y="${barTop}" fill="${theme.label}" font-size="12">Public</text>
    <text x="${width - px}" y="${barTop}" fill="${theme.value}" font-size="12" text-anchor="end">${formatNumber(stats.commits.public)}</text>
    <rect x="${barX}" y="${barTop + 10}" width="${barW}" height="12" rx="4" fill="${theme.barTrack}"/>
    <rect x="${barX}" y="${barTop + 10}" width="${Math.max(publicRatio * barW, stats.commits.public > 0 ? 4 : 0)}" height="12" rx="4" fill="${theme.public}"/>

    <text x="${barX}" y="${barTop + 54}" fill="${theme.label}" font-size="12">Private</text>
    <text x="${width - px}" y="${barTop + 54}" fill="${theme.value}" font-size="12" text-anchor="end">${formatNumber(stats.commits.private)}</text>
    <rect x="${barX}" y="${barTop + 64}" width="${barW}" height="12" rx="4" fill="${theme.barTrack}"/>
    <rect x="${barX}" y="${barTop + 64}" width="${Math.max(privateRatio * barW, stats.commits.private > 0 ? 4 : 0)}" height="12" rx="4" fill="${theme.private}"/>

    <rect x="${barX}" y="${barTop + 104}" width="10" height="10" rx="2" fill="${theme.public}"/>
    <text x="${barX + 16}" y="${barTop + 113}" fill="${theme.label}" font-size="11">Public ${(publicRatio * 100).toFixed(0)}%</text>
    <rect x="${barX + 110}" y="${barTop + 104}" width="10" height="10" rx="2" fill="${theme.private}"/>
    <text x="${barX + 126}" y="${barTop + 113}" fill="${theme.label}" font-size="11">Private ${(privateRatio * 100).toFixed(0)}%</text>
  `;

  return renderCardFrame({
    width,
    height,
    title: "Commits",
    subtitle: `@${stats.username}`,
    ariaLabel: `Public vs private commits for ${stats.username}`,
    body,
  });
}
