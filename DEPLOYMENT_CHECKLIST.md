# Render Deployment Checklist

## ✅ Pre-Deployment

- [ ] Install Render GitHub App on your organization
- [ ] Push latest code to GitHub
- [ ] Ensure `@nestjs/jwt` and other dependencies are in package.json
- [ ] Test build locally: `pnpm --filter @repo/api build`

## ✅ Render Setup

### 1. Create PostgreSQL Database
- [ ] Go to Render Dashboard
- [ ] Click "New +" → "PostgreSQL"
- [ ] Name: `medical-admission-db`
- [ ] Region: Singapore (or closest)
- [ ] Plan: Free
- [ ] Copy **Internal Database URL**

### 2. Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select your organization repo

### 3. Configure Service

**Basic Settings:**
- [ ] Name: `medical-admission-api`
- [ ] Region: Singapore
- [ ] Branch: `main`
- [ ] Root Directory: `apps/api`
- [ ] Runtime: Node
- [ ] Build Command: `pnpm install && pnpm --filter @repo/api build`
- [ ] Start Command: `pnpm --filter @repo/api start:prod`

**Environment Variables:**
- [ ] `DATABASE_URL` = (Paste Internal Database URL)
- [ ] `JWT_SECRET` = (Generate random string)
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `SUPABASE_URL` = (Your Supabase URL)
- [ ] `SUPABASE_KEY` = (Your Supabase Key)

**Advanced Settings:**
- [ ] Health Check Path: `/health`
- [ ] Auto-Deploy: Yes

### 4. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Check logs for errors

## ✅ Post-Deployment

### 1. Verify Deployment
- [ ] Visit: `https://your-app.onrender.com/health`
- [ ] Should return: `{"status":"ok"}`

### 2. Database Setup
- [ ] Migrations should run automatically
- [ ] If not, use Render Shell: `npx prisma migrate deploy`

### 3. Keep Alive Setup
- [ ] Go to https://cron-job.org
- [ ] Create account
- [ ] Add cron job:
  - URL: `https://your-app.onrender.com/health`
  - Schedule: `*/14 * * * *` (every 14 minutes)

### 4. Update Frontend
- [ ] Update `NEXT_PUBLIC_API_URL` in your web app
- [ ] Point to: `https://your-app.onrender.com`
- [ ] Redeploy frontend

## ✅ Testing

- [ ] Test health endpoint: `curl https://your-app.onrender.com/health`
- [ ] Test API endpoints
- [ ] Check database connection
- [ ] Verify authentication works
- [ ] Test file uploads (if applicable)

## ✅ Monitoring

- [ ] Check Render logs regularly
- [ ] Set up Sentry for error tracking (optional)
- [ ] Monitor database usage
- [ ] Check cold start times

## 🚨 Troubleshooting

### Build Fails
- Check build logs in Render
- Verify all dependencies are installed
- Ensure Prisma generates correctly

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Use **Internal Database URL**, not External
- Check database is running

### App Crashes
- Check Render logs
- Verify environment variables
- Ensure `PORT` is set correctly

### Cold Starts
- Set up cron job to ping every 14 minutes
- Consider upgrading to paid plan ($7/month)

## 📝 Important URLs

- **Render Dashboard:** https://dashboard.render.com
- **Your API:** https://your-app.onrender.com
- **Health Check:** https://your-app.onrender.com/health
- **Cron-Job.org:** https://cron-job.org
- **Deployment Guide:** See RENDER_DEPLOYMENT.md

## 🎯 Quick Commands

```bash
# View logs
render logs

# Open shell
render shell

# Restart service
render restart

# View environment variables
render env
```

## ✨ Next Steps

- [ ] Set up custom domain (optional)
- [ ] Configure CORS for your frontend
- [ ] Set up monitoring and alerts
- [ ] Plan for scaling if needed
- [ ] Document API endpoints
- [ ] Set up CI/CD for automated deployments

---

**Need Help?**
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- See RENDER_DEPLOYMENT.md for detailed guide
