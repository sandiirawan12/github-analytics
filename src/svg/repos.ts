import type { AnalyticsResult } from "../analytics/types.js";
import { formatNumber } from "../utils/index.js";
import { renderCardFrame } from "./layout.js";
import { CARD_WIDTH, theme } from "./theme.js";

export function renderReposCard(stats: AnalyticsResult): string {
  const width = CARD_WIDTH.md;
  const px = theme.paddingX;
  const top = theme.headerHeight + 16;
  const gap = 12;
  const cardW = (width - px * 2 - gap) / 2;
  const cardH = 72;
  const items = [
    { label: "Public Repos", value: stats.repositories.public, color: theme.public },
    { label: "Private Repos", value: stats.repositories.private, color: theme.private },
    { label: "Stars", value: stats.stars, color: theme.warning },
    { label: "Forks", value: stats.forks, color: theme.accent },
    { label: "Pull Requests", value: stats.pullRequests, color: theme.success },
    { label: "Issues", value: stats.issues, color: theme.label },
  ];
  const rows = Math.ceil(items.length / 2);
  const height = top + rows * (cardH + gap) - gap + 24;

  const body = items
    .map((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = px + col * (cardW + gap);
      const y = top + row * (cardH + gap);
      return `
    <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="8" fill="${theme.panel}" stroke="${theme.border}"/>
    <rect x="${x}" y="${y}" width="4" height="${cardH}" rx="2" fill="${item.color}"/>
    <text x="${x + 18}" y="${y + 28}" fill="${theme.label}" font-size="12">${item.label}</text>
    <text x="${x + 18}" y="${y + 54}" fill="${theme.value}" font-size="22" font-weight="700">${formatNumber(item.value)}</text>`;
    })
    .join("");

  return renderCardFrame({
    width,
    height,
    title: "Repositories & Engagement",
    subtitle: `${formatNumber(stats.repositories.total)} repos`,
    ariaLabel: `Repository stats for ${stats.username}`,
    body,
  });
}
