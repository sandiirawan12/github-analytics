import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { computeAchievements, computeAnalytics } from "./analytics/index.js";
import type { AnalyticsResult } from "./analytics/types.js";
import { loadAppConfig } from "./config/env.js";
import { loadFileConfig } from "./config/load.js";
import { fetchGitHubData, GitHubClient } from "./github/index.js";
import { generateCards, writeCards, writeEmbedMarkdown } from "./svg/index.js";

async function loadStatsFromFile(filePath: string): Promise<AnalyticsResult> {
  const raw = JSON.parse(await readFile(filePath, "utf8")) as AnalyticsResult;
  if (!raw.contributions.byHour) {
    raw.contributions.byHour = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
  }
  if (!raw.topRepositories) raw.topRepositories = [];
  if (raw.followers === undefined) raw.followers = 0;
  if (raw.following === undefined) raw.following = 0;
  if (raw.activeDays === undefined) {
    raw.activeDays = raw.contributions.calendar.filter((d) => d.count > 0).length;
  }
  if (!raw.achievements?.length) {
    const { achievements: _a, ...base } = raw;
    raw.achievements = computeAchievements(base);
  }
  return raw;
}

async function main(): Promise<void> {
  const fromStats = process.argv.includes("--from-stats");
  const file = await loadFileConfig();

  const config = fromStats
    ? {
        githubToken: "",
        githubUsername: file.username?.trim() || "local",
        timezone: process.env.TIMEZONE?.trim() || file.timezone,
        outputDir: process.env.OUTPUT_DIR?.trim() || file.output_dir,
        file,
      }
    : await loadAppConfig();

  if (!fromStats && !config.githubUsername) {
    throw new Error(
      "Missing GitHub username. Set `username` in analytics.config.yml or GITHUB_USERNAME / leave empty on Actions to use repo owner.",
    );
  }

  console.log("GitHub Analytics");
  console.log("================");
  console.log(`Mode     : ${fromStats ? "render-from-stats" : "fetch"}`);
  console.log(`Theme    : ${config.file.theme}`);
  console.log(`Cards    : ${config.file.cards.join(", ")}`);
  console.log(`Username : ${config.githubUsername}`);
  console.log(`Timezone : ${config.timezone}`);
  console.log(`Output   : ${config.outputDir}`);
  console.log("");

  let stats: AnalyticsResult;

  if (fromStats) {
    const statsPath = path.join(config.outputDir, "stats.json");
    console.log(`Loading ${statsPath}...`);
    stats = await loadStatsFromFile(statsPath);
  } else {
    console.log("Fetching GitHub data...");
    const client = new GitHubClient(config.githubToken);
    const data = await fetchGitHubData(client, config.githubUsername, config.timezone);
    console.log("Computing analytics...");
    stats = computeAnalytics(data);
  }

  console.log("Generating SVG cards...");
  const cards = generateCards(stats, config.file);
  const written = await writeCards(config.outputDir, cards);

  const statsPath = path.join(config.outputDir, "stats.json");
  await writeFile(statsPath, `${JSON.stringify(stats, null, 2)}\n`, "utf8");

  const updatedAtPath = path.join(config.outputDir, "updated_at.txt");
  await writeFile(updatedAtPath, `${stats.generatedAt}\n`, "utf8");

  const repository =
    process.env.GITHUB_REPOSITORY?.trim() ||
    `${stats.username || config.githubUsername}/github-analytics`;
  const embedPath = await writeEmbedMarkdown(
    config.outputDir,
    stats,
    config.file.cards,
    repository,
  );

  console.log("");
  console.log("Summary");
  console.log(
    `  Commits        : ${stats.commits.total} (public ${stats.commits.public}, private ${stats.commits.private})`,
  );
  console.log(
    `  Repositories   : ${stats.repositories.total} (public ${stats.repositories.public}, private ${stats.repositories.private})`,
  );
  console.log(`  Followers      : ${stats.followers} following ${stats.following}`);
  console.log(`  Stars / Forks  : ${stats.stars} / ${stats.forks}`);
  console.log(
    `  Streak         : current ${stats.streak.current}, longest ${stats.streak.longest}`,
  );
  console.log(`  Generated at   : ${stats.generatedAt}`);
  console.log("");
  console.log("Wrote:");
  for (const filePath of [...written, statsPath, updatedAtPath, embedPath]) {
    console.log(`  - ${filePath}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
});
