# HIVE SALON — FINAL HARDENING BASELINE

**Baseline Date**: September 11, 2026  
**Repository**: Hive Salon Management System (`shyampola1755/HiveSalonManagementsystem`)  
**Architecture**: MERN Monorepo with Turbo & npm workspaces  

---

## 1. STACK & ENVIRONMENT SPECIFICATIONS

| Layer | Technology | Version | Location / Port |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | v20.14.0 | Localhost |
| **Frontend Framework** | React + TypeScript + Vite | React 18.3.1, Vite 6.1 | `apps/web-client` (`http://localhost:3000`) |
| **Backend API** | Express + TypeScript | Express 4.21.2 | `apps/api-server` (`http://localhost:5000/api/v1`) |
| **Database Engine** | MongoDB with Mongoose ODM | Mongoose 8.10.1 | Dual Mode: External URI / MemoryServer fallback |
| **Realtime WebSockets** | Socket.IO | 4.8.1 | `http://localhost:5000` |
| **Styling & UI Tokens** | Vanilla CSS + Design System | Custom CSS Tokens | `apps/web-client/src/index.css` |
| **Icons** | Lucide React | 0.475.0 | All portal components |

---

## 2. REPOSITORY & PACKAGE ARCHITECTURE

```
Hive Salon Monorepo
├── apps/
│   ├── api-server/         # Node.js + Express + Mongoose REST API & Socket.io
│   └── web-client/         # React 18 SPA (Front Desk, Back Office, Stylist, POS)
├── packages/
│   ├── types/              # Shared TypeScript data models & DTO definitions
│   ├── utilities/          # Currency, date, and string formatting helpers
│   └── ui/                 # Reusable design system primitives
├── test-artifacts/         # E2E test suites, logs, screenshots, JSON reports
└── docs/                   # Engineering, security, and deployment documentation
```

---

## 3. SECURITY & AUTHENTICATION ARCHITECTURE

- **Authentication**: JWT (JSON Web Token) with HS256 algorithm and 7-day expiration.
- **Password Storage**: Salted bcrypt hashing with 10 rounds.
- **Role-Based Access Control**:
  - `SUPER_ADMIN`: Complete multi-branch governance, organization master, and financial oversight.
  - `BRANCH_MANAGER`: Floor operations, staff rosters, daily targets, and branch performance.
  - `FRONT_DESK`: Client check-in, appointments, touch POS billing, and queue management.
  - `STYLIST`: Chair station, hair color formulations, and personal commission ledger.
- **Route Guards**: Client-side protected route wrappers and server-side `authenticateJWT` + `authorizeRoles` middlewares.

---

## 4. BASELINE AUDIT SUMMARY

- **Core Functionality Pass Rate**: 100% (49 / 49 implemented tests verified).
- **Compilation Status**: `npm run build` PASS on both `@hive/web-client` and `@hive/api-server`.
- **Database Persistence**: Mongoose schemas and relationships active for all major entities.
- **Third-Party Integrations**: Clearly segregated and classified as Pending Configuration (Razorpay/Stripe, Twilio/Gupshup).
