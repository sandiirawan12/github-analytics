import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AnalyticsResult } from "../analytics/types.js";
import type { AnalyticsFileConfig, CardName } from "../config/types.js";
import { resolveTheme } from "../themes/index.js";
import { renderAchievementsCard } from "./achievements.js";
import { renderActivityCard } from "./activity.js";
import { renderContributionsCard } from "./contributions.js";
import { renderDashboardCard } from "./dashboard.js";
import { renderLanguagesCard } from "./languages.js";
import { renderProductiveTimeCard } from "./productive-time.js";
import { renderRepositoriesCard } from "./repositories.js";
import { renderStatsCard } from "./stats.js";
import { renderStreakCard } from "./streak.js";

export type GeneratedCards = Partial<Record<CardName, string>>;

const RENDERERS: Record<CardName, (stats: AnalyticsResult, config: AnalyticsFileConfig) => string> =
  {
    dashboard: (stats, config) =>
      renderDashboardCard(stats, resolveTheme(config.theme), config.show),
    stats: (stats, config) => renderStatsCard(stats, resolveTheme(config.theme), config.show),
    streak: (stats, config) => renderStreakCard(stats, resolveTheme(config.theme)),
    activity: (stats, config) => renderActivityCard(stats, resolveTheme(config.theme), config.show),
    languages: (stats, config) => renderLanguagesCard(stats, resolveTheme(config.theme)),
    "productive-time": (stats, config) =>
      renderProductiveTimeCard(stats, resolveTheme(config.theme)),
    repositories: (stats, config) =>
      renderRepositoriesCard(stats, resolveTheme(config.theme), config.show),
    contributions: (stats, config) => renderContributionsCard(stats, resolveTheme(config.theme)),
    achievements: (stats, config) => renderAchievementsCard(stats, resolveTheme(config.theme)),
  };

export function generateCards(stats: AnalyticsResult, config: AnalyticsFileConfig): GeneratedCards {
  const cards: GeneratedCards = {};
  for (const name of config.cards) {
    cards[name] = RENDERERS[name](stats, config);
  }
  return cards;
}

export async function writeCards(outputDir: string, cards: GeneratedCards): Promise<string[]> {
  await mkdir(outputDir, { recursive: true });

  const written: string[] = [];
  for (const [name, content] of Object.entries(cards)) {
    if (!content) continue;
    const filePath = path.join(outputDir, `${name}.svg`);
    await writeFile(filePath, content, "utf8");
    written.push(filePath);
  }

  return written;
}
