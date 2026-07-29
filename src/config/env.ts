import "dotenv/config";
import { loadFileConfig } from "./load.js";
import type { AnalyticsFileConfig } from "./types.js";

export interface AppConfig {
  githubToken: string;
  githubUsername: string;
  timezone: string;
  outputDir: string;
  file: AnalyticsFileConfig;
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env and fill in the values.`,
    );
  }
  return value;
}

export async function loadAppConfig(): Promise<AppConfig> {
  const file = await loadFileConfig();

  return {
    githubToken: requireEnv("GITHUB_TOKEN"),
    githubUsername: requireEnv("GITHUB_USERNAME"),
    timezone: process.env.TIMEZONE?.trim() || file.timezone,
    outputDir: process.env.OUTPUT_DIR?.trim() || file.output_dir,
    file,
  };
}

export type { AnalyticsFileConfig, CardName, ThemeName, ShowOptions } from "./types.js";
