import type { RepoNode } from "../github/types.js";
import type { LanguageStat } from "./types.js";

const FALLBACK_COLOR = "#8b949e";

export function aggregateLanguages(repositories: RepoNode[], limit = 5): LanguageStat[] {
  const totals = new Map<string, { size: number; color: string }>();

  for (const repo of repositories) {
    for (const edge of repo.languages.edges) {
      const existing = totals.get(edge.node.name);
      const color = edge.node.color ?? FALLBACK_COLOR;
      if (existing) {
        existing.size += edge.size;
      } else {
        totals.set(edge.node.name, { size: edge.size, color });
      }
    }
  }

  const sorted = [...totals.entries()]
    .map(([name, value]) => ({ name, ...value }))
    .sort((a, b) => b.size - a.size);

  if (sorted.length === 0) {
    return [];
  }

  const top = sorted.slice(0, Math.max(0, limit - 1));
  const rest = sorted.slice(Math.max(0, limit - 1));
  const restSize = rest.reduce((sum, item) => sum + item.size, 0);

  const rows =
    rest.length > 1
      ? [...top, { name: "Others", size: restSize, color: FALLBACK_COLOR }]
      : sorted.slice(0, limit);

  const totalSize = rows.reduce((sum, item) => sum + item.size, 0) || 1;

  return rows.map((row) => ({
    name: row.name,
    color: row.color,
    size: row.size,
    percentage: Math.round((row.size / totalSize) * 1000) / 10,
  }));
}
