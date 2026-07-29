# GitHub Analytics

Self-hosted GitHub profile analytics SVGs — themes, YAML config, public + private stats via PAT.

Cards live on **`main`** under [`output/`](./output) and refresh every **6 hours** via Actions (live GitHub API).

## Cards

| File | Contents |
|------|----------|
| `output/dashboard.svg` | Full overview metrics |
| `output/stats.svg` | Compact stats list |
| `output/streak.svg` | Current / longest streak |
| `output/activity.svg` | Heatmap + monthly + weekday |
| `output/languages.svg` | Top languages |
| `output/productive-time.svg` | Hours + weekday productivity |
| `output/repositories.svg` | Repo totals + top repos |
| `output/contributions.svg` | Monthly contributions |
| `output/achievements.svg` | Unlocked / locked badges |

## Configure

[`analytics.config.yml`](analytics.config.yml):

```yaml
theme: github # github | tokyonight | dracula | catppuccin | nord

cards:
  - dashboard
  - stats
  - streak
  - activity
  - languages
  - productive-time
  - repositories
  - contributions
  - achievements
```

## Quick start

```bash
cp .env.example .env
npm install
npm run generate
```

## Profile README embed

```md
# GitHub Analytics

<p align="center">
  <img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/dashboard.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/stats.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/streak.svg" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/activity.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/languages.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/productive-time.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/repositories.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/contributions.svg" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/achievements.svg" />
</p>
```

## Freshness

- Actions runs on a **6-hour schedule**, `workflow_dispatch`, and source pushes to `main`
- Each run fetches the **live GitHub API** and commits updated files under `output/` on `main`
- Commits use `[skip ci]` so card updates do not re-trigger the workflow loop

Set secret `GH_PAT` (`repo` + `read:user`) for private stats.

## License

MIT
