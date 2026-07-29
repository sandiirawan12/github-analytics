import "dotenv/config";

export interface AppConfig {
  githubToken: string;
  githubUsername: string;
  timezone: string;
  outputDir: string;
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

export function loadConfig(): AppConfig {
  return {
    githubToken: requireEnv("GITHUB_TOKEN"),
    githubUsername: requireEnv("GITHUB_USERNAME"),
    timezone: process.env.TIMEZONE?.trim() || "UTC",
    outputDir: process.env.OUTPUT_DIR?.trim() || "./output",
  };
}
