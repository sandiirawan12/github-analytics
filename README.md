# GitHub Analytics

Self-hosted multi-user GitHub profile analytics. Cards are generated on **this repo** into `output/{username}/`.

---

## For other people (hanya ubah README)

Orang lain **tidak perlu fork**. Cukup:

### 1. Daftar username (sekali)

Buat Issue di repo ini dengan judul:

```text
add-user: YOUR_USERNAME
```

Bot akan generate kartu dan membalas dengan snippet embed siap pakai.

### 2. Paste di profile README

Di repo `YOUR_USERNAME/YOUR_USERNAME`, pakai URL dengan **username kamu**:

```md
<p align="center">
  <img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/YOUR_USERNAME/dashboard.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/YOUR_USERNAME/stats.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/YOUR_USERNAME/streak.svg" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/YOUR_USERNAME/activity.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/YOUR_USERNAME/languages.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/YOUR_USERNAME/productive-time.svg" />
</p>

<p align="center">
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/YOUR_USERNAME/repositories.svg" />
  <img width="49%" src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/YOUR_USERNAME/contributions.svg" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/sandiirawan12/github-analytics/main/output/YOUR_USERNAME/achievements.svg" />
</p>
```

Ganti `YOUR_USERNAME` saja. Di sisi repo ini, data dibaca otomatis dari GitHub API dan di-refresh tiap 6 jam.

> **Public stats** untuk semua user yang terdaftar.  
> **Private stats** hanya akurat untuk pemilik `GH_PAT` (biasanya owner repo ini).

Template: [`PROFILE_README.example.md`](./PROFILE_README.example.md)

---

## For you (owner)

1. Secret **`GH_PAT`** (`repo` + `read:user`)
2. Daftar user di [`users.yml`](./users.yml) (atau lewat issue `add-user:`)
3. Actions generate ke `output/{username}/`

Manual add satu user: **Actions → Generate Analytics → Run workflow** → isi input `username`.

---

## Layout output

```text
output/
  updated_at.txt
  sandiirawan12/
    dashboard.svg
    stats.svg
    ...
  other-user/
    dashboard.svg
    ...
```

---

## Configure

[`analytics.config.yml`](analytics.config.yml) — theme, cards, timezone (berlaku untuk semua user).

[`users.yml`](users.yml) — daftar username yang digenerate.

---

## Local

```bash
cp .env.example .env   # GITHUB_TOKEN=
npm install
npm run generate                 # all users in users.yml
npm run generate -- --user=octocat
```

## License

MIT
