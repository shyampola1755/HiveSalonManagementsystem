# Hive Salon — Enterprise Administration & Operations Handbook

## 1. Multi-Branch Hierarchy Setup

### Adding Geographic Nodes
1. Navigate to **Locations & Network ➔ Geographical Tree** (`/branches/hierarchy`).
2. Expand your Organization and add new **States**, **Districts**, or **Cities**.
3. Under a City node, click **[+ Add Branch]** to register a new physical location.
4. Specify the branch name (e.g. *Jubilee Hills Flagship*), 2-letter billing prefix (e.g. `JH-01`), phone, address, and operating hours.

---

## 2. Access Control, Roles & Scoping

### Configuring User Roles & Geographic Scopes
1. Navigate to **Team & Access Control ➔ Users & Scopes** (`/users`).
2. Add a new team member and assign their system role:
   - `SUPER_ADMIN`: Full access across all geographic states, districts, and branches.
   - `REGIONAL_MANAGER`: Scoped to a specific State or District with oversight over child branches.
   - `BRANCH_MANAGER`: Scoped to a single physical Branch unit.
   - `SALON_COORDINATOR` / `FRONT_DESK`: Operations, appointments, POS, and CRM.
   - `SENIOR_STYLIST` / `THERAPIST`: Personal appointment diary and commission statements.

---

## 3. Commission Plans & Progressive Slabs

### Setting Up Progressive Slabs
1. Navigate to **Team & Access Control ➔ Commissions & Targets** (`/commissions`).
2. Create a new plan with progressive revenue tiers:
   - Tier 1: ₹0 to ₹50,000 @ 5.0%
   - Tier 2: ₹50,001 to ₹100,000 @ 7.5%
   - Tier 3: ₹100,001+ @ 10.0%
3. Assign the plan to stylist profiles under **Staff & Rosters**.

---

## 4. Financial Periods & Month-End Reconciliation

### Month-End Books Closing
1. Navigate to **Operations ➔ Finance & Central Reports** (`/finance`).
2. Review the automated Gross Revenue, GST Output Tax, Payroll Accruals, and Vendor Expenses.
3. Click **[Close Financial Period]** to lock the double-entry ledger from back-dated modifications.

---

## 5. Hive Salon AI Governance & Audit Log Review

### Auditing AI Queries & Security
1. Navigate to **Hive Salon AI ➔ AI Query Audit & SQL Security Inspector** (`/ai`).
2. Review the immutable audit log for:
   - Caller user ID, role, and branch scope.
   - Generated SQL queries (verifying zero mutation keywords).
   - Execution latency benchmarks in milliseconds.
