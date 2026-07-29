import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { AnalyticsResult } from "../analytics/types.js";
import type { CardName } from "../config/types.js";

function cacheBust(iso: string): string {
  return iso.replace(/\.\d{3}Z$/, "Z").replace(/[-:]/g, "");
}

function cardImg(repo: string, name: CardName, bust: string, width?: string): string {
  const src = `https://raw.githubusercontent.com/${repo}/main/output/${name}.svg?v=${bust}`;
  const widthAttr = width ? ` width="${width}"` : "";
  return `  <img${widthAttr} src="${src}" />`;
}

export function renderEmbedMarkdown(
  stats: AnalyticsResult,
  cards: CardName[],
  repository: string,
): string {
  const bust = cacheBust(stats.generatedAt);
  const set = new Set(cards);
  const lines: string[] = [
    `<!-- Auto-generated - copy into YOUR_USERNAME/YOUR_USERNAME README -->`,
    `<!-- ?v=${bust} busts GitHub's image cache so commits/stats look fresh -->`,
    "",
  ];

  if (set.has("dashboard")) {
    lines.push("<p align=\"center\">", cardImg(repository, "dashboard", bust), "</p>", "");
  }

  if (set.has("stats") || set.has("streak")) {
    lines.push("<p align=\"center\">");
    if (set.has("stats")) lines.push(cardImg(repository, "stats", bust, "49%"));
    if (set.has("streak")) lines.push(cardImg(repository, "streak", bust, "49%"));
    lines.push("</p>", "");
  }

  if (set.has("activity")) {
    lines.push("<p align=\"center\">", cardImg(repository, "activity", bust), "</p>", "");
  }

  if (set.has("languages") || set.has("productive-time")) {
    lines.push("<p align=\"center\">");
    if (set.has("languages")) lines.push(cardImg(repository, "languages", bust, "49%"));
    if (set.has("productive-time")) {
      lines.push(cardImg(repository, "productive-time", bust, "49%"));
    }
    lines.push("</p>", "");
  }

  if (set.has("repositories") || set.has("contributions")) {
    lines.push("<p align=\"center\">");
    if (set.has("repositories")) lines.push(cardImg(repository, "repositories", bust, "49%"));
    if (set.has("contributions")) lines.push(cardImg(repository, "contributions", bust, "49%"));
    lines.push("</p>", "");
  }

  if (set.has("achievements")) {
    lines.push("<p align=\"center\">", cardImg(repository, "achievements", bust), "</p>", "");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

export async function writeEmbedMarkdown(
  outputDir: string,
  stats: AnalyticsResult,
  cards: CardName[],
  repository: string,
): Promise<string> {
  const filePath = path.join(outputDir, "embed.md");
  await writeFile(filePath, renderEmbedMarkdown(stats, cards, repository), "utf8");
  return filePath;
}
