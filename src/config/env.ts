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

function resolveUsername(file: AnalyticsFileConfig): string {
  const fromEnv = process.env.GITHUB_USERNAME?.trim();
  if (fromEnv) return fromEnv;

  const fromConfig = file.username?.trim();
  if (fromConfig) return fromConfig;

  const fromOwner = process.env.GITHUB_REPOSITORY_OWNER?.trim();
  if (fromOwner) return fromOwner;

  throw new Error(
    'Missing GitHub username. Set `username` in analytics.config.yml, or GITHUB_USERNAME in .env (on Actions, repo owner is used automatically).',
  );
}

export async function loadAppConfig(): Promise<AppConfig> {
  const file = await loadFileConfig();

  return {
    githubToken: requireEnv("GITHUB_TOKEN"),
    githubUsername: resolveUsername(file),
    timezone: process.env.TIMEZONE?.trim() || file.timezone,
    outputDir: process.env.OUTPUT_DIR?.trim() || file.output_dir,
    file,
  };
}

export type { AnalyticsFileConfig, CardName, ThemeName, ShowOptions } from "./types.js";
