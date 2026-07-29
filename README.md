# GitHub Analytics

Self-hosted GitHub profile analytics — generate SVG cards from **your** public + private stats (PAT), with themes and YAML config. No third-party widget service.

Cards are written to [`output/`](./output) on **`main`** and refresh automatically via GitHub Actions.

---

## Use this on your profile (for anyone)

### Paling sederhana

1. **Fork** repo ini  
2. Aktifkan **Actions**  
3. Tambah secret **`GH_PAT`** (token dengan `repo` + `read:user`)  
4. Jalankan workflow **Generate Analytics**  
5. Embed SVG di profile README (ganti `YOUR_USERNAME` di URL)

**Username tidak perlu diubah** — otomatis pakai owner fork kamu.

### Atau cukup ubah username di config

Kalau mau set manual, edit satu baris di [`analytics.config.yml`](analytics.config.yml):

```yaml
username: your-github-username
```

Lalu run workflow. Theme/cards bisa dibiarkan default.

> Catatan: statistik **private** hanya muncul jika `GH_PAT` milik akun yang punya akses private tersebut. Mengubah username orang lain tanpa PAT mereka = data publik saja.

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

[`analytics.config.yml`](analytics.config.yml):

```yaml
username: "" # empty = auto (repo owner). Or set: your-github-username

theme: tokyonight # github | tokyonight | dracula | catppuccin | nord
timezone: Asia/Jakarta
```

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
