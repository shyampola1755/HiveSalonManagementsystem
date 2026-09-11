# HIVE SALON — ROLE & PERMISSION MATRIX

This document defines the server-enforced and UI-rendered permission matrix across the Hive Salon dual-portal operational structure.

---

## 1. DEFINITIVE PERMISSION MATRIX

| Operational Capability | Super Admin | Branch Manager | Front Desk Coordinator | Stylist / Colorist |
| :--- | :---: | :---: | :---: | :---: |
| **Customer Search & Directory** | Full | Full | Full (Phone-first) | Assigned Clients Only |
| **Customer 360 & Clinical Notes** | Full | Full | Full | Read & Add Formulas |
| **Prepaid Wallet Top-up & Ledger** | Full | Full | Full | No Access |
| **Appointment Booking & Calendar** | Multi-Branch | Branch Only | Branch Only | Personal Schedule |
| **Queue & Client Check-In** | Full | Branch Only | Full Control | Station View |
| **POS Touch Billing & Checkout** | Full | Full | Full Register | View Attribution Only |
| **Tax Invoice Generation & Printing**| Full | Full | Full | View Own Receipts |
| **Dispensary Hair Color Formulations**| Full | Full | Read Only | Full (Create & Edit) |
| **Inventory Stock Management** | Multi-Branch | Branch Stock | View Only | Dispensary Requests |
| **Staff Provisioning & Onboarding** | Full | Branch Staff | No Access | No Access |
| **Staff Commission Ledger** | Multi-Branch | Branch Overview | No Access | Personal Earnings |
| **Executive BI & Revenue Reports** | Multi-Branch | Branch Dashboard | Daily Shift Summary | Personal Performance |
| **Multi-Branch Hierarchy & Setup** | Full | No Access | No Access | No Access |
| **System Settings & Audit Logs** | Full | Limited Branch | No Access | No Access |

---

## 2. PORTAL SEGREGATION & ENFORCEMENT

1. **Front Desk Containment**:
   - Front Desk Coordinators cannot toggle to the Back Office Administration portal or access `/back-office/*` administration routes.
   - Any direct navigation attempts are intercepted by client-side Route Guards and server-side RBAC middleware, safely redirecting to `/front-desk/dashboard`.

2. **Branch Manager Scoping**:
   - Branch Managers are scoped to their assigned `primaryBranchId`.
   - Direct API queries for unauthorized branch IDs enforce multi-tenant isolation.

3. **Stylist Chair Containment**:
   - Stylists are dedicated to their workstation (`/stylist/station`), hair formulations, and commission tracking.
   - Financial management, multi-branch settings, and executive BI reports are strictly denied.
