import type { AnalyticsResult } from "../analytics/types.js";
import type { ShowOptions } from "../config/types.js";
import type { Theme } from "../themes/index.js";
import { escapeXml, formatNumber } from "../utils/index.js";
import { renderCardFrame } from "./layout.js";

export function renderStatsCard(stats: AnalyticsResult, theme: Theme, show: ShowOptions): string {
  const rows: { label: string; value: string }[] = [
    { label: "Total Commits", value: formatNumber(stats.commits.total) },
    { label: "Public Commits", value: formatNumber(stats.commits.public) },
  ];

  if (show.private) {
    rows.push({ label: "Private Commits", value: formatNumber(stats.commits.private) });
  }

  rows.push(
    { label: "Total Repos", value: formatNumber(stats.repositories.total) },
    { label: "Public Repos", value: formatNumber(stats.repositories.public) },
  );

  if (show.private) {
    rows.push({ label: "Private Repos", value: formatNumber(stats.repositories.private) });
  }

  if (show.stars) {
    rows.push(
      { label: "Stars", value: formatNumber(stats.stars) },
      { label: "Forks", value: formatNumber(stats.forks) },
    );
  }

  rows.push(
    { label: "Pull Requests", value: formatNumber(stats.pullRequests) },
    { label: "Issues", value: formatNumber(stats.issues) },
    { label: "Contributions", value: formatNumber(stats.contributions.total) },
    { label: "Active Days", value: formatNumber(stats.activeDays) },
  );

  if (show.followers) {
    rows.push(
      { label: "Followers", value: formatNumber(stats.followers) },
      { label: "Following", value: formatNumber(stats.following) },
    );
  }

  const width = 420;
  const px = theme.paddingX;
  const rowH = 28;
  const top = theme.headerHeight + 14;
  const height = top + rows.length * rowH + 18;

  const body = rows
    .map((row, index) => {
      const y = top + index * rowH;
      return `
    <text x="${px}" y="${y + 14}" fill="${theme.label}" font-size="13">${escapeXml(row.label)}</text>
    <text x="${width - px}" y="${y + 14}" fill="${theme.value}" font-size="13" font-weight="600" text-anchor="end">${escapeXml(row.value)}</text>`;
    })
    .join("");

  return renderCardFrame({
    width,
    height,
    title: "Stats",
    subtitle: `@${stats.username}`,
    ariaLabel: `Stats for ${stats.username}`,
    theme,
    body,
  });
}
