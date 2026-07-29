import type { AnalyticsResult } from "../analytics/types.js";
import { formatNumber } from "../utils/index.js";
import { renderCardFrame } from "./layout.js";
import { CARD_WIDTH, theme } from "./theme.js";

export function renderStreakCard(stats: AnalyticsResult): string {
  const width = CARD_WIDTH.md;
  const px = theme.paddingX;
  const top = theme.headerHeight + 20;
  const panelW = (width - px * 2 - 14) / 2;
  const panelH = 110;
  const height = top + panelH + 24;

  const body = `
    <rect x="${px}" y="${top}" width="${panelW}" height="${panelH}" rx="8" fill="${theme.panel}" stroke="${theme.border}"/>
    <text x="${px + panelW / 2}" y="${top + 36}" fill="${theme.label}" font-size="13" text-anchor="middle">Current Streak</text>
    <text x="${px + panelW / 2}" y="${top + 78}" fill="${theme.success}" font-size="36" font-weight="700" text-anchor="middle">${formatNumber(stats.streak.current)}</text>
    <text x="${px + panelW / 2}" y="${top + 98}" fill="${theme.label}" font-size="11" text-anchor="middle">days</text>

    <rect x="${px + panelW + 14}" y="${top}" width="${panelW}" height="${panelH}" rx="8" fill="${theme.panel}" stroke="${theme.border}"/>
    <text x="${px + panelW + 14 + panelW / 2}" y="${top + 36}" fill="${theme.label}" font-size="13" text-anchor="middle">Longest Streak</text>
    <text x="${px + panelW + 14 + panelW / 2}" y="${top + 78}" fill="${theme.accent}" font-size="36" font-weight="700" text-anchor="middle">${formatNumber(stats.streak.longest)}</text>
    <text x="${px + panelW + 14 + panelW / 2}" y="${top + 98}" fill="${theme.label}" font-size="11" text-anchor="middle">days</text>
  `;

  return renderCardFrame({
    width,
    height,
    title: "Streak",
    subtitle: `@${stats.username}`,
    ariaLabel: `Commit streak for ${stats.username}`,
    body,
  });
}
