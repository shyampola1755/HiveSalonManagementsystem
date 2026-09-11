# Hive Salon — Two Primary Portals Architecture Specification

> **Version**: 2.0.0  
> **Classification**: Enterprise Core Architecture  
> **Status**: APPROVED & IMPLEMENTED  

---

## 1. Executive Summary

Hive Salon operates on exactly **TWO primary application portals**:

```
                              ┌─────────────────────────────┐
                              │    WELCOME TO HIVE SALON    │
                              │           /login            │
                              └──────────────┬──────────────┘
                                             │
                   ┌─────────────────────────┴─────────────────────────┐
                   ▼                                                   ▼
     ┌───────────────────────────┐                       ┌───────────────────────────┐
     │        FRONT DESK         │                       │        BACK OFFICE        │
     │   /front-desk/dashboard   │                       │   /back-office/dashboard  │
     │                           │                       │                           │
     │ "Run today's salon        │                       │ "Manage and grow your     │
     │  operations"              │                       │  salon business"          │
     └───────────────────────────┘                       └───────────────────────────┘
```

Rather than creating fragmented individual login portals for each job title (stylist, receptionist, accountant, manager, owner, inventory clerk, etc.), all system users authenticate through either **Front Desk** or **Back Office**.

A user's **Role**, **Permissions Matrix**, and **Geographic Scope** determine their capabilities within that portal.

---

## 2. Portal Separation & Domain Boundaries

| Dimension | FRONT DESK WORKSPACE (`/front-desk/*`) | BACK OFFICE WORKSPACE (`/back-office/*`) |
| :--- | :--- | :--- |
| **Primary User Base** | Receptionists, Front Desk Executives, Cashiers, Stylists, Floor Managers | Salon Owners, Multi-Branch Directors, General Managers, CFOs, Accountants, Inventory Directors |
| **UX Design Philosophy** | Action-oriented, high-contrast, touch-optimized, sub-second lookup, zero clutter | Analytical, dense multi-table ledgers, multi-tier filters, exportable reports, AST AI copilot |
| **Core Functions** | Appointments, 10-digit mobile lookup, Queue board, Check-in, POS Fast Billing, Invoicing, Split Payments, Wallet Top-ups | Multi-branch directory, Geographic tree, Shift rosters, Inventory ledger & BOM, Expense governance, P&L, AI Text-to-SQL |
| **Geographic Scope** | Bound strictly to **Single Active Branch** assigned to terminal/cashier | Multi-Branch, City, District, State, or Enterprise Organization scope |
| **Hotkeys & Helpers** | `Ctrl+K` (Customer Lookup), `Alt+A` (Quick Sale), `Alt+R` (Receptionist 9-Step SOP), `Alt+H` (Help) | `Ctrl+K` (Global Search), `Ctrl+/` (Module Guide), `Enter` (AI Query), Date range & Branch dropdowns |

---

## 3. The 5-Tier Authorization Hierarchy

Every request in Hive Salon is evaluated through a strict 5-tier security hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PORTAL CONTEXT                                           │
│    Is the user authorized for FRONT_DESK or BACK_OFFICE?    │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. SYSTEM ROLE                                              │
│    Which of the 14 standard RBAC roles does the user hold?  │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. GRANULAR PERMISSIONS                                     │
│    Does the role contain the required action flags?         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. GEOGRAPHIC SCOPE                                         │
│    State -> District -> City organizational boundary        │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. BRANCH SCOPE                                             │
│    Specific salon physical unit ID isolation                │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Role-to-Portal Matrix & Default Routing

