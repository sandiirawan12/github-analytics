import type { AnalyticsResult } from "../analytics/types.js";
import type { Theme } from "../themes/index.js";
import { clamp, escapeXml } from "../utils/index.js";
import { renderCardFrame, truncateText } from "./layout.js";

export function renderLanguagesCard(stats: AnalyticsResult, theme: Theme): string {
  const width = 520;
  const languages = stats.languages;
  const px = theme.paddingX;
  const nameWidth = 108;
  const pctWidth = 52;
  const rowHeight = 40;
  const top = theme.headerHeight + 18;
  const barX = px + nameWidth + 12;
  const barMaxWidth = width - barX - pctWidth - px;
  const height = top + Math.max(languages.length, 1) * rowHeight + 16;

  const body =
    languages.length === 0
      ? `<text x="${px}" y="${top + 8}" fill="${theme.label}" font-size="13">No language data</text>`
      : languages
          .map((lang, index) => {
            const y = top + index * rowHeight;
            const barWidth =
              Math.round(clamp((lang.percentage / 100) * barMaxWidth, 2, barMaxWidth) * 10) / 10;
            const name = truncateText(lang.name, 12);
            return `
    <text x="${px}" y="${y + 14}" fill="${theme.value}" font-size="13">${escapeXml(name)}</text>
    <rect x="${barX}" y="${y + 4}" width="${barMaxWidth}" height="12" rx="4" fill="${theme.barTrack}"/>
    <rect x="${barX}" y="${y + 4}" width="${barWidth}" height="12" rx="4" fill="${escapeXml(lang.color)}"/>
    <text x="${width - px}" y="${y + 14}" fill="${theme.label}" font-size="12" text-anchor="end">${lang.percentage}%</text>`;
          })
          .join("");

  return renderCardFrame({
    width,
    height,
    title: "Top Languages",
    subtitle: `@${stats.username}`,
    ariaLabel: `Top languages for ${stats.username}`,
    theme,
    body,
  });
}
