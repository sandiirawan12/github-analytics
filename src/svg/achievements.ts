import type { AnalyticsResult } from "../analytics/types.js";
import type { Theme } from "../themes/index.js";
import { escapeXml, formatNumber } from "../utils/index.js";
import { renderCardFrame, truncateText } from "./layout.js";

export function renderAchievementsCard(stats: AnalyticsResult, theme: Theme): string {
  const achievements = stats.achievements ?? [];
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);
  const shown = [...unlocked, ...locked].slice(0, 8);

  const width = 760;
  const px = theme.paddingX;
  const top = theme.headerHeight + 16;
  const cols = 2;
  const gap = 12;
  const cardW = (width - px * 2 - gap) / cols;
  const cardH = 64;
  const rows = Math.ceil(Math.max(shown.length, 1) / cols);
  const height = top + rows * (cardH + gap) - gap + 24;

  const body =
    shown.length === 0
      ? `<text x="${px}" y="${top + 8}" fill="${theme.label}" font-size="13">No achievements yet</text>`
      : shown
          .map((item, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = px + col * (cardW + gap);
            const y = top + row * (cardH + gap);
            const fill = item.unlocked ? theme.panel : theme.background;
            const titleColor = item.unlocked ? theme.value : theme.label;
            const accent = item.unlocked ? theme.success : theme.border;
            const status = item.unlocked ? "Unlocked" : "Locked";
            return `
    <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="8" fill="${fill}" stroke="${theme.border}"/>
    <rect x="${x}" y="${y}" width="4" height="${cardH}" rx="2" fill="${accent}"/>
    <text x="${x + 16}" y="${y + 24}" fill="${titleColor}" font-size="14" font-weight="700">${escapeXml(item.title)}</text>
    <text x="${x + 16}" y="${y + 44}" fill="${theme.label}" font-size="11">${escapeXml(truncateText(item.description, 48))}</text>
    <text x="${x + cardW - 14}" y="${y + 24}" fill="${accent}" font-size="11" text-anchor="end">${status}</text>`;
          })
          .join("");

  return renderCardFrame({
    width,
    height,
    title: "Achievements",
    subtitle: `${formatNumber(unlocked.length)} / ${formatNumber(achievements.length)} unlocked`,
    ariaLabel: `Achievements for ${stats.username}`,
    theme,
    body,
  });
}
