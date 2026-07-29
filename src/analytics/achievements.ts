import type { AnalyticsResult, Achievement } from "./types.js";

type StatsInput = Omit<AnalyticsResult, "achievements">;

export function computeAchievements(stats: StatsInput): Achievement[] {
  const defs: Array<{
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
  }> = [
    {
      id: "first-commit",
      title: "Hello World",
      description: "Made at least 1 commit",
      unlocked: stats.commits.total >= 1,
    },
    {
      id: "commit-100",
      title: "Centurion",
      description: "Reached 100 commits",
      unlocked: stats.commits.total >= 100,
    },
    {
      id: "commit-500",
      title: "Commit Marathon",
      description: "Reached 500 commits",
      unlocked: stats.commits.total >= 500,
    },
    {
      id: "commit-1000",
      title: "Thousand Club",
      description: "Reached 1,000 commits",
      unlocked: stats.commits.total >= 1000,
    },
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "Current or longest streak ≥ 7 days",
      unlocked: stats.streak.current >= 7 || stats.streak.longest >= 7,
    },
    {
      id: "streak-30",
      title: "Monthly Flame",
      description: "Longest streak ≥ 30 days",
      unlocked: stats.streak.longest >= 30,
    },
    {
      id: "streak-100",
      title: "Centurion Streak",
      description: "Longest streak ≥ 100 days",
      unlocked: stats.streak.longest >= 100,
    },
    {
      id: "polyglot",
      title: "Polyglot",
      description: "Uses 3+ languages",
      unlocked: stats.languages.filter((l) => l.name !== "Others").length >= 3,
    },
    {
      id: "star-collector",
      title: "Star Collector",
      description: "Earned 10+ stars",
      unlocked: stats.stars >= 10,
    },
    {
      id: "repo-builder",
      title: "Repo Builder",
      description: "Owns 5+ repositories",
      unlocked: stats.repositories.total >= 5,
    },
    {
      id: "pr-shipper",
      title: "PR Shipper",
      description: "Opened 10+ pull requests",
      unlocked: stats.pullRequests >= 10,
    },
    {
      id: "consistent",
      title: "Consistent",
      description: "100+ active days this year",
      unlocked: stats.activeDays >= 100,
    },
    {
      id: "social",
      title: "Networked",
      description: "Has 10+ followers",
      unlocked: stats.followers >= 10,
    },
    {
      id: "night-owl",
      title: "Night Owl",
      description: "Most productive between 22:00–05:00",
      unlocked:
        stats.productive.mostActiveHour !== null &&
        (stats.productive.mostActiveHour >= 22 || stats.productive.mostActiveHour <= 5),
    },
    {
      id: "early-bird",
      title: "Early Bird",
      description: "Most productive between 05:00–09:00",
      unlocked:
        stats.productive.mostActiveHour !== null &&
        stats.productive.mostActiveHour >= 5 &&
        stats.productive.mostActiveHour < 9,
    },
  ];

  return defs;
}
