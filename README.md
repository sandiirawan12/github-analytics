# GitHub Analytics

Modern, fast replacement for github-profile-summary-cards — generates SVG analytics cards from public **and** private GitHub activity (via Personal Access Token).

## Features (roadmap)

| Part | Scope                                                   | Status  |
| ---- | ------------------------------------------------------- | ------- |
| 1    | Project setup (Node, TypeScript, lint, env)             | Done    |
| 2    | GitHub GraphQL API (repos, contributions, languages, …) | Planned |
| 3    | Analytics engine (commits, streaks, productive time, …) | Planned |
| 4    | Summary SVG card                                        | Planned |
| 5    | Language card                                           | Planned |
| 6    | Activity graph / heatmap                                | Planned |
| 7    | GitHub Actions (daily generate → `output` branch)       | Planned |

## Quick start

### Requirements

- Node.js 20+
- GitHub Personal Access Token with access to the target account’s repos

### Setup

```bash
cp .env.example .env
# Edit .env: GITHUB_TOKEN, GITHUB_USERNAME
npm install
```

### Scripts

```bash
npm run dev          # Run entry point (tsx)
npm run build        # Compile TypeScript → dist/
npm start            # Run compiled output
npm run typecheck    # Type-check only
npm run lint         # ESLint
npm run format       # Prettier
npm run generate     # Alias for generating cards (same as dev for now)
```

## Project structure

```
src/
  index.ts           # CLI entry
  config/            # Environment & app config
  github/            # GraphQL client & queries (Part 2)
  analytics/         # Metrics computation (Part 3)
  svg/               # SVG generators (Parts 4–6)
  utils/             # Shared helpers
output/              # Generated SVG files
.github/workflows/   # Daily generation workflow (Part 7)
```

## Environment

| Variable          | Required | Description                                                      |
| ----------------- | -------- | ---------------------------------------------------------------- |
| `GITHUB_TOKEN`    | Yes      | PAT (classic: `read:user`, `repo` — or fine-grained equivalents) |
| `GITHUB_USERNAME` | Yes      | Account to analyze                                               |
| `TIMEZONE`        | No       | IANA timezone (default `UTC`)                                    |
| `OUTPUT_DIR`      | No       | SVG output folder (default `./output`)                           |

## License

MIT
