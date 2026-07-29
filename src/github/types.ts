export interface GraphQLError {
  message: string;
  type?: string;
  path?: (string | number)[];
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export interface LanguageEdge {
  size: number;
  node: {
    name: string;
    color: string | null;
  };
}

export interface RepoNode {
  name: string;
  nameWithOwner: string;
  isPrivate: boolean;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string | null } | null;
  languages: {
    edges: LanguageEdge[];
  };
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface UserAnalyticsData {
  user: {
    login: string;
    contributionsCollection: {
      totalCommitContributions: number;
      restrictedContributionsCount: number;
      totalPullRequestContributions: number;
      totalIssueContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: ContributionWeek[];
      };
    };
  } | null;
}

export interface RepoPageData {
  user: {
    repositories: {
      totalCount: number;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: RepoNode[];
    };
  } | null;
}

export interface GitHubEvent {
  type: string;
  created_at: string;
}
