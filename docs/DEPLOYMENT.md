# Hive Salon — Enterprise Production Deployment Guide

## 1. Infrastructure Requirements & Sizing

| Component | Minimum Specification (Development) | Recommended (Enterprise Production - 50+ Branches) |
| :--- | :--- | :--- |
| **Application Nodes** | 2 vCPU, 4GB RAM | 4 Nodes × 4 vCPU, 8GB RAM (Autoscaling Kubernetes) |
| **PostgreSQL Database** | 2 vCPU, 4GB RAM (Single Instance) | Managed PostgreSQL 16 (Primary + Read Replica, 8 vCPU, 32GB RAM, NVMe SSD) |
| **Redis Cache & Queues** | 1 vCPU, 2GB RAM | Redis 7.2 Cluster (Multi-AZ, 4GB RAM) |
| **Storage / S3** | Local disk | AWS S3 / Cloudflare R2 for asset images and invoice PDFs |

---

## 2. Environment Variables Configuration

Create `.env` in the root workspace:

```env
# Node & Environment
NODE_ENV=production
PORT=4000

# Database
DATABASE_URL="postgresql://hive_admin:SecretPass123@db.internal:5432/hive_salon_prod?schema=public&connection_limit=30&pool_timeout=20"

# Redis
REDIS_URL="redis://:RedisAuthPass@redis.internal:6379/0"

# JWT Secret Keys
JWT_SECRET="e9f4c3a2b1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef"
JWT_REFRESH_EXPIRES_IN="7d"

# External Integrations
WHATSAPP_API_TOKEN="EAAxxxxxx"
WHATSAPP_PHONE_NUMBER_ID="10982347192"
MSG91_AUTH_KEY="2983471098234"
RESEND_API_KEY="re_123456789"
```

---

## 3. Containerization with Docker

### 1. Multi-Stage Dockerfile (`Dockerfile`)

```dockerfile
# Stage 1: Build Workspace
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN npm ci
RUN npm run db:generate
RUN npm run build

# Stage 2: Production API Runner
FROM node:20-alpine AS api-runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]

# Stage 3: Production Admin Web Runner
FROM node:20-alpine AS admin-runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web-admin/.next ./apps/web-admin/.next
COPY --from=builder /app/apps/web-admin/public ./apps/web-admin/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web-admin/package.json ./apps/web-admin/package.json
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=@hive/web-admin"]
```

---

## 4. Database Migrations & Verification

```bash
# Execute schema migration on production PostgreSQL instance
npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma

# Verify schema synchronization
npx prisma db validate --schema=packages/database/prisma/schema.prisma
```

---

## 5. Production Health & Readiness Checklist

- [x] Strict CORS policy whitelists only verified domain origins.
- [x] Database connection pooling tuned to database instance max connections.
- [x] Rate limiting configured on `/api/v1/auth/login` and `/api/v1/ai/query`.
- [x] Automated nightly PostgreSQL database backups with 30-day point-in-time recovery.
- [x] Health check endpoint responding `200 OK` on `/api/v1/health`.
