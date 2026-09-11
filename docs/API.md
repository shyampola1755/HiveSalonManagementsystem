# Hive Salon — REST API Specification & Endpoint Catalog

## 1. Gateway & Authentication Headers

All API requests to `http://localhost:4000/api/v1` require the following headers:

```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
x-org-id: <ORGANIZATION_UUID>
x-branch-id: <BRANCH_UUID> (Required for branch-scoped operations)
Content-Type: application/json
```

---

## 2. API Endpoints Catalog (By Module)

### 1. Authentication & RBAC (`/api/v1/auth`, `/api/v1/rbac`)
- `POST /auth/login`: Authenticate user credentials and issue JWT tokens.
- `POST /auth/refresh`: Refresh expired access token with valid refresh token.
- `POST /auth/logout`: Revoke active session tokens.
- `GET /rbac/roles`: List all enterprise and custom roles.
- `POST /rbac/roles`: Create a new role with specific permissions.
- `GET /rbac/users/:id/scopes`: List geographic access scopes for a user.

### 2. Geographic Hierarchy (`/api/v1/hierarchy`)
- `GET /hierarchy/tree`: Retrieve the full 5-tier geographic organizational tree.
- `POST /hierarchy/states`: Create a new State node.
- `POST /hierarchy/districts`: Create a new District node.
- `POST /hierarchy/cities`: Create a new City node.
- `POST /hierarchy/branches`: Register a new physical Branch salon/spa location.

### 3. Customer CRM & Retention (`/api/v1/customers`, `/api/v1/memberships`)
- `GET /customers`: Search and list customers with filtering by tier and branch.
- `POST /customers`: Register a new customer profile.
- `GET /customers/:id/timeline`: Retrieve unified omnichannel customer history.
- `POST /customers/:id/wallet/topup`: Top-up customer prepaid wallet balance.
- `GET /memberships/plans`: List active membership plans and pricing tiers.
- `POST /memberships/subscribe`: Subscribe a customer to a membership plan.

### 4. Appointment Diary & Scheduling (`/api/v1/appointments`)
- `GET /appointments`: Retrieve appointments for a branch and date range.
- `POST /appointments`: Book a new appointment with double-booking validation.
- `PATCH /appointments/:id/status`: Transition status (`SCHEDULED`, `CONFIRMED`, `IN_SERVICE`, `COMPLETED`, `NO_SHOW`, `CANCELLED`).
- `PATCH /appointments/:id/reschedule`: Move appointment to a new date, time, or stylist.

### 5. Point of Sale (POS) & Invoicing (`/api/v1/pos`)
- `POST /pos/invoices`: Generate a tax-compliant 18% GST invoice.
- `POST /pos/invoices/:id/pay`: Record payment with split tender support (UPI/Card/Cash/Wallet).
- `POST /pos/invoices/:id/refund`: Execute a partial or full refund with commission clawback.
- `GET /pos/invoices/:id/receipt`: Generate a printable thermal receipt and digital WhatsApp payload.

### 6. Inventory & Procurement (`/api/v1/inventory`)
- `GET /inventory/products`: List retail and backbar product SKUs with branch stock levels.
- `POST /inventory/products`: Register a new product SKU.
- `POST /inventory/transfers`: Create an inter-branch stock transfer request.
- `POST /inventory/adjustments`: Record physical audit stock adjustments with reason codes.
- `GET /inventory/reorders`: List products below safety threshold with suggested PO quantities.

### 7. Staff & Commissions (`/api/v1/staff`, `/api/v1/commissions`)
- `GET /staff`: List staff profiles, designations, and branch assignments.
- `POST /staff`: Onboard a new staff member.
- `GET /commissions/plans`: List tiered commission slab configurations.
- `GET /commissions/ledger`: Retrieve immutable commission credit and clawback entries.
- `GET /commissions/payroll/summary`: Generate payroll gross-to-net calculation sheet.

### 8. Retail E-Commerce & Omnichannel Sales (`/api/v1/ecommerce`)
- `GET /ecommerce/products`: Browse customer storefront catalog with category and concern filters.
- `POST /ecommerce/orders`: Place a retail order with branch pickup (OTP) or courier delivery.
- `PATCH /ecommerce/orders/:id/status`: Advance order lifecycle (`PLACED` ➔ `CONFIRMED` ➔ `PACKED` ➔ `READY_FOR_PICKUP` ➔ `DELIVERED`).
- `POST /ecommerce/orders/:id/verify-otp`: Verify 4-digit pickup OTP for in-store guest handovers.

### 9. Hive Salon AI (`/api/v1/ai`)
- `POST /ai/query`: Execute natural language Text-to-SQL query with RBAC predicate injection.
- `GET /ai/forecasts`: Retrieve 5 predictive machine learning models (Revenue, Bookings, Stockout, Churn, Demand).
- `GET /ai/insights`: Retrieve automated proactive strategic business insights.
- `GET /ai/audit`: Retrieve immutable AI query audit log (restricted to Admin/Auditor roles).

---

## 3. Standard Error Response Schema

All API error responses adhere to a consistent 3-part format:

```json
{
  "statusCode": 400,
  "error": "BAD_REQUEST",
  "message": "Double-booking conflict detected on Stylist Priya Sharma.",
  "reason": "Stylist is already booked for 'Artisan Balayage' between 02:00 PM and 04:30 PM.",
  "remediation": "Choose another available time slot or assign the booking to Senior Colorist Rajesh Kumar.",
  "timestamp": "2026-09-10T14:15:00.000Z",
  "path": "/api/v1/appointments"
}
```
