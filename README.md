# GitHub Analytics

Self-hosted GitHub profile analytics — generate SVG cards from **your** public + private stats (PAT), with themes and YAML config. No third-party widget service.

Cards are written to [`output/`](./output) on **`main`** and refresh automatically via GitHub Actions.

---

## Use this on your profile (for anyone)

### 1. Fork this repository

Click **Fork** → keep the repo name `github-analytics` (or any name; just update embed URLs later).

> After forking, open the **Actions** tab and click **I understand my workflows, go ahead and enable them**.

### 2. Create a Personal Access Token

Classic token (recommended for private stats):

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Generate new token with scopes:
   - `repo` (private repos + commit cards back to this repo)
   - `read:user`
3. Copy the token (shown once)

Fine-grained token also works if it can read your repos/metadata and push to this analytics repo.

### 3. Add the secret

In **your fork**:

**Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|------|--------|
| `GH_PAT` | the token from step 2 |

Optional repository variables:

| Name | Example | Purpose |
|------|---------|---------|
| `GITHUB_USERNAME` | `your-username` | defaults to fork owner |
| `TIMEZONE` | `Asia/Jakarta` | productive-time hours |

### 4. Run the workflow

**Actions → Generate Analytics → Run workflow**

Wait until it finishes. You should see updated files under `output/` on `main`.

### 5. Embed in your profile README

Create (or edit) the special repo: `https://github.com/YOUR_USERNAME/YOUR_USERNAME`

Paste this (replace `YOUR_USERNAME` and repo name if different):

```md
# GitHub Analytics

<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/dashboard.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/stats.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/streak.svg" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/activity.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/languages.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/productive-time.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/repositories.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/contributions.svg" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/achievements.svg" />
</p>
```

Cards refresh every **6 hours** (and on source pushes / manual runs).

---

## Customize

Edit [`analytics.config.yml`](analytics.config.yml) in your fork:

```yaml
theme: tokyonight # github | tokyonight | dracula | catppuccin | nord

timezone: Asia/Jakarta

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

Remove a card from `cards:` if you do not want that SVG generated.

---

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

---

## Local development

```bash
git clone https://github.com/YOUR_USERNAME/github-analytics.git
cd github-analytics
cp .env.example .env
# set GITHUB_TOKEN + GITHUB_USERNAME
npm install
npm run generate
```

Useful scripts:

| Command | Description |
|---------|-------------|
| `npm run generate` | Fetch live API → write SVGs |
| `npm run render` | Re-render from `output/stats.json` (no API) |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

---

## How it works

```text
GitHub Actions (schedule / manual / push)
        │
        ▼
  GitHub GraphQL + REST (with GH_PAT)
        │
        ▼
  Analytics engine
        │
        ▼
  SVG generators → output/*.svg
        │
        ▼
  Commit to main  (message includes [skip ci])
```

- Only the **`main`** branch is used
- Workflow skips re-runs when only `output/**` or markdown changes
- Without `GH_PAT`, public-ish data may still work via `github.token`, but **private commits/repos need `GH_PAT`**

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Actions tab empty / workflows disabled | Enable Actions on the fork |
| `Resource not accessible by integration` on push | Ensure `GH_PAT` has `repo` and is stored as secret `GH_PAT` |
| Private commits stay `0` | Token missing `repo` / private access; check profile private contribution settings |
| Images not updating on profile | Hard-refresh; Camo cache can lag a few minutes after `output/` commits |
| Wrong user stats | Set variable `GITHUB_USERNAME` or confirm fork owner login |

---

## License

MIT — fork it, change the theme, ship your own cards.
