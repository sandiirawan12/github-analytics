# GitHub Analytics

Modern, fast GitHub profile analytics cards — public **and** private stats via Personal Access Token. Pure SVG output (no chart libraries), ready for README embedding.

## Cards

| File             | Contents                                       |
| ---------------- | ---------------------------------------------- |
| `summary.svg`    | Metric grid (commits, streak, repos, stars, …) |
| `languages.svg`  | Top languages with spaced bars                 |
| `heatmap.svg`    | Contribution calendar (auto-fit, no overflow)  |
| `monthly.svg`    | Contributions per month                        |
| `weekday.svg`    | Contributions by weekday                       |
| `productive.svg` | Productive hours + peak weekday                |
| `streak.svg`     | Current vs longest streak                      |
| `commits.svg`    | Public vs private commits                      |
| `repos.svg`      | Repos, stars, forks, PRs, issues               |
| `activity.svg`   | Alias of heatmap (compat)                      |

## Quick start

```bash
cp .env.example .env
# Set GITHUB_TOKEN and GITHUB_USERNAME
npm install
npm run generate
```

Re-render cards from existing `output/stats.json` (no API call):

```bash
npm run render
```

## Embed in README

```md
![Summary](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/summary.svg)
![Languages](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/languages.svg)
![Heatmap](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/heatmap.svg)
![Monthly](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/monthly.svg)
![Weekday](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/weekday.svg)
![Productive](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/productive.svg)
![Streak](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/streak.svg)
![Commits](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/commits.svg)
![Repos](https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/repos.svg)
```

## GitHub Actions

Daily at **00:00 Asia/Jakarta**, plus manual/`main` source pushes. Publishes all SVGs to the **`output`** branch.

Secret: `GH_PAT` (`repo` + `read:user`) for private stats.

## License

MIT
