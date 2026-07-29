import type { AnalyticsResult } from "../analytics/types.js";
import { escapeXml, formatNumber } from "../utils/index.js";
import { renderCardFrame } from "./layout.js";
import { CARD_WIDTH, theme } from "./theme.js";

interface Metric {
  label: string;
  value: string;
}

export function renderSummaryCard(stats: AnalyticsResult): string {
  const metrics: Metric[] = [
    { label: "Total Commits", value: formatNumber(stats.commits.total) },
    { label: "Current Streak", value: formatNumber(stats.streak.current) },
    { label: "Public Commits", value: formatNumber(stats.commits.public) },
    { label: "Longest Streak", value: formatNumber(stats.streak.longest) },
    { label: "Private Commits", value: formatNumber(stats.commits.private) },
    { label: "Public Repos", value: formatNumber(stats.repositories.public) },
    { label: "Stars", value: formatNumber(stats.stars) },
    { label: "Private Repos", value: formatNumber(stats.repositories.private) },
    { label: "Forks", value: formatNumber(stats.forks) },
    { label: "Pull Requests", value: formatNumber(stats.pullRequests) },
    { label: "Issues", value: formatNumber(stats.issues) },
    { label: "Contributions", value: formatNumber(stats.contributions.total) },
  ];

  const width = CARD_WIDTH.md;
  const cols = 2;
  const gap = 12;
  const px = theme.paddingX;
  const top = theme.headerHeight + 16;
  const cardW = (width - px * 2 - gap) / cols;
  const cardH = 58;
  const rows = Math.ceil(metrics.length / cols);
  const height = top + rows * (cardH + gap) - gap + 24;

  const body = metrics
    .map((metric, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = px + col * (cardW + gap);
      const y = top + row * (cardH + gap);
      return `
    <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="6" fill="${theme.panel}" stroke="${theme.border}"/>
    <text x="${x + 14}" y="${y + 22}" fill="${theme.label}" font-size="12">${escapeXml(metric.label)}</text>
    <text x="${x + 14}" y="${y + 44}" fill="${theme.value}" font-size="18" font-weight="700">${escapeXml(metric.value)}</text>`;
    })
    .join("");

  return renderCardFrame({
    width,
    height,
    title: "GitHub Analytics",
    subtitle: `@${stats.username}`,
    ariaLabel: `GitHub Analytics summary for ${stats.username}`,
    body,
  });
}
