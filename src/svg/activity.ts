import type { AnalyticsResult } from "../analytics/types.js";
import { renderHeatmapCard } from "./heatmap.js";

/** @deprecated Prefer dedicated heatmap + monthly cards; kept for compatibility. */
export function renderActivityCard(stats: AnalyticsResult): string {
  return renderHeatmapCard(stats);
}
