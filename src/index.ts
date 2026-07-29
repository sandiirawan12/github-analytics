import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { computeAchievements, computeAnalytics } from "./analytics/index.js";
import type { AnalyticsResult } from "./analytics/types.js";
import { loadAppConfig } from "./config/env.js";
import { loadFileConfig } from "./config/load.js";
import type { AnalyticsFileConfig } from "./config/types.js";
import { loadUsers } from "./config/users.js";
import { fetchGitHubData, GitHubClient } from "./github/index.js";
import { generateCards, writeCards } from "./svg/index.js";

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

async function generateForUser(options: {
  username: string;
  token: string;
  timezone: string;
  outputRoot: string;
  fileConfig: AnalyticsFileConfig;
  fromStats: boolean;
}): Promise<void> {
  const { username, token, timezone, outputRoot, fileConfig, fromStats } = options;
  const userDir = path.join(outputRoot, username.toLowerCase());

  console.log(`\n→ ${username}`);
  console.log(`  output: ${userDir}`);

  let stats: AnalyticsResult;

  if (fromStats) {
    const statsPath = path.join(userDir, "stats.json");
    console.log(`  loading ${statsPath}...`);
    stats = await loadStatsFromFile(statsPath);
  } else {
    console.log("  fetching GitHub data...");
    const client = new GitHubClient(token);
    const data = await fetchGitHubData(client, username, timezone);
    console.log("  computing analytics...");
    stats = computeAnalytics(data);
  }

  console.log("  generating SVG cards...");
  const cards = generateCards(stats, fileConfig);
  const written = await writeCards(userDir, cards);
  const statsPath = path.join(userDir, "stats.json");
  await writeFile(statsPath, `${JSON.stringify(stats, null, 2)}\n`, "utf8");

  console.log(
    `  commits=${stats.commits.total} streak=${stats.streak.current}/${stats.streak.longest} cards=${written.length}`,
  );
}

async function main(): Promise<void> {
  const fromStats = process.argv.includes("--from-stats");
  const onlyArg = process.argv.find((arg) => arg.startsWith("--user="));
  const onlyUser = onlyArg?.slice("--user=".length).trim().toLowerCase();

  const file = await loadFileConfig();
  const config = fromStats
    ? {
        githubToken: "",
        githubUsername: "",
        timezone: process.env.TIMEZONE?.trim() || file.timezone,
        outputDir: process.env.OUTPUT_DIR?.trim() || file.output_dir,
        file,
      }
    : await loadAppConfig();

  let users = await loadUsers(process.cwd(), process.env.GITHUB_REPOSITORY_OWNER);
  if (onlyUser) {
    users = [onlyUser];
  }

  console.log("GitHub Analytics");
  console.log("================");
  console.log(`Mode     : ${fromStats ? "render-from-stats" : "fetch"}`);
  console.log(`Theme    : ${config.file.theme}`);
  console.log(`Cards    : ${config.file.cards.join(", ")}`);
  console.log(`Users    : ${users.join(", ")}`);
  console.log(`Output   : ${config.outputDir}/{username}/`);
  console.log(`Timezone : ${config.timezone}`);

  const failed: string[] = [];

  for (const username of users) {
    try {
      await generateForUser({
        username,
        token: config.githubToken,
        timezone: config.timezone,
        outputRoot: config.outputDir,
        fileConfig: config.file,
        fromStats,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  ERROR for ${username}: ${message}`);
      failed.push(username);
    }
  }

  if (failed.length > 0) {
    throw new Error(`Failed generating cards for: ${failed.join(", ")}`);
  }

  console.log("\nDone.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
});
