import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AnalyticsResult } from "../analytics/types.js";
import { renderCommitsCard } from "./commits.js";
import { renderHeatmapCard } from "./heatmap.js";
import { renderLanguagesCard } from "./languages.js";
import { renderMonthlyCard } from "./monthly.js";
import { renderProductiveCard } from "./productive.js";
import { renderReposCard } from "./repos.js";
import { renderStreakCard } from "./streak.js";
import { renderSummaryCard } from "./summary.js";
import { renderWeekdayCard } from "./weekday.js";

export interface GeneratedCards {
  summary: string;
  languages: string;
  heatmap: string;
  monthly: string;
  weekday: string;
  productive: string;
  streak: string;
  commits: string;
  repos: string;
  /** Alias of heatmap for backward compatibility */
  activity: string;
}

export const CARD_FILES: { key: keyof GeneratedCards; name: string }[] = [
  { key: "summary", name: "summary.svg" },
  { key: "languages", name: "languages.svg" },
  { key: "heatmap", name: "heatmap.svg" },
  { key: "monthly", name: "monthly.svg" },
  { key: "weekday", name: "weekday.svg" },
  { key: "productive", name: "productive.svg" },
  { key: "streak", name: "streak.svg" },
  { key: "commits", name: "commits.svg" },
  { key: "repos", name: "repos.svg" },
  { key: "activity", name: "activity.svg" },
];

export function generateCards(stats: AnalyticsResult): GeneratedCards {
  const heatmap = renderHeatmapCard(stats);
  return {
    summary: renderSummaryCard(stats),
    languages: renderLanguagesCard(stats),
    heatmap,
    monthly: renderMonthlyCard(stats),
    weekday: renderWeekdayCard(stats),
    productive: renderProductiveCard(stats),
    streak: renderStreakCard(stats),
    commits: renderCommitsCard(stats),
    repos: renderReposCard(stats),
    activity: heatmap,
  };
}

export async function writeCards(outputDir: string, cards: GeneratedCards): Promise<string[]> {
  await mkdir(outputDir, { recursive: true });

  const written: string[] = [];
  for (const file of CARD_FILES) {
    const filePath = path.join(outputDir, file.name);
    await writeFile(filePath, cards[file.key], "utf8");
    written.push(filePath);
  }

  return written;
}
