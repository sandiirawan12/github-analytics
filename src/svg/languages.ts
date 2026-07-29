import type { AnalyticsResult } from "../analytics/types.js";
import { clamp, escapeXml } from "../utils/index.js";
import { theme } from "./theme.js";

export function renderLanguagesCard(stats: AnalyticsResult): string {
  const width = theme.width.languages;
  const languages = stats.languages;
  const headerHeight = 48;
  const rowHeight = 36;
  const paddingX = 24;
  const barMaxWidth = width - paddingX * 2 - 140;
  const height = headerHeight + Math.max(languages.length, 1) * rowHeight + 24;

  const rows =
    languages.length === 0
      ? `
  <text x="${paddingX}" y="${headerHeight + 24}" fill="${theme.label}" font-size="13">No language data</text>`
      : languages
          .map((lang, index) => {
            const y = headerHeight + 22 + index * rowHeight;
            const barWidth = clamp((lang.percentage / 100) * barMaxWidth, 2, barMaxWidth);
            return `
  <text x="${paddingX}" y="${y}" fill="${theme.value}" font-size="13">${escapeXml(lang.name)}</text>
  <rect x="${paddingX + 110}" y="${y - 11}" width="${barMaxWidth}" height="10" rx="3" fill="${theme.barTrack}"/>
  <rect x="${paddingX + 110}" y="${y - 11}" width="${barWidth}" height="10" rx="3" fill="${escapeXml(lang.color)}"/>
  <text x="${width - paddingX}" y="${y}" fill="${theme.label}" font-size="12" text-anchor="end">${lang.percentage}%</text>`;
          })
          .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Top languages for ${escapeXml(stats.username)}">
  <title>Top Languages — ${escapeXml(stats.username)}</title>
  <rect width="${width}" height="${height}" rx="8" fill="${theme.background}" stroke="${theme.border}"/>
  <text x="${paddingX}" y="30" fill="${theme.title}" font-size="16" font-weight="700" font-family="${theme.fontFamily}">Top Languages</text>
  <line x1="${paddingX}" y1="${headerHeight}" x2="${width - paddingX}" y2="${headerHeight}" stroke="${theme.border}"/>
  <g font-family="${theme.fontFamily}">${rows}
  </g>
</svg>
`;
}
