import type { AnalyticsResult } from "../analytics/types.js";
import { escapeXml, formatNumber } from "../utils/index.js";
import { theme } from "./theme.js";

interface SummaryRow {
  label: string;
  value: string;
}

export function renderSummaryCard(stats: AnalyticsResult): string {
  const rows: SummaryRow[] = [
    { label: "Total Commits", value: formatNumber(stats.commits.total) },
    { label: "Public Commits", value: formatNumber(stats.commits.public) },
    { label: "Private Commits", value: formatNumber(stats.commits.private) },
    { label: "Current Streak", value: formatNumber(stats.streak.current) },
    { label: "Longest Streak", value: formatNumber(stats.streak.longest) },
    { label: "Public Repos", value: formatNumber(stats.repositories.public) },
    { label: "Private Repos", value: formatNumber(stats.repositories.private) },
    { label: "Stars", value: formatNumber(stats.stars) },
    { label: "Forks", value: formatNumber(stats.forks) },
    { label: "Pull Requests", value: formatNumber(stats.pullRequests) },
    { label: "Issues", value: formatNumber(stats.issues) },
  ];

  const width = theme.width.summary;
  const headerHeight = 48;
  const rowHeight = 28;
  const paddingX = 24;
  const height = headerHeight + rows.length * rowHeight + 20;

  const rowNodes = rows
    .map((row, index) => {
      const y = headerHeight + 18 + index * rowHeight;
      return `
  <text x="${paddingX}" y="${y}" fill="${theme.label}" font-size="13">${escapeXml(row.label)}</text>
  <text x="${width - paddingX}" y="${y}" fill="${theme.value}" font-size="13" font-weight="600" text-anchor="end">${escapeXml(row.value)}</text>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="GitHub Analytics summary for ${escapeXml(stats.username)}">
  <title>GitHub Analytics — ${escapeXml(stats.username)}</title>
  <rect width="${width}" height="${height}" rx="8" fill="${theme.background}" stroke="${theme.border}"/>
  <text x="${paddingX}" y="30" fill="${theme.title}" font-size="16" font-weight="700" font-family="${theme.fontFamily}">GitHub Analytics</text>
  <line x1="${paddingX}" y1="${headerHeight}" x2="${width - paddingX}" y2="${headerHeight}" stroke="${theme.border}"/>
  <g font-family="${theme.fontFamily}">${rowNodes}
  </g>
</svg>
`;
}
