export type ThemeName = "github" | "tokyonight" | "dracula" | "catppuccin" | "nord";

export type CardName =
  | "dashboard"
  | "stats"
  | "streak"
  | "activity"
  | "languages"
  | "productive-time"
  | "repositories"
  | "contributions"
  | "achievements";

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

export const ALL_CARDS: CardName[] = [
  "dashboard",
  "stats",
  "streak",
  "activity",
  "languages",
  "productive-time",
  "repositories",
  "contributions",
  "achievements",
];

export const DEFAULT_FILE_CONFIG: AnalyticsFileConfig = {
  theme: "github",
  timezone: "Asia/Jakarta",
  cards: [...ALL_CARDS],
  show: {
    private: true,
    stars: true,
    streak: true,
    productive_time: true,
    followers: true,
  },
  output_dir: "./output",
};
