import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import {
  ALL_CARDS,
  DEFAULT_FILE_CONFIG,
  type AnalyticsFileConfig,
  type CardName,
  type ThemeName,
} from "./types.js";

const CONFIG_CANDIDATES = ["analytics.config.yml", "analytics.config.yaml", "config.yml"];

const VALID_THEMES = new Set<ThemeName>(["github", "tokyonight", "dracula", "catppuccin", "nord"]);

const VALID_CARDS = new Set<CardName>(ALL_CARDS);

export async function loadFileConfig(cwd = process.cwd()): Promise<AnalyticsFileConfig> {
  for (const name of CONFIG_CANDIDATES) {
    const filePath = path.join(cwd, name);
    try {
      const raw = await readFile(filePath, "utf8");
      return normalizeConfig(parseYaml(raw) as Partial<AnalyticsFileConfig>);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") continue;
      throw error;
    }
  }

  return {
    ...DEFAULT_FILE_CONFIG,
    cards: [...DEFAULT_FILE_CONFIG.cards],
    show: { ...DEFAULT_FILE_CONFIG.show },
  };
}

function normalizeConfig(input: Partial<AnalyticsFileConfig>): AnalyticsFileConfig {
  const theme = (input.theme ?? DEFAULT_FILE_CONFIG.theme) as ThemeName;
  if (!VALID_THEMES.has(theme)) {
    throw new Error(
      `Unknown theme "${String(input.theme)}". Valid: ${[...VALID_THEMES].join(", ")}`,
    );
  }

  const cards = (input.cards?.length ? input.cards : DEFAULT_FILE_CONFIG.cards).filter(
    (card): card is CardName => VALID_CARDS.has(card as CardName),
  );

  if (cards.length === 0) {
    throw new Error(`config.cards must include at least one valid card: ${ALL_CARDS.join(", ")}`);
  }

  return {
    theme,
    timezone: input.timezone?.trim() || DEFAULT_FILE_CONFIG.timezone,
    cards,
    output_dir: input.output_dir?.trim() || DEFAULT_FILE_CONFIG.output_dir,
    show: {
      private: input.show?.private ?? DEFAULT_FILE_CONFIG.show.private,
      stars: input.show?.stars ?? DEFAULT_FILE_CONFIG.show.stars,
      streak: input.show?.streak ?? DEFAULT_FILE_CONFIG.show.streak,
      productive_time: input.show?.productive_time ?? DEFAULT_FILE_CONFIG.show.productive_time,
      followers: input.show?.followers ?? DEFAULT_FILE_CONFIG.show.followers,
    },
  };
}
