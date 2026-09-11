# HIVE SALON — PRODUCTION READINESS AUDIT & ROADMAP

> **Assessment:** Commercial MVP / Functional Prototype (Readiness Score: **42%**)  
> **Target Production State:** Multi-Tenant Enterprise SaaS (Target Score: **100%**)

---

## 1. Production Readiness Scorecard

| Area | Readiness | Status | Production Requirement |
| :--- | :---: | :---: | :--- |
| **Frontend Applications** | **85%** | 🟢 READY | UI is feature-complete and luxury-grade; only requires API base URL environment variable wiring. |
| **Prisma Database Schema**| **75%** | 🟢 READY | 2,199 lines of schema with 30+ tables ready for PostgreSQL `prisma migrate deploy`. |
| **Backend REST API Architecture** | **55%** | 🟡 IN PROGRESS| NestJS controllers and DTOs complete; needs Prisma ORM repository integration replacing in-memory stores. |
| **Distributed Session & Cache** | **25%** | 🔴 MISSING | Needs Redis store for JWT revocation, OTP TTL, and rate limiting. |
| **Background Job Queues** | **20%** | 🔴 MISSING | Needs Redis BullMQ workers for async marketing broadcasts, stock alerts, and audit logs. |
| **Payment & SMS Gateways** | **15%** | 🔴 MOCKED | Needs live credentials for Razorpay/Stripe, Meta WhatsApp Cloud API, and MSG91 SMS. |
| **Automated Testing Coverage** | **10%** | 🔴 MISSING | Needs unit tests (Jest), API integration tests (Supertest), and E2E tests (Playwright). |
| **Container & CI/CD** | **35%** | 🟡 PARTIAL | Monorepo builds with Turbo; needs Dockerfiles, Kubernetes helm charts, and GitHub Actions CI. |

---

## 2. 7-Step Production Deployment Roadmap

```
[ STEP 1: DATABASE PERSISTENCE ]
Connect NestJS to PostgreSQL via Prisma Client repositories with multi-tenant RLS predicates.
                │
                ▼
[ STEP 2: NEXT.JS API REWRITES ]
Add Next.js rewrite proxy rules in next.config.mjs forwarding /api/v1 to NestJS backend on port 4000.
                │
                ▼
[ STEP 3: DISTRIBUTED REDIS INFRASTRUCTURE ]
Deploy Redis for session caching, token revocation, throttler rate-limiting, and BullMQ background workers.
                │
                ▼
[ STEP 4: EXTERNAL GATEWAY INTEGRATION ]
Inject live production credentials for Razorpay/Stripe, Meta WhatsApp Cloud API, and MSG91/Twilio.
                │
                ▼
[ STEP 5: AUTOMATED TESTING HARNESS ]
Write unit tests for billing math, commission slabs, and GST calculations + Playwright E2E front-desk test.
                │
                ▼
[ STEP 6: DOCKER & CONTAINERIZATION ]
Create production multi-stage Dockerfiles for apps/api, apps/web-admin, apps/web-pos, and apps/customer-portal.
                │
                ▼
[ STEP 7: OBSERVABILITY & MONITORING ]
Integrate Sentry error tracking, Prometheus/Grafana metric scrapers, and structured JSON Pino logging.
```

---

## 3. Required Production Environment Variables

### Core Database & Redis
```env
DATABASE_URL="postgresql://hive_admin:STRONG_PASSWORD@postgres.hive.internal:5432/hive_salon_prod?schema=public&sslmode=require"
REDIS_URL="redis://:REDIS_STRONG_PASSWORD@redis.hive.internal:6379/0"
```

### Security & Tokens
```env
JWT_ACCESS_SECRET="GENERATE_64_CHAR_HEX_SECRET"
JWT_REFRESH_SECRET="GENERATE_64_CHAR_HEX_SECRET"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
ENCRYPTION_KEY="GENERATE_32_BYTE_HEX_KEY"
```

### Payment Gateways
```env
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"
```

### Communication Gateways
```env
WHATSAPP_PHONE_NUMBER_ID="109876543210987"
WHATSAPP_ACCESS_TOKEN="EAAG..."
WHATSAPP_WEBHOOK_VERIFY_TOKEN="hive_webhook_token_xxxx"
MSG91_AUTH_KEY="xxxxxxxxxxxxxxxx"
MSG91_SENDER_ID="HIVESL"
SENDGRID_API_KEY="SG.xxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="notifications@hivesalon.in"
```

---

## 4. Production Release Checklist

- [ ] Run `npx prisma migrate deploy` against target PostgreSQL database.
- [ ] Execute `npm run db:seed` with production administrative credentials.
- [ ] Verify TLS/HTTPS certificate encryption across all subdomains (`admin.hivesalon.in`, `pos.hivesalon.in`, `portal.hivesalon.in`, `api.hivesalon.in`).
- [ ] Configure automated daily PostgreSQL WAL-E backup snapshots with 30-day retention.
- [ ] Confirm CORS origins are strictly locked to authorized company domains.
- [ ] Verify AST SQL validator blocks all unauthorized DDL/DML queries under load test.
