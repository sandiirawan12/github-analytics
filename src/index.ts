import { writeFile } from "node:fs/promises";
import path from "node:path";
import { computeAnalytics } from "./analytics/index.js";
import { loadConfig } from "./config/env.js";
import { fetchGitHubData, GitHubClient } from "./github/index.js";
import { generateCards, writeCards } from "./svg/index.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const client = new GitHubClient(config.githubToken);

  console.log("GitHub Analytics");
  console.log("================");
  console.log(`Username : ${config.githubUsername}`);
  console.log(`Timezone : ${config.timezone}`);
  console.log(`Output   : ${config.outputDir}`);
  console.log("");

  console.log("Fetching GitHub data...");
  const data = await fetchGitHubData(client, config.githubUsername, config.timezone);

  console.log("Computing analytics...");
  const stats = computeAnalytics(data);

  console.log("Generating SVG cards...");
  const cards = generateCards(stats);
  const written = await writeCards(config.outputDir, cards);

  const statsPath = path.join(config.outputDir, "stats.json");
  await writeFile(statsPath, `${JSON.stringify(stats, null, 2)}\n`, "utf8");

  console.log("");
  console.log("Summary");
  console.log(
    `  Commits        : ${stats.commits.total} (public ${stats.commits.public}, private ${stats.commits.private})`,
  );
  console.log(
    `  Repositories   : ${stats.repositories.total} (public ${stats.repositories.public}, private ${stats.repositories.private})`,
  );
  console.log(`  Stars / Forks  : ${stats.stars} / ${stats.forks}`);
  console.log(
    `  Streak         : current ${stats.streak.current}, longest ${stats.streak.longest}`,
  );
  console.log(`  Top language   : ${stats.languages[0]?.name ?? "n/a"}`);
  console.log("");
  console.log("Wrote:");
  for (const file of [...written, statsPath]) {
    console.log(`  - ${file}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
});
