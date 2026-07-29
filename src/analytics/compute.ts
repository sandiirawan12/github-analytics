import type { FetchedGitHubData } from "../github/fetch.js";
import { monthKey, mode, weekdayName } from "../utils/index.js";
import { computeAchievements } from "./achievements.js";
import { aggregateLanguages } from "./languages.js";
import { computeStreaks } from "./streak.js";
import type { AnalyticsResult } from "./types.js";

const WEEKDAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function computeAnalytics(data: FetchedGitHubData): AnalyticsResult {
  const publicCommits = data.totalCommitContributions;
  const privateCommits = data.restrictedContributionsCount;
  const publicRepos = data.repositories.filter((r) => !r.isPrivate).length;
  const privateRepos = data.repositories.filter((r) => r.isPrivate).length;

  const stars = data.repositories.reduce((sum, r) => sum + r.stargazerCount, 0);
  const forks = data.repositories.reduce((sum, r) => sum + r.forkCount, 0);

  const byMonthMap = new Map<string, number>();
  const byWeekdayMap = new Map<string, number>();
  let activeDays = 0;

  for (const day of data.contributionDays) {
    if (day.contributionCount > 0) activeDays += 1;

    const month = monthKey(day.date);
    byMonthMap.set(month, (byMonthMap.get(month) ?? 0) + day.contributionCount);

    const weekday = weekdayName(day.date);
    byWeekdayMap.set(weekday, (byWeekdayMap.get(weekday) ?? 0) + day.contributionCount);
  }

  const byMonth = [...byMonthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const byWeekday = WEEKDAY_ORDER.map((day) => ({
    day,
    count: byWeekdayMap.get(day) ?? 0,
  }));

  const mostActiveWeekday = [...byWeekday].sort((a, b) => b.count - a.count)[0]?.day ?? "Monday";

  const hourCounts = new Map<number, number>();
  for (const hour of data.eventHours) {
    hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
  }
  const byHour = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourCounts.get(hour) ?? 0,
  }));

  const topRepositories = [...data.repositories]
    .sort((a, b) => b.stargazerCount - a.stargazerCount || b.forkCount - a.forkCount)
    .slice(0, 5)
    .map((repo) => ({
      name: repo.name,
      nameWithOwner: repo.nameWithOwner,
      isPrivate: repo.isPrivate,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      language: repo.primaryLanguage?.name ?? null,
      languageColor: repo.primaryLanguage?.color ?? null,
    }));

  const base = {
    username: data.login,
    generatedAt: new Date().toISOString(),
    followers: data.followers,
    following: data.following,
    commits: {
      total: publicCommits + privateCommits,
      public: publicCommits,
      private: privateCommits,
    },
    repositories: {
      total: data.repositories.length,
      public: publicRepos,
      private: privateRepos,
    },
    stars,
    forks,
    pullRequests: data.totalPullRequestContributions,
    issues: data.totalIssueContributions,
    activeDays,
    streak: computeStreaks(data.contributionDays),
    contributions: {
      total: data.totalContributions,
      byMonth,
      byWeekday,
      byHour,
      calendar: data.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        color: d.color,
      })),
    },
    languages: aggregateLanguages(data.repositories),
    topRepositories,
    productive: {
      mostActiveWeekday,
      mostActiveHour: mode(data.eventHours),
    },
  };

  return {
    ...base,
    achievements: computeAchievements(base),
  };
}
