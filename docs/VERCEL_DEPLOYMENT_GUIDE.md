# Hive Salon — Vercel Deployment Guide

This guide walks you through deploying the **Hive Salon** Turborepo monorepo applications to **Vercel**.

---

## 🏗 Monorepo Architecture Overview

Hive Salon contains 3 Next.js frontend applications ready for Vercel:

| App | Description | Directory | Framework Preset |
|---|---|---|---|
| **Web Admin & Front Desk** | Main ERP portal (Front Desk + Executive Back Office) | `apps/web-admin` | Next.js |
| **Web POS Terminal** | High-speed POS station for fast billing & cash drawers | `apps/web-pos` | Next.js |
| **Customer Portal** | Client-facing booking, package & wallet portal | `apps/customer-portal` | Next.js |

---

## 🚀 Method 1: Deploy via Vercel Dashboard (Recommended)

Connecting your GitHub / GitLab repository to Vercel is the most seamless way to deploy with automatic preview deployments and production CI/CD.

### Step-by-Step Instructions:

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git add .
   git commit -m "feat: complete white background theme and production ready build"
   git push origin main
   ```

2. **Open Vercel Dashboard**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard) and click **"Add New..."** → **"Project"**.
   - Select your Git repository.

3. **Configure Project Settings for Web Admin**:
   - **Project Name**: `hive-salon-admin` (or any custom name)
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select `apps/web-admin`. *(Important: Check the box "Include source files outside of the Root Directory in the Build Step" if prompted).*
   - **Build and Output Settings**:
     - *Build Command*: `cd ../.. && npx turbo run build --filter=@hive/web-admin...` (or leave default `next build` if Turborepo auto-detection is active)
     - *Install Command*: `npm install` (run from repository root)
     - *Output Directory*: `.next`

4. **Add Environment Variables**:
   In the **Environment Variables** section, configure:
   ```env
   NEXT_PUBLIC_API_URL=https://api.your-domain.com
   NEXT_PUBLIC_APP_NAME="Hive Salon"
   NODE_ENV=production
   ```

5. **Click "Deploy"**:
   - Vercel will install workspace dependencies, build the `@hive/ui` and other workspace packages using Turborepo, and deploy all 93+ static and dynamic routes.

---

## ⚡ Method 2: Deploy via Vercel CLI

If you want to deploy directly from your local terminal using the Vercel CLI:

1. **Run Vercel CLI from repository root**:
   ```bash
   npx vercel
   ```

2. **Follow the interactive prompts**:
   - **Set up and deploy?**: `y`
   - **Which scope?**: Select your team / personal account
   - **Link to existing project?**: `N`
   - **What's your project's name?**: `hive-salon-admin`
   - **In which directory is your code located?**: `apps/web-admin`
   - **Want to modify settings?**: `y`
     - *Build Command*: `cd ../.. && npx turbo run build --filter=@hive/web-admin...`
     - *Output Directory*: `.next`

3. **For Production Deployment**:
   ```bash
   npx vercel --prod
   ```

---

## 🏪 Deploying Other Apps (`web-pos` and `customer-portal`)

To deploy the other applications in the monorepo, simply add another project in Vercel pointing to the respective root directory:

### For `apps/web-pos`:
- **Project Name**: `hive-salon-pos`
- **Root Directory**: `apps/web-pos`
- **Build Command*: `cd ../.. && npx turbo run build --filter=@hive/web-pos...`

### For `apps/customer-portal`:
- **Project Name**: `hive-salon-customer`
- **Root Directory**: `apps/customer-portal`
- **Build Command*: `cd ../.. && npx turbo run build --filter=@hive/customer-portal...`

---

## ⚙️ Backend API (`apps/api`) Deployment

`apps/api` is a NestJS enterprise REST API with Prisma and WebSocket support.

### Recommended Production Platforms:
- **Render / Railway / Fly.io / AWS ECS**:
  - Deploy `apps/api` as a Node.js long-running container service.
  - Set `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, and `PORT=4000`.
  - Build command: `npm run --workspace=@hive/api build`
  - Start command: `npm run --workspace=@hive/api start:prod`

---

## ✅ Pre-Deployment Verification Checklist

Before deploying, verify everything passes locally:
- [x] TypeScript Type Check: `npm run type-check` (12 packages passed)
- [x] Turbo Production Build: `npm run build` (4 apps successfully built)
- [x] Transpiled Workspace Packages: `@hive/ui`, `@hive/types`, `@hive/config`, `@hive/utilities`, `@hive/validation`, `@hive/auth`, `@hive/events` configured in `next.config.mjs`.
