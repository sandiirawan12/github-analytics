import { GitHubClient } from "./client.js";
import { USER_CONTRIBUTIONS_QUERY, USER_REPOS_QUERY } from "./queries.js";
import type {
  ContributionDay,
  GitHubEvent,
  RepoNode,
  RepoPageData,
  UserAnalyticsData,
} from "./types.js";

export interface FetchedGitHubData {
  login: string;
  totalCommitContributions: number;
  restrictedContributionsCount: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
  totalContributions: number;
  contributionDays: ContributionDay[];
  repositories: RepoNode[];
  eventHours: number[];
}

function contributionYearRange(now = new Date()): { from: string; to: string } {
  const to = now.toISOString();
  const fromDate = new Date(now);
  fromDate.setUTCFullYear(fromDate.getUTCFullYear() - 1);
  return { from: fromDate.toISOString(), to };
}

async function fetchAllRepos(client: GitHubClient, login: string): Promise<RepoNode[]> {
  const repos: RepoNode[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data: RepoPageData = await client.graphql<RepoPageData>(USER_REPOS_QUERY, {
      login,
      cursor,
    });

    if (!data.user) {
      throw new Error(`GitHub user not found: ${login}`);
    }

    repos.push(...data.user.repositories.nodes);
    hasNextPage = data.user.repositories.pageInfo.hasNextPage;
    cursor = data.user.repositories.pageInfo.endCursor;
  }

  return repos;
}

function hourInTimezone(iso: string, timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const hour = parts.find((part) => part.type === "hour")?.value;
  return Number(hour ?? 0);
}

async function fetchEventHours(
  client: GitHubClient,
  login: string,
  timezone: string,
): Promise<number[]> {
  try {
    const events = await client.rest<GitHubEvent[]>(
      `/users/${encodeURIComponent(login)}/events?per_page=100`,
    );
    return events
      .filter((e) => e.type === "PushEvent" || e.type === "CreateEvent")
      .map((e) => hourInTimezone(e.created_at, timezone));
  } catch {
    return [];
  }
}

export async function fetchGitHubData(
  client: GitHubClient,
  login: string,
  timezone = "UTC",
): Promise<FetchedGitHubData> {
  const { from, to } = contributionYearRange();

  const [analytics, repositories, eventHours] = await Promise.all([
    client.graphql<UserAnalyticsData>(USER_CONTRIBUTIONS_QUERY, { login, from, to }),
    fetchAllRepos(client, login),
    fetchEventHours(client, login, timezone),
  ]);

  if (!analytics.user) {
    throw new Error(`GitHub user not found: ${login}`);
  }

  const contributionDays =
    analytics.user.contributionsCollection.contributionCalendar.weeks.flatMap(
      (week) => week.contributionDays,
    );

  return {
    login: analytics.user.login,
    totalCommitContributions: analytics.user.contributionsCollection.totalCommitContributions,
    restrictedContributionsCount:
      analytics.user.contributionsCollection.restrictedContributionsCount,
    totalPullRequestContributions:
      analytics.user.contributionsCollection.totalPullRequestContributions,
    totalIssueContributions: analytics.user.contributionsCollection.totalIssueContributions,
    totalContributions:
      analytics.user.contributionsCollection.contributionCalendar.totalContributions,
    contributionDays,
    repositories,
    eventHours,
  };
}
