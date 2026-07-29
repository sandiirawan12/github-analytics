import { escapeXml } from "../utils/index.js";
import type { Theme } from "../themes/index.js";

export interface CardFrameOptions {
  width: number;
  height: number;
  title: string;
  subtitle?: string;
  ariaLabel: string;
  theme: Theme;
  body: string;
  generatedAt?: string;
}

export function renderCardFrame(options: CardFrameOptions): string {
  const { width, height, title, subtitle, ariaLabel, theme, body, generatedAt } = options;
  const px = theme.paddingX;

  const subtitleNode = subtitle
    ? `<text x="${width - px}" y="30" fill="${theme.label}" font-size="12" text-anchor="end">${escapeXml(subtitle)}</text>`
    : "";

  const stamp = generatedAt
    ? `<!-- generated-at: ${escapeXml(generatedAt)} -->`
    : `<!-- generated-at: ${new Date().toISOString()} -->`;

  return `<?xml version="1.0" encoding="UTF-8"?>
${stamp}
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(ariaLabel)}">
  <title>${escapeXml(title)}</title>
  <rect width="${width}" height="${height}" rx="${theme.radius}" fill="${theme.background}" stroke="${theme.border}"/>
  <g font-family="${theme.fontFamily}">
    <text x="${px}" y="30" fill="${theme.title}" font-size="16" font-weight="700">${escapeXml(title)}</text>
    ${subtitleNode}
    <line x1="${px}" y1="${theme.headerHeight}" x2="${width - px}" y2="${theme.headerHeight}" stroke="${theme.border}"/>
    ${body}
  </g>
</svg>
`;
}

export function truncateText(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, Math.max(0, maxChars - 1))}…`;
}

export function shortWeekday(day: string): string {
  return day.slice(0, 3);
}

export function monthLabel(month: string): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const index = Number(month.slice(5, 7)) - 1;
  return months[index] ?? month.slice(5);
}
