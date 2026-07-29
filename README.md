# GitHub Analytics

Self-hosted GitHub profile analytics SVGs — fork, add your PAT, embed in your README. Public + private stats, themes, YAML config.

Cards live on **`main`** under [`output/`](./output) and refresh **every hour** from the live GitHub API (commits, streak, languages, …).

---

## Use on your profile (fork)

### 1. Fork this repository

Enable **Actions** on your fork when prompted.

### 2. Add secret `GH_PAT`

Create a Personal Access Token (classic) with:

- `repo`
- `read:user`

Then: **Settings → Secrets and variables → Actions → New secret**

| Name | Value |
|------|--------|
| `GH_PAT` | your token |

**Username is automatic** (= fork owner). Optional override in `analytics.config.yml`:

```yaml
username: your-github-username
```

### 3. Run workflow

**Actions → Generate Analytics → Run workflow**

After it finishes, open [`output/embed.md`](./output/embed.md) — copy that snippet into your profile README. The `?v=…` query param busts GitHub’s image cache so numbers stay fresh.

### 4. Embed in your profile README

Repo: `YOUR_USERNAME/YOUR_USERNAME` — replace `YOUR_USERNAME` (and prefer the generated `output/embed.md`):

```md
<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/dashboard.svg?v=1" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/stats.svg?v=1" />
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/streak.svg?v=1" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/activity.svg?v=1" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/languages.svg?v=1" />
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/productive-time.svg?v=1" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/repositories.svg?v=1" />
  <img width="49%" src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/contributions.svg?v=1" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/github-analytics/main/output/achievements.svg?v=1" />
</p>
```

Template: [`PROFILE_README.example.md`](./PROFILE_README.example.md)

### Optional: auto-update profile cache bust

So the profile always picks up new `?v=` without editing by hand:

**Settings → Secrets and variables → Actions → Variables**

| Name | Value |
|------|--------|
| `PROFILE_REPO` | `YOUR_USERNAME/YOUR_USERNAME` |

Requires `GH_PAT` with access to that repo. Each hourly run rewrites `?v=` on matching image URLs in the profile README.

---

## Customize

[`analytics.config.yml`](analytics.config.yml):

```yaml
username: "" # empty = auto (repo owner)
theme: tokyonight # github | tokyonight | dracula | catppuccin | nord
timezone: Asia/Jakarta
```

---

## Cards

| File | Contents |
|------|----------|
| `output/dashboard.svg` | Overview metrics |
| `output/stats.svg` | Compact stats |
| `output/streak.svg` | Current / longest streak |
| `output/activity.svg` | Heatmap + trends |
| `output/languages.svg` | Top languages |
| `output/productive-time.svg` | Productive hours |
| `output/repositories.svg` | Repo analytics |
| `output/contributions.svg` | Monthly contributions |
| `output/achievements.svg` | Achievements |
| `output/embed.md` | Ready-to-paste README snippet (cache-busted) |

---

## Local

```bash
cp .env.example .env
npm install
npm run generate
```

## License

MIT
