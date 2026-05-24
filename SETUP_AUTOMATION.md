# Weekly Auto-Update Setup Guide

This guide walks you through setting up automatic weekly updates for your NC Desi Circle website. Once set up, the system will automatically find new South Asian businesses every week and add them to your site -- with **zero effort** from you.

---

## What Happens Every Week (Automatically)

1. **Monday at 1:00 AM** (North Carolina time), a robot starts working
2. It searches Google Maps for new Indian/South Asian businesses across NC
3. It adds any new finds to your business list
4. It rebuilds and updates your website automatically
5. You get an email report of what was added

---

## Step 1: Get Your Free Google API Key

Google gives you **$200 of free credits every month** -- more than enough for our weekly searches.

### 1.1 Create a Google Cloud Account

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google/Gmail account
3. Click "Select a project" at the top, then "New Project"
4. Name it: `NC Desi Circle`
5. Click "Create"

### 1.2 Enable the Places API

1. In the left menu, click **"APIs & Services" > "Library"**
2. Search for: `Places API`
3. Click on **"Places API (New)"**
4. Click the **"Enable"** button
5. Wait a few seconds for it to activate

### 1.3 Create Your API Key

1. In the left menu, click **"APIs & Services" > "Credentials"**
2. Click **"+ Create Credentials"** at the top
3. Select **"API key"**
4. A popup will show your new API key -- **copy it and save it somewhere safe**
5. Click the **"Restrict Key"** link (recommended for security)
6. Under "API restrictions", select **"Restrict key"**
7. Check the box for **"Places API (New)"**
8. Click **"Save"**

### 1.4 Secure Your API Key (Very Important!)

1. Still on the Credentials page, click your API key to edit it
2. Under "Application restrictions", select **"HTTP referrers (web sites)"**
3. Click "Done" then **"Save"**

> Your API key is like a password -- never share it publicly!

---

## Step 2: Add Your API Key to GitHub

Your website code lives on GitHub, and that's where the weekly automation runs. You need to tell GitHub your API key so the robot can use it.

### 2.1 Find Your Repository on GitHub

1. Go to [https://github.com](https://github.com) and sign in
2. Find your `nc-desi-circle` repository (or whatever you named it)
3. Click on it to open

### 2.2 Add the Secret

1. Click **"Settings"** tab at the top of your repo
2. In the left sidebar, click **"Secrets and variables" > "Actions"**
3. Click the green **"New repository secret"** button
4. For **Name**, type exactly: `GOOGLE_PLACES_API_KEY`
5. For **Secret**, paste your Google API key from Step 1
6. Click **"Add secret"**

---

## Step 3: Upload These Files to GitHub

The automation files have been created in your project. You need to upload them to GitHub.

### Files that need to be on GitHub:

- `.github/workflows/weekly-update.yml` -- The weekly automation schedule
- `scripts/scrape_businesses.py` -- The business finder script
- `src/data/businesses.ts` -- Your business data

### How to upload:

**Option A: Using GitHub website (easiest)**
1. Go to your repo on GitHub
2. Click **"Add file" > "Upload files"**
3. Drag and drop the folders from your computer
4. Add a commit message: `Add weekly auto-update automation`
5. Click **"Commit changes"**

**Option B: Using command line (if you know how)**
```bash
git add .github/workflows/weekly-update.yml scripts/scrape_businesses.py
git commit -m "Add weekly auto-update automation"
git push
```

---

## Step 4: Test It Manually

Before waiting for Monday, let's make sure it works:

1. Go to your repo on GitHub
2. Click the **"Actions"** tab at the top
3. You should see "Weekly Business Data Update" in the list
4. Click on it, then click the **"Run workflow"** button
5. Click the green **"Run workflow"** button
6. Wait 2-3 minutes for it to finish
7. Refresh the page to see results

### If it succeeds:
- You'll see green checkmarks
- Your `businesses.ts` file will be updated

### If it fails:
- Click on the failed run to see the error
- Most common issue: The `GOOGLE_PLACES_API_KEY` secret is missing or wrong

---

## What You Get Every Week

| Feature | Details |
|---------|---------|
| **When** | Every Monday at 1:00 AM NC time |
| **What it searches** | Google Maps for Indian/South Asian businesses |
| **Cities covered** | Cary, Morrisville, Raleigh, Durham, Chapel Hill, Charlotte, Apex, Holly Springs |
| **Categories** | Restaurants, Grocery, Temples, Lawyers, Doctors, Wedding vendors, Schools, Retail, Beauty, Home Services |
| **New businesses added** | 5-20 per week (varies) |
| **Duplicates** | Automatically prevented |
| **Cost** | **FREE** (within Google's $200/month credit) |
| **Your effort** | **ZERO** -- fully automatic |

---

## Monthly Cost Breakdown

| API Calls | Estimated Cost | Free Tier Coverage |
|-----------|---------------|-------------------|
| ~100 searches/week | ~$4/month | Covered by $200 free credit |
| **Your actual cost** | **$0** | **100% free** |

Google gives you $200/month free. We use about $4/month. You have **$196 left over** for other uses.

---

## How to Check What Was Added

Every week, you can:

1. Go to your repo's **Actions** tab
2. Click on the latest "Weekly Business Data Update" run
3. Look at the "Run business scraper" step to see what was found
4. Check the `scrape-report.json` artifact for a detailed list

---

## FAQ

**Q: Will this delete my existing businesses?**
A: No! It only adds new businesses. Your existing 121 businesses are safe.

**Q: Can I remove businesses the scraper added?**
A: Yes! Just edit `src/data/businesses.ts` and delete any rows you don't want.

**Q: What if Google starts charging?**
A: Google will email you before charging. The scraper is designed to stay well within free limits. You'd need to add 50,000+ businesses before hitting the $200 limit.

**Q: Can I run it more than once a week?**
A: Yes! Go to Actions > Weekly Business Data Update > Run workflow. You can run it anytime.

**Q: Can I change the day/time?**
A: Yes! Edit `.github/workflows/weekly-update.yml` and change the `cron` line. Use [https://crontab.guru](https://crontab.guru) to pick a new schedule.

**Q: What if a business is wrong or spam?**
A: Edit `src/data/businesses.ts` and remove it. The scraper won't add it again because it checks for duplicates.

---

## Need Help?

If you get stuck on any step, the most common issues are:

1. **API Key not working** -- Make sure you enabled "Places API (New)" not just "Places API"
2. **GitHub secret not found** -- Double-check the name is exactly `GOOGLE_PLACES_API_KEY` (all caps, underscores)
3. **Build failing** -- Check that you have a recent `package-lock.json` file in your repo

---

## Summary Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Places API (New)
- [ ] Created and copied API key
- [ ] Added API key to GitHub Secrets as `GOOGLE_PLACES_API_KEY`
- [ ] Uploaded automation files to GitHub
- [ ] Tested with "Run workflow" button
- [ ] Confirmed new businesses were added

**Once all boxes are checked, you're done! The robot will work for you every week automatically.**
