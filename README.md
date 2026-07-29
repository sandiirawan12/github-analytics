# GitHub Analytics

Modern, fast GitHub profile analytics cards — public **and** private stats via Personal Access Token. Pure SVG output (no chart libraries), ready for README embedding.

## Features

| Card      | File            | Contents                                           |
| --------- | --------------- | -------------------------------------------------- |
| Summary   | `summary.svg`   | Commits, streaks, repos, stars, forks, PRs, issues |
| Languages | `languages.svg` | Top languages by bytes                             |
| Activity  | `activity.svg`  | Contribution heatmap + monthly bars                |

## Quick start

### Requirements

- Node.js 20+
- GitHub PAT with access to the target account (`repo`, `read:user` for classic tokens)

### Setup

```bash
cp .env.example .env
# Set GITHUB_TOKEN and GITHUB_USERNAME
npm install
npm run generate
```

Cards are written to `./output/`.

### Scripts

```bash
npm run generate     # Fetch → analyze → write SVGs
npm run dev          # Same as generate
npm run build        # Compile TypeScript
npm run typecheck
npm run lint
npm run format
```

## Embed in README

After the Action publishes the `output` branch:

```md
[![GitHub Analytics](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/summary.svg)](https://github.com/sandiirawan12/github-analytics)
[![Top Languages](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/languages.svg)](https://github.com/sandiirawan12/github-analytics)
[![Activity](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/activity.svg)](https://github.com/sandiirawan12/github-analytics)
```

## GitHub Actions

Workflow [`.github/workflows/generate.yml`](.github/workflows/generate.yml):

1. Runs daily at **00:00 Asia/Jakarta** (`cron: 0 17 * * *` UTC)
2. Also on `workflow_dispatch` and pushes that touch source
3. Generates SVGs and commits them to the **`output`** branch

### Required secret

| Name     | Description                                                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `GH_PAT` | PAT with `repo` + `read:user` (needed for private commit/repo stats). If omitted, the default `github.token` is used (public-only). |

Optional repository variables: `GITHUB_USERNAME`, `TIMEZONE`.

## Environment

| Variable          | Required | Description                            |
| ----------------- | -------- | -------------------------------------- |
| `GITHUB_TOKEN`    | Yes      | PAT                                    |
| `GITHUB_USERNAME` | Yes      | Account to analyze                     |
| `TIMEZONE`        | No       | IANA timezone (default `UTC`)          |
| `OUTPUT_DIR`      | No       | SVG output folder (default `./output`) |

## Project structure

```
src/
  index.ts           # CLI entry
  config/            # Environment
  github/            # GraphQL + REST client
  analytics/         # Metrics (commits, streaks, languages, …)
  svg/               # Hand-written SVG cards
  utils/
output/              # Local generated files (gitignored)
.github/workflows/   # Daily generation → output branch
```

## License

MIT
