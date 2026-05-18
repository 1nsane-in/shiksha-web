# Render Deployment Guide

## Quick Setup

### 1. Render Configuration

**Root Directory:** `apps/api`

**Build Command:**
```bash
pnpm install && pnpm --filter @repo/api build
```

**Start Command:**
```bash
pnpm --filter @repo/api start:prod
```

**Environment:** Node

**Node Version:** 20

---

## Environment Variables

Add these in Render Dashboard → Environment:

### Required Variables

```env
# Database (from Render PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Supabase (if using)
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key

# Node Environment
NODE_ENV=production
PORT=10000
```

### Optional Variables

```env
# Sentry (Error Tracking)
SENTRY_DSN=your-sentry-dsn

# PostHog (Analytics)
POSTHOG_API_KEY=your-posthog-key
POSTHOG_HOST=https://app.posthog.com
```

---

## Database Setup

### Option 1: Use Render PostgreSQL (Recommended)

1. In Render Dashboard, create a new PostgreSQL database
2. Copy the **Internal Database URL**
3. Add it as `DATABASE_URL` environment variable
4. Database will auto-migrate on first deploy

### Option 2: External Database

Use any PostgreSQL provider (Supabase, Neon, etc.) and add the connection string.

---

## Deployment Steps

### Step 1: Connect Repository
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub organization repository
4. Select the repository

### Step 2: Configure Service
- **Name:** medical-admission-api
- **Region:** Singapore (or closest to you)
- **Branch:** main
- **Root Directory:** `apps/api`
- **Runtime:** Node
- **Build Command:** `pnpm install && pnpm --filter @repo/api build`
- **Start Command:** `pnpm --filter @repo/api start:prod`

### Step 3: Add Environment Variables
Copy all variables from the section above.

### Step 4: Deploy
Click "Create Web Service" - Render will automatically deploy!

---

## Post-Deployment

### 1. Run Database Migrations

If migrations don't run automatically, use Render Shell:

```bash
cd apps/api
npx prisma migrate deploy
```

### 2. Seed Database (Optional)

```bash
cd apps/api
npx prisma db seed
```

### 3. Create Super Admin

```bash
pnpm --filter @repo/api seed:admin
```

---

## Keep Service Alive (Prevent Cold Starts)

Render free tier sleeps after 15 minutes of inactivity.

### Option 1: Cron-Job.org (Recommended)

1. Go to https://cron-job.org
2. Create account (free)
3. Add new cron job:
   - **URL:** `https://your-app.onrender.com/health`
   - **Schedule:** Every 14 minutes (`*/14 * * * *`)
   - **Name:** Keep Render Alive

### Option 2: UptimeRobot

1. Go to https://uptimerobot.com
2. Add monitor:
   - **Type:** HTTP(s)
   - **URL:** Your Render URL
   - **Interval:** 5 minutes

### Option 3: GitHub Actions

Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Render Alive
on:
  schedule:
    - cron: '*/14 * * * *'
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl https://your-app.onrender.com/health
```

---

## Troubleshooting

### Build Fails: "Cannot find module @nestjs/jwt"

**Solution:** Dependencies are now added. Redeploy.

### Build Fails: Prisma types missing

**Solution:** `prebuild` script now runs `prisma generate` automatically.

### Database Connection Error

**Solution:** 
1. Check `DATABASE_URL` is correct
2. Ensure it's the **Internal Database URL** from Render
3. Format: `postgresql://user:password@host:5432/dbname`

### Port Issues

**Solution:** Render automatically sets `PORT=10000`. Your app should use `process.env.PORT`.

---

## Monitoring

### View Logs
Render Dashboard → Your Service → Logs

### Health Check
Visit: `https://your-app.onrender.com/health`

### Metrics
Render Dashboard → Your Service → Metrics

---

## Scaling (Paid Plans)

- **Starter ($7/month):** No sleep, better performance
- **Standard ($25/month):** Auto-scaling, more resources

---

## Alternative Free Options

If Render doesn't work:

1. **Fly.io** - 3 VMs free, PostgreSQL included
2. **Railway** - $5 credit/month (500 hours)
3. **Google Cloud Run** - 2M requests/month free
4. **AWS Free Tier** - EC2 + RDS (12 months)

---

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- NestJS Docs: https://docs.nestjs.com

---

## Quick Commands Reference

```bash
# Local development
pnpm dev

# Build
pnpm --filter @repo/api build

# Production start
pnpm --filter @repo/api start:prod

# Prisma commands
cd apps/api
npx prisma generate
npx prisma migrate deploy
npx prisma studio
```
