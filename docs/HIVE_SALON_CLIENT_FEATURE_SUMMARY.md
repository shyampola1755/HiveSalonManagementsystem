# HIVE SALON — CLIENT FEATURE SUMMARY & CAPABILITY OVERVIEW

> **Audience:** Salon Chain Owners, Enterprise Investors, Operations Directors, and Client Stakeholders  
> **Platform Summary:** Hive Salon is a Next-Generation Centralized Multi-Branch Salon, Spa & Wellness Management ERP built with a luxury aesthetic, zero-training front-desk ergonomics, progressive commission calculations, and AI-powered text-to-SQL analytics.

---

## 1. WHAT HIVE SALON CAN DO TODAY (Genuinely Working)

Today, Hive Salon runs seamlessly on `localhost` as an interactive, fully navigable commercial prototype and operational demonstration:

### 🌟 1. Front-Desk Receptionist Experience & Guided Workflows
- **Zero-Training 9-Step SOP Drawer (`Alt+R`):** Front-desk coordinators can open an interactive step-by-step operational drawer covering everything from client welcome to split-tender payment.
- **Speed Dial Quick Actions (`Alt+A`):** One-click hotkey to create a new appointment, launch express billing, register a client, or clock-in staff.
- **Searchable In-App Knowledge Base (`Alt+H`):** Built-in searchable handbook covering 10 operational modules.
- **Interactive System Tour (`Alt+T`):** 8-step guided onboarding walkthrough across the entire interface.
- **Global Command Palette (`Ctrl+K`):** Instant keyboard search across clients, staff, branches, services, and invoices.

### 🌟 2. Express Point of Sale (POS) & Billing Terminal
- **Touch-Optimized Fast-Lane POS (`http://localhost:3001`):** Category tabs (Hair, Skin, Spa, Retail) for instant cart building.
- **Automatic Membership Discounts:** Selecting a client automatically detects active memberships (e.g. 20% Diamond VIP discount) and applies pricing rules.
- **Line-Item Stylist Attribution:** Assign different stylists or therapists to individual items within a single invoice.
- **Indian GST Compliance:** Automatic computation of 18% GST (CGST 9% + SGST 9% / IGST 18%).
- **Split-Tender Multi-Payment:** Split a single bill across Cash, UPI QR code, Credit/Debit Card, Prepaid Wallet, and Loyalty Points.
- **Printable Thermal Receipts:** Instant receipt preview with salon branch logo, tax breakdown, and simulated WhatsApp receipt dispatch.
- **Park & Resume Held Carts:** Hold up to 5 simultaneous customer carts and switch between them without data loss.

### 🌟 3. Centralized Back-Office & Multi-Branch Management
- **Geographic Tree Hierarchy:** Browse and manage the salon hierarchy from Organization ➔ State ➔ District ➔ City ➔ Branch.
- **Universal Branch Switcher:** Instantly filter backoffice analytics, appointments, inventory, and staff by specific branch or consolidated organization totals.
- **Master Service Catalog:** Configure services, durations, buffer times, gender categories, branch-specific pricing, and backbar consumption recipes.
- **Staff Rosters & Biometric Attendance:** Daily shift schedules, staff attendance punch simulator, and leave approval workflows.
- **Progressive Commission Calculator:** Configure tiered revenue slabs (10%, 15%, 20%) with dynamic commission payouts and payroll exports.
- **Inventory & Backbar Recipes:** Product tracking with SKU/barcodes, purchase orders, inter-branch stock transfers, and backbar recipe consumption simulator.
- **Multi-Branch Finance & P&L:** Consolidated Profit & Loss statements, expense approvals, and month-end fiscal period locking.

### 🌟 4. Luxury Guest Portal & E-Commerce Storefront (`http://localhost:3002`)
- **4-Step Online Appointment Booking:** Select sanctuary branch, service + add-ons, master stylist, and time slot with dynamic booking QR code confirmation.
- **Retail E-Commerce Storefront:** Browse premium retail grooming products, add to cart, and choose between In-Store Branch Pickup (with OTP verification) or Courier Home Delivery.
- **Guest Account Hub:** View upcoming appointments, wallet balance, active memberships, loyalty points ledger, and downloadable invoice receipts.

### 🌟 5. Hive Salon AI (BI Analytics & Text-to-SQL)
- **Natural Language Business Queries:** Ask questions like *"Which branch had the highest revenue this month?"* or *"Who is our top performing stylist?"* to generate instant SQL and visual charts.
- **Zero-Mutation AST Security Guard:** Rejects all SQL write operations (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`) and comments to ensure read-only safety.
- **5 Predictive ML Forecasting Models:** Interactive forecasts for revenue growth, stockout risks, no-show probabilities, and staff scheduling optimization.

---

## 2. WHAT IS PARTIALLY AVAILABLE (Simulated / In-Memory State)

The following features have complete UI screens, interactive state management, and NestJS API endpoints, but operate using in-memory state or mock test data:

1. **Database Persistence:** The Prisma ORM schema is fully defined (2,199 lines) and the client is generated, but the backend currently stores changes in memory rather than writing directly to PostgreSQL.
2. **Real-Time Next.js API Proxying:** Frontend components execute with internal React state fallbacks when direct REST calls are not proxied.
3. **SMS & WhatsApp Broadcasts:** Message events and notification modals are triggered, but dispatch via Meta WhatsApp Cloud API and Twilio/MSG91 is simulated.
4. **Live Payment Gateway:** Payment flows simulate UPI QR code scans and card terminal approvals without live Razorpay/Stripe webhooks.
5. **Distributed Sessions:** User sessions and OTP verification operate in memory rather than a shared Redis cluster.

---

## 3. WHAT SHOULD BE IMPLEMENTED NEXT (Production Roadmap)

To deploy Hive Salon as a commercial enterprise production SaaS:

1. **Step 1 — Wire Prisma Repositories in NestJS:** Replace in-memory service arrays in `apps/api` with live Prisma ORM queries connected to PostgreSQL.
2. **Step 2 — Add Next.js Gateway Rewrites:** Configure `/api/v1/:path*` rewrites in `next.config.mjs` to proxy frontend API calls to NestJS on port 4000.
3. **Step 3 — Deploy Redis Cluster & BullMQ:** Implement Redis for distributed JWT session invalidation, OTP expiration, rate-limiting, and async background workers.
4. **Step 4 — Plug In Live Payment & SMS Credentials:** Connect live Razorpay / Stripe API keys, Meta WhatsApp Cloud API tokens, and MSG91 SMS gateways.
5. **Step 5 — Automated Unit & E2E Testing:** Build an automated test suite covering financial calculations, commission slabs, and front-desk booking flows.
6. **Step 6 — Production Containerization & CI/CD:** Create Dockerfiles and GitHub Actions deployment workflows.
