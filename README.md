# CRNT Dashboard

Live dashboard pulling from Notion. Hosted on Vercel. Free.

---

## What you need

- GitHub account (free) — github.com
- Vercel account (free) — vercel.com (sign up with GitHub)
- Notion API key — notion.so/my-integrations

---

## Step 1 — Get your Notion API key

1. Go to https://www.notion.so/my-integrations
2. Click **New integration**
3. Name it `CRNT Dashboard`
4. Select your CRNT workspace
5. Click **Save**
6. Copy the **Internal Integration Secret** — this is your `NOTION_API_KEY`
7. Go to each of these Notion pages and click **Share → Invite → CRNT Dashboard**:
   - Task Tracker database
   - Content Idea Bank database

---

## Step 2 — Put the code on GitHub

1. Go to github.com → **New repository**
2. Name it `crnt-dashboard`, set to **Private**
3. Upload all files from this folder (drag and drop works)
4. Click **Commit changes**

---

## Step 3 — Deploy to Vercel

1. Go to vercel.com → **Add New Project**
2. Import your `crnt-dashboard` GitHub repo
3. Click **Deploy** (defaults are fine)
4. Once deployed, go to **Settings → Environment Variables**
5. Add:
   - Key: `NOTION_API_KEY`
   - Value: your secret from Step 1
6. Go to **Deployments → Redeploy** to apply the env variable

---

## Step 4 — Bookmark it

Vercel gives you a URL like `crnt-dashboard.vercel.app`

Bookmark it. Share it with James. Done.

---

## Updating the dashboard

- **Tasks & content** — update in Notion, dashboard refreshes automatically every 5 minutes (or hit Refresh)
- **Spend** — currently hardcoded in `api/notion.js`. Tell Claude when you've spent something and it'll update the code
- **Milestones** — currently hardcoded in `public/index.html`. Same deal.
- **Launch date** — change the `LAUNCH_DATE` variable in `public/index.html`

---

## Optional: Custom domain

In Vercel → **Settings → Domains**, you can point `dashboard.trycrnt.com` to it.
Requires adding a CNAME record in GoDaddy pointing to `cname.vercel-dns.com`.
