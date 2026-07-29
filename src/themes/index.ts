export interface Theme {
  name: string;
  background: string;
  border: string;
  title: string;
  label: string;
  value: string;
  accent: string;
  accentMuted: string;
  barTrack: string;
  panel: string;
  success: string;
  warning: string;
  private: string;
  public: string;
  heatmap: [string, string, string, string, string];
  fontFamily: string;
  radius: number;
  paddingX: number;
  headerHeight: number;
}

export const themes = {
  github: {
    name: "GitHub",
    background: "#0d1117",
    border: "#30363d",
    title: "#e6edf3",
    label: "#8b949e",
    value: "#e6edf3",
    accent: "#58a6ff",
    accentMuted: "#1f6feb",
    barTrack: "#21262d",
    panel: "#161b22",
    success: "#3fb950",
    warning: "#d29922",
    private: "#a371f7",
    public: "#58a6ff",
    heatmap: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
    radius: 8,
    paddingX: 24,
    headerHeight: 52,
  },
  tokyonight: {
    name: "Tokyonight",
    background: "#1a1b26",
    border: "#292e42",
    title: "#c0caf5",
    label: "#565f89",
    value: "#c0caf5",
    accent: "#7aa2f7",
    accentMuted: "#3d59a1",
    barTrack: "#24283b",
    panel: "#1f2335",
    success: "#9ece6a",
    warning: "#e0af68",
    private: "#bb9af7",
    public: "#7aa2f7",
    heatmap: ["#1f2335", "#283457", "#3d59a1", "#7aa2f7", "#c0caf5"],
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
    radius: 8,
    paddingX: 24,
    headerHeight: 52,
  },
  dracula: {
    name: "Dracula",
    background: "#282a36",
    border: "#44475a",
    title: "#f8f8f2",
    label: "#6272a4",
    value: "#f8f8f2",
    accent: "#8be9fd",
    accentMuted: "#bd93f9",
    barTrack: "#44475a",
    panel: "#21222c",
    success: "#50fa7b",
    warning: "#ffb86c",
    private: "#bd93f9",
    public: "#8be9fd",
    heatmap: ["#21222c", "#44475a", "#6272a4", "#50fa7b", "#8be9fd"],
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
    radius: 8,
    paddingX: 24,
    headerHeight: 52,
  },
  catppuccin: {
    name: "Catppuccin",
    background: "#1e1e2e",
    border: "#313244",
    title: "#cdd6f4",
    label: "#6c7086",
    value: "#cdd6f4",
    accent: "#89b4fa",
    accentMuted: "#74c7ec",
    barTrack: "#313244",
    panel: "#181825",
    success: "#a6e3a1",
    warning: "#f9e2af",
    private: "#cba6f7",
    public: "#89b4fa",
    heatmap: ["#181825", "#313244", "#45475a", "#a6e3a1", "#89b4fa"],
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
    radius: 8,
    paddingX: 24,
    headerHeight: 52,
  },
  nord: {
    name: "Nord",
    background: "#2e3440",
    border: "#3b4252",
    title: "#eceff4",
    label: "#7b88a1",
    value: "#eceff4",
    accent: "#88c0d0",
    accentMuted: "#5e81ac",
    barTrack: "#3b4252",
    panel: "#3b4252",
    success: "#a3be8c",
    warning: "#ebcb8b",
    private: "#b48ead",
    public: "#81a1c1",
    heatmap: ["#3b4252", "#434c5e", "#5e81ac", "#88c0d0", "#a3be8c"],
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
    radius: 8,
    paddingX: 24,
    headerHeight: 52,
  },
} as const satisfies Record<string, Theme>;

export type ThemeId = keyof typeof themes;

export function resolveTheme(name: string): Theme {
  if (name in themes) {
    return themes[name as ThemeId];
  }
  return themes.github;
}
