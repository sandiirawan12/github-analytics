export type ThemeName = "github" | "tokyonight" | "dracula" | "catppuccin" | "nord";

export type CardName = "dashboard" | "activity" | "languages" | "repositories";

export interface ShowOptions {
  private: boolean;
  stars: boolean;
  streak: boolean;
  productive_time: boolean;
  followers: boolean;
}

export interface AnalyticsFileConfig {
  theme: ThemeName;
  timezone: string;
  cards: CardName[];
  show: ShowOptions;
  output_dir: string;
}

export const DEFAULT_FILE_CONFIG: AnalyticsFileConfig = {
  theme: "github",
  timezone: "Asia/Jakarta",
  cards: ["dashboard", "activity", "languages", "repositories"],
  show: {
    private: true,
    stars: true,
    streak: true,
    productive_time: true,
    followers: true,
  },
  output_dir: "./output",
};
