# Vercel Deployment Guide for VS Landing Page

This guide will walk you through deploying the VibeStudio landing page to Vercel.

## Prerequisites

1. **GitHub Repository**: Push your code to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Environment Variables**: Have your environment variables ready

## Deployment Methods

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Repository**
   - Connect your GitHub account if not already connected
   - Select your repository containing the VS landing page
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `vs-lp` (if deploying from monorepo)
   - **Build Command**: `yarn build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Environment Variables**
   Add these environment variables in the Vercel dashboard:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://rqfzxlpptdygxujyypzr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_REDIRECT_URL=https://your-vercel-domain.vercel.app
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   PEARAI_SERVER_URL=your_pearai_server_url
   NEXT_PUBLIC_TEST_MODE_ENABLED=false
   GITHUB_TOKEN=your_github_token

   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be available at `https://your-project-name.vercel.app`

### Method 2: Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy from vs-lp directory**

   ```bash
   cd /home/jerry/vibestudio/vs-lp
   vercel
   ```

4. **Follow prompts**
   - Link to existing project or create new one
   - Configure settings
   - Add environment variables when prompted

### Method 3: Git Integration (Automatic)

1. **Connect Repository**
   - After initial setup, every push to your main branch will auto-deploy
   - Pull requests will create preview deployments

## Environment Variables Setup

### In Vercel Dashboard:

1. Go to your project settings
2. Click "Environment Variables"
3. Add each variable with appropriate values
4. Set environment: Production, Preview, or Development

### Important Environment Variables:

**Required:**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Firebase configuration variables

**Optional but Recommended:**

- `NEXT_PUBLIC_POSTHOG_KEY` (Analytics)
- `GITHUB_TOKEN` (For release data)
- `PEARAI_SERVER_URL` (If using PearAI server)

## Post-Deployment

### 1. Custom Domain (Optional)

- In project settings, go to "Domains"
- Add your custom domain (e.g., vibestudio.online)
- Configure DNS settings as instructed

### 2. Update Redirect URLs

- Update `NEXT_PUBLIC_REDIRECT_URL` to your actual Vercel domain
- Update Supabase auth settings with new domain
- Update any external service callbacks

### 3. Test Firebase Analytics

- Firebase Analytics will work automatically with your environment variables
- Check Firebase console to confirm events are being tracked

## Monitoring

- **Vercel Analytics**: Already integrated via `@vercel/analytics`
- **Firebase Analytics**: Configured via your Firebase setup
- **PostHog**: Configure with your PostHog key

## Troubleshooting

### Build Errors

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Check for any missing dependencies

### Runtime Errors

- Check function logs in Vercel dashboard
- Verify API routes are working
- Check environment variable values

### Performance

- Use Vercel Speed Insights (already integrated)
- Monitor Core Web Vitals in Vercel dashboard

## Commands Summary

```bash
# Local development
cd vs-lp
yarn dev

# Local build test
yarn build

# Deploy with Vercel CLI
vercel

# Deploy production
vercel --prod
```

Your VS landing page is now ready for Vercel deployment with full support for Server Actions, API routes, and Firebase Analytics!
