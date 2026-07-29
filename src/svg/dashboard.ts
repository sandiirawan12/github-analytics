import type { AnalyticsResult } from "../analytics/types.js";
import type { ShowOptions } from "../config/types.js";
import type { Theme } from "../themes/index.js";
import { escapeXml, formatNumber } from "../utils/index.js";
import { renderCardFrame } from "./layout.js";

interface Metric {
  label: string;
  value: string;
}

export function renderDashboardCard(
  stats: AnalyticsResult,
  theme: Theme,
  show: ShowOptions,
): string {
  const metrics: Metric[] = [{ label: "Total Commits", value: formatNumber(stats.commits.total) }];

  if (show.private) {
    metrics.push(
      { label: "Public Commits", value: formatNumber(stats.commits.public) },
      { label: "Private Commits", value: formatNumber(stats.commits.private) },
    );
  }

  if (show.streak) {
    metrics.push(
      { label: "Current Streak", value: formatNumber(stats.streak.current) },
      { label: "Longest Streak", value: formatNumber(stats.streak.longest) },
    );
  }

  metrics.push({ label: "Public Repos", value: formatNumber(stats.repositories.public) });

  if (show.private) {
    metrics.push({ label: "Private Repos", value: formatNumber(stats.repositories.private) });
  }

  if (show.stars) {
    metrics.push(
      { label: "Stars", value: formatNumber(stats.stars) },
      { label: "Forks", value: formatNumber(stats.forks) },
    );
  }

  metrics.push(
    { label: "Pull Requests", value: formatNumber(stats.pullRequests) },
    { label: "Issues", value: formatNumber(stats.issues) },
    { label: "Contributions", value: formatNumber(stats.contributions.total) },
    { label: "Active Days", value: formatNumber(stats.activeDays) },
  );

  if (show.followers) {
    metrics.push(
      { label: "Followers", value: formatNumber(stats.followers) },
      { label: "Following", value: formatNumber(stats.following) },
    );
  }

  if (show.productive_time) {
    const hour =
      stats.productive.mostActiveHour === null
        ? "n/a"
        : `${String(stats.productive.mostActiveHour).padStart(2, "0")}:00`;
    metrics.push(
      { label: "Best Weekday", value: stats.productive.mostActiveWeekday },
      { label: "Productive Time", value: hour },
    );
  }

  const width = 560;
  const cols = 2;
  const gap = 12;
  const px = theme.paddingX;
  const top = theme.headerHeight + 16;
  const cardW = (width - px * 2 - gap) / cols;
  const cardH = 56;
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
    title: "GitHub Dashboard",
    subtitle: `@${stats.username}`,
    ariaLabel: `GitHub dashboard for ${stats.username}`,
    theme,
    body,
    generatedAt: stats.generatedAt,
  });
}
