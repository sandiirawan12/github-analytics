# GitHub Analytics

Self-hosted GitHub profile analytics — **dashboard-first** SVG cards, multi-theme, public + private stats via PAT. No third-party widget service.

## Design

Instead of flooding a README with 15+ small SVGs, this project generates **four core cards**:

| Card         | File               | Contents                                                                  |
| ------------ | ------------------ | ------------------------------------------------------------------------- |
| Dashboard    | `dashboard.svg`    | Commits, streak, repos, stars, PRs, issues, followers, productive time, … |
| Activity     | `activity.svg`     | Contribution heatmap + monthly + weekday trends                           |
| Languages    | `languages.svg`    | Top languages                                                             |
| Repositories | `repositories.svg` | Repo totals + top repositories                                            |

## Configure

Edit [`analytics.config.yml`](analytics.config.yml):

```yaml
theme: tokyonight # github | tokyonight | dracula | catppuccin | nord

cards:
  - dashboard
  - activity
  - languages
  - repositories

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
# GITHUB_TOKEN + GITHUB_USERNAME
npm install
npm run generate
```

Re-render from cached `output/stats.json`:

```bash
npm run render
```

## Embed in README (recommended)

```md
<img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/dashboard.svg" />

<img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/activity.svg" />

<img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/languages.svg" />
<img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/output/repositories.svg" />
```

Keep it to these four — fast to load, easy to scan.

## GitHub Actions

Daily at **00:00 Asia/Jakarta**. Set secret `GH_PAT` (`repo` + `read:user`) for private stats. Cards publish to the `output` branch.

## Themes

`github` · `tokyonight` · `dracula` · `catppuccin` · `nord`

## License

MIT
