# GitHub Analytics

Self-hosted GitHub profile analytics SVGs — themes, YAML config, public + private stats via PAT.

## Cards

| File                  | Contents                     |
| --------------------- | ---------------------------- |
| `dashboard.svg`       | Full overview metrics        |
| `stats.svg`           | Compact stats list           |
| `streak.svg`          | Current / longest streak     |
| `activity.svg`        | Heatmap + monthly + weekday  |
| `languages.svg`       | Top languages                |
| `productive-time.svg` | Hours + weekday productivity |
| `repositories.svg`    | Repo totals + top repos      |
| `contributions.svg`   | Monthly contributions        |
| `achievements.svg`    | Unlocked / locked badges     |

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

show:
  private: true
  stars: true
  streak: true
  productive_time: true
  followers: true
```

## Quick start

```bash
cp .env.example .env
npm install
npm run generate
```

## Profile README embed

```md
# 📊 GitHub Analytics

<p align="center">
  <img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/dashboard.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/stats.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/streak.svg" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/activity.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/languages.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/productive-time.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/repositories.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/contributions.svg" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/achievements.svg" />
</p>
```

## GitHub Actions

Daily at **00:00 Asia/Jakarta**. Secret `GH_PAT` (`repo` + `read:user`) for private stats. Publishes to `output` branch.

## License

MIT
