# Hive Salon — Enterprise Security & Compliance Specification

## 1. Security Architecture & Threat Model

Hive Salon implements defense-in-depth security engineered for multi-tenant multi-branch healthcare, salon, and clinical operations.

```
Incoming Request
  │
  ▼
[1. Web Application Firewall & SSL Termination]
  │
  ▼
[2. Rate Limiting Guard (Token Bucket / Redis)]
  │
  ▼
[3. JWT Authentication & Session Validity Check]
  │
  ▼
[4. Multi-Tenant ScopeGuard (Organization Isolation)]
  │
  ▼
[5. Geographic RBAC Boundary Evaluator (State/District/City/Branch)]
  │
  ▼
[6. Zod DTO Validation & Input Sanitization]
  │
  ▼
[7. Business Logic & Immutable Double-Entry Ledger Engine]
  │
  ▼
[8. Database Layer (PostgreSQL Parameterized Queries)]
  │
  ▼
[9. Immutable Audit Logger]
```

---

## 2. Multi-Tenant & Geographic Isolation Guard

### 1. Mandatory Tenant Predicate Enforcement
- Every database query automatically binds `organization_id = :orgId`. Direct queries omitting tenant predicates are rejected at the ORM middleware level.

### 2. Geographic Boundary Inheritance
- Users assigned to a specific branch (e.g. `Jubilee Hills`) cannot query or modify entities in sibling branches (e.g. `Banjara Hills` or `Indiranagar`).
- Attempted cross-branch access triggers an automatic HTTP `403 Forbidden` response and records a security alert in `audit_logs`.

---

## 3. Hive Salon AI — Zero-Mutation Security Guarantee

The AI layer operates under non-negotiable security guarantees:

1. **Strict Read-Only Connection & Transactions**:
   - All AI Text-to-SQL queries run in read-only mode (`SET TRANSACTION READ ONLY`).
2. **AST & Lexical Security Validator**:
   - Before execution, all generated queries pass through lexical AST inspection. The system strictly rejects:
     - DDL/DML Mutations: `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `CREATE`, `GRANT`, `REVOKE`, `EXEC`, `EXECUTE`, `SHUTDOWN`, `VACUUM`.
     - Injection Syntax: Multi-statement delimiters (`;`), SQL comments (`--`, `/*`, `*/`), and union queries against sensitive system tables (`pg_catalog`, `information_schema`).
3. **Forced Predicate Injection**:
   - The user's active tenant (`organization_id`) and geographic branch scopes are injected programmatically into the query predicates outside of the AI generation pipeline.
4. **Schema Masking**:
   - Raw database schema details and tenant parameters are sanitized and obfuscated from non-admin staff.

---

## 4. Authentication, Tokens & Password Policies

| Control | Implementation |
| :--- | :--- |
| **Password Hashing** | Argon2id / bcrypt (12 rounds) with individual salts |
| **Brute-Force Protection** | Account temporarily locked for 15 minutes after 5 consecutive failed login attempts |
| **Token Standards** | Short-lived JWT Access Tokens (15 mins) + Rotating Refresh Tokens (7 days) |
| **Session Revocation** | Immediate invalidation of all active user sessions upon password reset or role change |
| **CORS Policy** | Whitelisted origins only (`web-admin`, `web-pos`, `customer-portal`) |

---

## 5. Financial Audit & Double-Entry Invariants

- **Zero-Negative Wallet Guarantee**: Database check constraints prevent customer wallet balances from dropping below `0.00`.
- **Idempotency Keys**: POS checkout requests accept an `Idempotency-Key` header preventing duplicate billings during network retry spikes.
- **Refund Clawbacks**: Refunds automatically record negative commission reversals against the credited stylists.
- **Audit Logging**: All discount overrides, invoice voids, and role alterations create immutable log entries with IP address, user ID, timestamp, and pre/post payload diffs.