| System Role | Default Portal | Allowed Portals | Dual-Portal Switcher? | Typical Use Case |
| :--- | :--- | :--- | :---: | :--- |
| `FRONT_DESK` | `FRONT_DESK` | `['FRONT_DESK']` | ❌ No | Front desk receptionist, check-in, bookings, and cashiering |
| `RECEPTIONIST` | `FRONT_DESK` | `['FRONT_DESK']` | ❌ No | Guest hospitality, queue management, walk-ins |
| `CASHIER` | `FRONT_DESK` | `['FRONT_DESK']` | ❌ No | POS billing, split payments, GST invoice generation |
| `STYLIST` | `FRONT_DESK` | `['FRONT_DESK']` | ❌ No | Chair schedule, guest history, commission preview |
| `THERAPIST` | `FRONT_DESK` | `['FRONT_DESK']` | ❌ No | Spa schedule, treatment notes, guest allergy checks |
| `BARBER` | `FRONT_DESK` | `['FRONT_DESK']` | ❌ No | Men's grooming schedule, walk-in services |
| `COLORIST` | `FRONT_DESK` | `['FRONT_DESK']` | ❌ No | Color formulation records, patch test safety, service notes |
| `BRANCH_MANAGER` | `BACK_OFFICE` | `['FRONT_DESK', 'BACK_OFFICE']` | ✅ Yes | Floor operations & branch-level financial oversight |
| `ORGANIZATION_OWNER` | `BACK_OFFICE` | `['FRONT_DESK', 'BACK_OFFICE']` | ✅ Yes | Enterprise owner; full access across all salons & back office |
| `SUPER_ADMIN` | `BACK_OFFICE` | `['FRONT_DESK', 'BACK_OFFICE']` | ✅ Yes | System superuser with unrestricted platform control |
| `ACCOUNTANT` | `BACK_OFFICE` | `['BACK_OFFICE']` | ❌ No | P&L, expense approvals, tax filing, payroll commission export |
| `INVENTORY_MANAGER`| `BACK_OFFICE` | `['BACK_OFFICE']` | ❌ No | Stock ledger, purchase orders, vendor CRM, branch transfers |
| `MARKETING_MANAGER`| `BACK_OFFICE` | `['BACK_OFFICE']` | ❌ No | WhatsApp/SMS campaigns, triggers, review escalation |
| `HR_MANAGER` | `BACK_OFFICE` | `['BACK_OFFICE']` | ❌ No | Staff hiring, shift templates, biometric sync, leave ledger |

---

## 5. Dual-Portal Role Switcher Mechanics

Users with cross-portal roles (`ORGANIZATION_OWNER`, `BRANCH_MANAGER`, `SUPER_ADMIN`) have access to the dynamic **Portal Switcher**:

1. **Header Action**: A prominent switcher button in the top navigation bar displays:
   - When in Front Desk: `⚡ Switch to Back Office`
   - When in Back Office: `🏪 Switch to Front Desk`
2. **Instant Context Switch**: Clicking the switcher changes the active workspace route (`/front-desk/dashboard` ⟷ `/back-office/dashboard`) without re-authenticating or terminating the active session.
3. **RBAC Guardrail**: Non-dual-portal roles (e.g., `RECEPTIONIST` or `ACCOUNTANT`) do not see the switcher, and direct URL navigation to unauthorized portals is blocked by `PortalGuard`.

---

## 6. Backend Guard Implementation

Backend endpoints enforce portal constraints via the `@RequirePortal()` decorator combined with `PortalGuard`:

```typescript
// apps/api/src/common/guards/portal.guard.ts
@Injectable()
export class PortalGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPortal = this.reflector.getAllAndOverride<PortalType>(
      PORTAL_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPortal) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthSession;

    if (!user || !user.role) {
      throw new ForbiddenException('User authentication required for portal access.');
    }

    if (!canAccessPortal(user.role, requiredPortal)) {
      throw new ForbiddenException(
        `Role '${user.role}' is not authorized to access the ${requiredPortal} portal.`
      );
    }

    return true;
  }
}
```

---

## 7. Zero-Training Front Desk Ergonomics

Front Desk is designed for instantaneous usability with **zero prior software training**:

1. **Action-Oriented Dashboard**: Instant metrics for Today's Appointments, Lounge Guests, In-Service Chairs, Today's Sales (₹), and Pending Payments.
2. **Receptionist 9-Step SOP Guide (`Alt+R`)**: Built-in drawer detailing every stage of a guest visit from lookup to rebooking.
3. **10-Digit Mobile Search**: Fast search bar with 4 quick action buttons (Book, Check-in, Bill, Profile).
4. **Touch POS Billing (`/front-desk/pos`)**: Fast-lane category tiles, multi-stylist attribution, combo discounts, and multi-mode split payments (Cash, UPI, Card, Wallet).
5. **Instant GST Receipt Delivery**: 1-click WhatsApp Cloud dispatch or thermal 80mm slip printing.

---

## 8. Back Office Enterprise Control Ergonomics

Back Office provides centralized multi-branch oversight:

1. **5-Tier Geographic Header**: Real-time filtering across Organization ➔ State ➔ District ➔ City ➔ Branch.
2. **Read-Only AI Copilot (`/back-office/ai`)**: Natural language Text-to-SQL business intelligence with AST mutation rejection and RBAC predicate injection.
3. **Double-Entry Stock Ledger (`/back-office/inventory`)**: Immutable stock tracking with Bill of Materials consumption and branch transfer quarantine.
4. **4-Stage Expense Governance (`/back-office/finance`)**: Draft ➔ Submit ➔ Approve ➔ Paid workflow preventing unauthorized cash disbursements.
5. **Dynamic Commission Engine (`/back-office/team/commissions`)**: Multi-tier progressive slabs, multi-stylist line item splits, and refund clawbacks.
