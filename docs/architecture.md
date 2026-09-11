# Hive Salon — Enterprise Architecture Specification

## 1. Architectural Philosophy

Hive Salon is built on the **Modular Monolith** architecture with strict domain boundaries, event-driven decoupling, and multi-tenant data isolation.

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                      CLIENT APPLICATIONS                    │
                    ├──────────────────────┬──────────────────────┬───────────────┤
                    │   apps/web-admin     │    apps/web-pos      │customer-portal│
                    │ (Next.js Backoffice) │(Next.js Tablet/Desk) │ (Next.js Mob) │
                    └──────────┬───────────┴──────────┬───────────┴───────┬───────┘
                               │                      │                   │
                               ▼                      ▼                   ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                  API GATEWAY & SECURITY LAYER               │
                    │         (RBAC ScopeGuard, Rate Limiting, CORS, JWT Auth)    │
                    └──────────────────────────────┬──────────────────────────────┘
                                                   │
                                                   ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                     apps/api (NestJS Core)                  │
                    │                                                             │
                    │  ┌───────────────┐ ┌───────────────┐ ┌───────────────────┐  │
                    │  │ Auth & Scopes │ │ Multi-Branch  │ │ Global Search     │  │
                    │  └───────┬───────┘ └───────┬───────┘ └─────────┬─────────┘  │
                    │  ┌───────┴───────┐ ┌───────┴───────┐ ┌─────────┴─────────┐  │
                    │  │ Appointments  │ │ POS & Billing │ │ Audit Logging     │  │
                    │  └───────┬───────┘ └───────┬───────┘ └─────────┬─────────┘  │
                    │  ┌───────┴───────┐ ┌───────┴───────┐ ┌─────────┴─────────┐  │
                    │  │ Inventory     │ │ Memberships   │ │ Marketing Auto    │  │
                    │  └───────┬───────┘ └───────┬───────┘ └─────────┬─────────┘  │
                    │  ┌───────┴───────┐ ┌───────┴───────┐ ┌─────────┴─────────┐  │
                    │  │ Finance & Tax │ │ E-Commerce    │ │ Hive Salon AI     │  │
                    │  └───────────────┘ └───────────────┘ └───────────────────┘  │
                    │                                                             │
                    │        Global Exception Filters (Human-Friendly Mappers)    │
                    │        Global Interceptors (Audit Logger & Serialization)   │
                    └──────────────┬───────────────────────────────┬──────────────┘
                                   │                               │
                                   ▼                               ▼
                    ┌──────────────────────────────┐ ┌────────────────────────────┐
                    │     PostgreSQL 16 Database   │ │      Redis & EventBus      │
                    │  (Prisma ORM / Multi-Tenant) │ │ (Cache, Rate-limit, Queue) │
                    └──────────────────────────────┘ └────────────────────────────┘
```

---

## 2. Monorepo Organization & Dependencies

The codebase utilizes **Turborepo** with dependency graph isolation:

```
@hive/types (Universal Domain Definitions)
     ▲
     │
     ├──────────────┬──────────────┬──────────────┬──────────────┐
     │              │              │              │              │
@hive/database  @hive/auth   @hive/utilities @hive/validation @hive/events
     ▲              ▲              ▲              ▲              ▲
     │              │              │              │              │
     └──────────────┴──────┬───────┴──────────────┴──────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
             @hive/ui            @hive/api
                 ▲                   ▲
                 │                   │
         ┌───────┴───────┐           │
         │               │           │
  @hive/web-admin  @hive/web-pos @hive/customer-portal
```

---

## 3. Geographic Multi-Branch Tree Hierarchy

All physical and logical operations map strictly to a 5-tier geographic tree:

```
Organization (e.g. Hive Beauty Group)
  └── State (e.g. Telangana)
        └── District (e.g. Hyderabad Urban)
              └── City (e.g. Hyderabad)
                    ├── Branch 1: Jubilee Hills Flagship (b1)
                    ├── Branch 2: Banjara Hills Spa (b2)
                    └── Branch 3: Hitech City Express (b3)
  └── State (e.g. Karnataka)
        └── District (e.g. Bengaluru Urban)
              └── City (e.g. Bengaluru)
                    └── Branch 4: Indiranagar Sanctuary (b4)
```

### Inheritance & Rules:
1. **Inheritance**: Tax rules, GST configurations, and regional holiday calendars cascade down the tree.
2. **Access Scoping**: A user scoped to `District: Hyderabad Urban` automatically inherits access to all branches within that district (Jubilee Hills + Banjara Hills), but is strictly blocked from `Hitech City` (Ranga Reddy district) and `Indiranagar` (Karnataka state).

---

## 4. Financial & Inventory Ledger Invariants

To guarantee commercial SaaS integrity, Hive Salon enforces strict immutable ledger invariants:

### 1. Zero-Negative-Balance Customer Wallets
- Prepaid wallet debits require an atomic balance check. Any transaction attempting to reduce balance `< 0` is rolled back immediately with error code `INSUFFICIENT_WALLET_BALANCE`.

### 2. Double-Entry Inventory Ledger
- Physical inventory is never updated via naive counters. Every mutation creates an immutable `StockLedgerEntry` with `quantityChange`, `resultingBalance`, `transactionType` (`PURCHASE_RECEIPT`, `SALE_DEDUCTION`, `SERVICE_RECIPE_CONSUMPTION`, `BRANCH_TRANSFER_OUT`, `BRANCH_TRANSFER_IN`, `STOCK_ADJUSTMENT`), and `actorId`.

### 3. Commission Ledger & Refund Clawbacks
- Invoicing automatically creates a `CREDIT` entry in `CommissionLedgerEntry`. When an invoice is refunded or voided, the system automatically writes a `CLAWBACK_REVERSAL` debit entry linked to the original transaction ID.

---

## 5. Event-Driven Communication

Cross-module workflows communicate asynchronously via the `@hive/events` domain event bus:

| Event Name | Producer | Consumers |
| :--- | :--- | :--- |
| `appointment.created` | AppointmentModule | MarketingModule (SMS/WhatsApp confirmation), AuditModule |
| `invoice.paid` | PosModule | InventoryModule (deduct retail stock), CommissionModule (accrue earnings), MembershipModule (issue loyalty points) |
| `invoice.refunded` | PosModule | CommissionModule (clawback commission), InventoryModule (restock units), CustomerModule (reverse loyalty) |
| `inventory.low_stock` | InventoryModule | NotificationModule (alert branch manager), AiModule (restock prediction) |
| `order.placed` | EcommerceModule | InventoryModule (atomic stock reservation), OrderHubModule (reception dispatch queue) |

---

## 6. Zero-Mutation AI Layer

Hive Salon AI operates through a secured read-only pipeline:
1. **AST & Regex Security Validator**: Blocks any query string containing DDL/DML keywords (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `CREATE`, `GRANT`, `REVOKE`) or comment markers (`--`, `/*`).
2. **Forced Tenant & Branch Predicate Injection**: Tenant (`organization_id = :orgId`) and branch scopes (`branch_id = :branchId`) are appended programmatically outside the generated SQL.
3. **Immutable Query Auditing**: Latency, question, user context, and generated queries are logged to `ai_audit_logs`.
