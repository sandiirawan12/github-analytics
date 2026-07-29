import type { AnalyticsResult } from "../analytics/types.js";
import type { Theme } from "../themes/index.js";
import { clamp, escapeXml, formatNumber } from "../utils/index.js";
import { renderCardFrame, shortWeekday } from "./layout.js";

export function renderProductiveTimeCard(stats: AnalyticsResult, theme: Theme): string {
  const hours =
    stats.contributions.byHour ?? Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
  const weekdays = stats.contributions.byWeekday;
  const width = 520;
  const px = theme.paddingX;
  const top = theme.headerHeight + 18;
  const chartH = 90;
  const gap = 4;
  const barW = Math.floor((width - px * 2 - gap * 23) / 24);
  const maxHour = Math.max(...hours.map((h) => h.count), 1);
  const hasHourData = hours.some((h) => h.count > 0);
  const maxWeekday = Math.max(...weekdays.map((d) => d.count), 1);
  const weekdayTop = top + chartH + 48;
  const weekdayGap = 10;
  const weekdayBarW = Math.floor((width - px * 2 - weekdayGap * 6) / 7);
  const height = weekdayTop + chartH + 40;

  const hourBars = hours
    .map((item, index) => {
      const h = hasHourData
        ? clamp((item.count / maxHour) * chartH, item.count > 0 ? 3 : 0, chartH)
        : 0;
      const x = px + index * (barW + gap);
      const y = top + chartH - h;
      const active = item.hour === stats.productive.mostActiveHour;
      const showLabel = index % 4 === 0;
      return `
    <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="2" fill="${active ? theme.success : theme.accent}"/>
    ${showLabel ? `<text x="${x + barW / 2}" y="${top + chartH + 14}" fill="${theme.label}" font-size="9" text-anchor="middle">${String(item.hour).padStart(2, "0")}</text>` : ""}`;
    })
    .join("");

  const weekdayBars = weekdays
    .map((day, index) => {
      const h = clamp((day.count / maxWeekday) * chartH, day.count > 0 ? 3 : 0, chartH);
      const x = px + index * (weekdayBarW + weekdayGap);
      const y = weekdayTop + chartH - h;
      const active = day.day === stats.productive.mostActiveWeekday;
      return `
    <rect x="${x}" y="${y}" width="${weekdayBarW}" height="${h}" rx="3" fill="${active ? theme.success : theme.accent}"/>
    <text x="${x + weekdayBarW / 2}" y="${weekdayTop + chartH + 14}" fill="${theme.label}" font-size="10" text-anchor="middle">${shortWeekday(day.day)}</text>`;
    })
    .join("");

  const peak =
    stats.productive.mostActiveHour === null
      ? stats.productive.mostActiveWeekday
      : `${stats.productive.mostActiveWeekday} · ${String(stats.productive.mostActiveHour).padStart(2, "0")}:00`;

  const emptyNote = hasHourData
    ? ""
    : `<text x="${px}" y="${top + 40}" fill="${theme.label}" font-size="11">Hourly sample unavailable — weekday chart still shown</text>`;

  return renderCardFrame({
    width,
    height,
    title: "Productive Time",
    subtitle: escapeXml(peak),
    ariaLabel: `Productive time for ${stats.username}`,
    theme,
    body: `
    <text x="${px}" y="${top - 2}" fill="${theme.value}" font-size="12" font-weight="600">Hours</text>
    ${hourBars}
    ${emptyNote}
    <text x="${px}" y="${weekdayTop - 8}" fill="${theme.value}" font-size="12" font-weight="600">Weekdays · ${formatNumber(stats.contributions.total)} contrib</text>
    ${weekdayBars}
    `,
  });
}
