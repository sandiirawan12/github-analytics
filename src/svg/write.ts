import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AnalyticsResult } from "../analytics/types.js";
import { renderActivityCard } from "./activity.js";
import { renderLanguagesCard } from "./languages.js";
import { renderSummaryCard } from "./summary.js";

export interface GeneratedCards {
  summary: string;
  languages: string;
  activity: string;
}

export function generateCards(stats: AnalyticsResult): GeneratedCards {
  return {
    summary: renderSummaryCard(stats),
    languages: renderLanguagesCard(stats),
    activity: renderActivityCard(stats),
  };
}

export async function writeCards(outputDir: string, cards: GeneratedCards): Promise<string[]> {
  await mkdir(outputDir, { recursive: true });

  const files = [
    { name: "summary.svg", content: cards.summary },
    { name: "languages.svg", content: cards.languages },
    { name: "activity.svg", content: cards.activity },
  ];

  const written: string[] = [];
  for (const file of files) {
    const filePath = path.join(outputDir, file.name);
    await writeFile(filePath, file.content, "utf8");
    written.push(filePath);
  }

  return written;
}
