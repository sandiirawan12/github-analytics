import { loadConfig } from "./config/env.js";

async function main(): Promise<void> {
  const config = loadConfig();

  console.log("GitHub Analytics");
  console.log("================");
  console.log(`Username : ${config.githubUsername}`);
  console.log(`Timezone : ${config.timezone}`);
  console.log(`Output   : ${config.outputDir}`);
  console.log("");
  console.log("Project scaffold ready. Next: Part 2 — GitHub GraphQL API.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
});
