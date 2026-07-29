import type { AnalyticsResult } from "../analytics/types.js";
import type { ShowOptions } from "../config/types.js";
import type { Theme } from "../themes/index.js";
import { escapeXml, formatNumber } from "../utils/index.js";
import { renderCardFrame, truncateText } from "./layout.js";

export function renderRepositoriesCard(
  stats: AnalyticsResult,
  theme: Theme,
  show: ShowOptions,
): string {
  const width = 560;
  const px = theme.paddingX;
  const top = theme.headerHeight + 16;
  const gap = 12;
  const summaryH = 64;
  const rowH = 44;

  const summaryItems = [
    { label: "Public", value: stats.repositories.public, color: theme.public },
    ...(show.private
      ? [{ label: "Private", value: stats.repositories.private, color: theme.private }]
      : []),
    ...(show.stars
      ? [
          { label: "Stars", value: stats.stars, color: theme.warning },
          { label: "Forks", value: stats.forks, color: theme.accent },
        ]
      : []),
  ];

  const summaryCols = Math.max(summaryItems.length, 1);
  const summaryW = (width - px * 2 - gap * (summaryCols - 1)) / summaryCols;

  const summary = summaryItems
    .map((item, index) => {
      const x = px + index * (summaryW + gap);
      return `
    <rect x="${x}" y="${top}" width="${summaryW}" height="${summaryH}" rx="6" fill="${theme.panel}" stroke="${theme.border}"/>
    <text x="${x + 12}" y="${top + 24}" fill="${theme.label}" font-size="12">${item.label}</text>
    <text x="${x + 12}" y="${top + 48}" fill="${item.color}" font-size="20" font-weight="700">${formatNumber(item.value)}</text>`;
    })
    .join("");

  const listTop = top + summaryH + 28;
  const repos = stats.topRepositories.slice(0, 5);
  const height = listTop + Math.max(repos.length, 1) * rowH + 20;

  const listHeader = `<text x="${px}" y="${listTop - 10}" fill="${theme.value}" font-size="12" font-weight="600">Top repositories</text>`;

  const list =
    repos.length === 0
      ? `<text x="${px}" y="${listTop + 16}" fill="${theme.label}" font-size="13">No repositories</text>`
      : repos
          .map((repo, index) => {
            const y = listTop + index * rowH;
            const badge = repo.isPrivate ? "private" : "public";
            const badgeColor = repo.isPrivate ? theme.private : theme.public;
            const lang = repo.language ? truncateText(repo.language, 12) : "—";
            return `
    <rect x="${px}" y="${y}" width="${width - px * 2}" height="${rowH - 8}" rx="6" fill="${theme.panel}" stroke="${theme.border}"/>
    <text x="${px + 14}" y="${y + 22}" fill="${theme.value}" font-size="13" font-weight="600">${escapeXml(truncateText(repo.name, 22))}</text>
    <text x="${px + 200}" y="${y + 22}" fill="${badgeColor}" font-size="11">${badge}</text>
    <text x="${px + 270}" y="${y + 22}" fill="${theme.label}" font-size="11">${escapeXml(lang)}</text>
    <text x="${width - px - 14}" y="${y + 22}" fill="${theme.label}" font-size="12" text-anchor="end">${formatNumber(repo.stars)} stars · ${formatNumber(repo.forks)} forks</text>`;
          })
          .join("");

  return renderCardFrame({
    width,
    height,
    title: "Repositories",
    subtitle: `${formatNumber(stats.repositories.total)} total`,
    ariaLabel: `Repositories for ${stats.username}`,
    theme,
    body: `${summary}${listHeader}${list}`,
  });
}
