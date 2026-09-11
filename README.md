# Hive Salon — Centralized Multi-Branch Enterprise ERP & POS Platform (MERN Stack)

> **A Complete MERN Stack (MongoDB, Express.js, React.js, Node.js) Commercial Platform for Luxury Salon Networks, Spas & Wellness Chains.**

[![Stack](https://img.shields.io/badge/Stack-MERN%20(MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node)-gold.svg)](#)
[![Security Grade](https://img.shields.io/badge/Security-JWT%20%2B%20RBAC%20Verified-blue.svg)](#)
[![Tax Compliance](https://img.shields.io/badge/GST%20Compliance-18%25%20CGST%2BSGST-purple.svg)](#)

---

## 🌟 Executive Overview

**Hive Salon** is a centralized, multi-tenant enterprise ERP & POS platform engineered for high-volume luxury salon chains, medical aesthetic clinics, day spas, and wellness franchises.

### Dual-Portal Operational Architecture:
1. **⚡ Portal 1: Front-Desk Reception & POS Terminal**
   - **Interactive Appointments & Stylist Calendar**: Real-time chair scheduling board, duration buffer management, and stylist resource allocation.
   - **Live Waiting Lounge & Queue**: Walk-in guest tracking, chair seating, and service progress monitoring.
   - **High-Speed Touch POS**: Instant cart calculation, GST invoice generation, split payments (Cash, Card, UPI, Prepaid Wallet, Loyalty points), custom discounts, and printable receipts.
   - **Customer CRM 360° Profile**: Hair texture/porosity profiles, technical hair color formulas, safety patch test logs, and prepaid wallet top-ups.
   - **Memberships & Packages**: VIP privilege tiers (Diamond, Gold) and multi-session pass sales/redemptions.
   - **Loyalty & Rewards**: Automated points accrual (1 pt per ₹100) with instant POS checkout redemption.

2. **🏛️ Portal 2: Centralized Management & Back-Office ERP**
   - **Executive BI Overview**: 7-day revenue velocity trends, cross-branch comparative yield, and top category metrics.
   - **Multi-Branch Network Hierarchy**: State ➔ District ➔ City ➔ Branch geographical organization tree.
   - **Master Services Catalog**: Dynamic branch pricing overrides, duration buffers, and chemical recipes (BOM).
   - **Staff & HR Roster**: Stylist profiles, weekly shifts, biometric attendance clock logs, and commission tier plans.
   - **Centralized Inventory**: Professional back-bar chemical supplies, retail merchandise, low-stock alerts, and stock adjustments.
   - **Marketing & Automated Retention**: WhatsApp & SMS broadcast campaigns, birthday discounts, and client lapse triggers.
   - **Financial Ledger & Expenses**: Salon operating expenses, daily cash flow registers, and GST reconciliation reports.

---

## 🏗️ MERN Stack Architecture

```
Hive Salon Platform (Turborepo)
├── apps/
│   ├── api-server/         # Express.js REST API Server (Port 5000)
│   │   ├── src/config/     # MongoDB Connection & Environment Variables
│   │   ├── src/models/     # Mongoose Schemas (30+ entities, compound indexes)
│   │   ├── src/controllers/# REST API business logic controllers
│   │   ├── src/routes/     # Modular Express API routing
│   │   ├── src/middleware/ # JWT Auth, RBAC, Multi-Branch Scoping, Error Handling
│   │   └── src/seed.ts     # MongoDB Database Seeder with realistic demo data
│   │
│   └── web-client/         # React 18 + Vite SPA Client (Port 3000)
│       ├── src/views/      # Front-Desk & Back-Office ERP portal views
│       ├── src/context/    # Auth, POS Cart, and Toast Context Providers
│       ├── src/components/ # AppShell, Sidebar, StatCards, Modals, Touch POS Grid
│       └── src/api/        # Axios client instance with JWT auto-interceptor
│
└── packages/               # Shared TypeScript configurations & utilities
```

---

## ⚡ Quick Start & Setup

### 1. Prerequisites
- **Node.js**: >= 18.0.0
- **MongoDB**: Local MongoDB server or MongoDB Atlas connection string

### 2. Environment Configuration
Copy the `.env.example` file:
```bash
cp .env.example .env
```
Default connection strings:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hive_salon_db
JWT_SECRET=hive_salon_enterprise_jwt_super_secret_key_2026
```

### 3. Install Dependencies & Seed Database
```bash
# Install dependencies across all workspaces
npm install

# Seed MongoDB with realistic enterprise demo data
npm run seed
```

### 4. Run Development Servers
```bash
# Concurrently start Express API Server (5000) and React Client (3000)
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

## 🔑 Demo Login Profiles

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@hivesalon.com` | `Password123!` | Full enterprise access across all portals |
| **Branch Manager** | `manager@hivesalon.com` | `Password123!` | Branch operational & staff management |
| **Front Desk** | `frontdesk@hivesalon.com` | `Password123!` | Front-desk appointment booking & POS billing |

---

## 📡 Core REST API Endpoints

- **Auth**: `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
- **Branches**: `GET /api/v1/branches`, `GET /api/v1/branches/hierarchy`, `POST /api/v1/branches`
- **Customers**: `GET /api/v1/customers`, `GET /api/v1/customers/:id`, `POST /api/v1/customers/:id/wallet`
- **Services**: `GET /api/v1/services`, `GET /api/v1/services/categories`, `POST /api/v1/services`
- **Staff**: `GET /api/v1/staff`, `GET /api/v1/staff/attendance`, `POST /api/v1/staff/attendance/clock`
- **Appointments**: `GET /api/v1/appointments`, `GET /api/v1/appointments/queue`, `POST /api/v1/appointments`
- **POS & Billing**: `GET /api/v1/pos/invoices`, `POST /api/v1/pos/checkout`
- **Inventory**: `GET /api/v1/inventory/products`, `POST /api/v1/inventory/adjust`
- **Memberships**: `GET /api/v1/memberships/tiers`, `POST /api/v1/memberships/subscribe`
- **Finance**: `GET /api/v1/finance/expenses`, `POST /api/v1/finance/expenses`
- **Reports**: `GET /api/v1/reports/dashboard`
