import type { GraphQLResponse } from "./types.js";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_API_URL = "https://api.github.com";

export class GitHubApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export class GitHubClient {
  constructor(private readonly token: string) {}

  async graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "github-analytics",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new GitHubApiError(`GitHub GraphQL HTTP ${response.status}: ${body}`, response.status);
    }

    const payload = (await response.json()) as GraphQLResponse<T>;

    if (payload.errors?.length) {
      const messages = payload.errors.map((e) => e.message).join("; ");
      throw new GitHubApiError(`GitHub GraphQL error: ${messages}`);
    }

    if (!payload.data) {
      throw new GitHubApiError("GitHub GraphQL returned empty data");
    }

    return payload.data;
  }

  async rest<T>(path: string): Promise<T> {
    const response = await fetch(`${GITHUB_API_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "github-analytics",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new GitHubApiError(`GitHub REST HTTP ${response.status}: ${body}`, response.status);
    }

    return (await response.json()) as T;
  }
}
