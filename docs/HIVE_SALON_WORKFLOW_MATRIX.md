# HIVE SALON — BUSINESS WORKFLOW AUDIT & VERIFICATION MATRIX

> **Verified Codebase Audit — September 11, 2026**  
> Every workflow below has been traced directly through: **UI (`apps/web-admin`, `apps/web-pos`, `apps/customer-portal`) ➔ API (`apps/api/src/modules`) ➔ Service Store ➔ Database Model (`packages/database/prisma/schema.prisma`) ➔ Event Bus (`packages/events`) ➔ Result**.

---

## 22 Core Business Workflows — Detailed Verification

### 1. New Customer Registration
- **UI Trigger:** Receptionist opens Customer modal (`Alt+A` speed dial or `/customers`).
- **Data Capture:** Full Name, Mobile, Email, Gender, Birthdate, Allergy Notes, and Skin Profile tags.
- **Backend Flow:** `CustomerController.create` ➔ `CustomerService.create` ➔ Validated via Zod `CreateCustomerSchema`.
- **Database Model:** `Customer`, `CustomerNote`, `CustomerPrepaidWallet`, `CustomerLoyaltyLedger`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED` (Interactive UI state works in React; NestJS service uses in-memory Map store; Prisma model `Customer` ready).

### 2. Appointment Booking (Front-Desk Diary)
- **UI Trigger:** Front-desk opens Diary (`/appointments`).
- **Data Capture:** Customer, Sanctuary Branch, Service(s), Stylist, Date, Start Time, and Notes.
- **Backend Flow:** `AppointmentController.create` ➔ `AppointmentService.create` with `CollisionCheckResult` conflict detection.
- **Database Model:** `Appointment`, `AppointmentService`, `AppointmentNotification`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED` (Collision detection algorithm implemented; in-memory store).

### 3. Online Guest Appointment Booking
- **UI Trigger:** Guest opens Customer Portal (`http://localhost:3002`).
- **Data Capture:** 4-Step Wizard: Branch ➔ Service & Add-ons ➔ Master Stylist ➔ Date & Time Slot.
- **Confirmation:** Generates dynamic confirmation screen with SVG Booking QR Code and simulated WhatsApp booking SMS.
- **Database Model:** `Appointment`, `AppointmentService`, `Customer`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED` (Full interactive wizard on port 3002; client React state).

### 4. Walk-In Express Queue Management
- **UI Trigger:** Unscheduled guest arrives; receptionist clicks 'Add Walk-In' in `/appointments` Queue tab.
- **Data Capture:** Guest Name, Mobile, Service requested, Preferred Stylist (or Next Available).
- **Backend Flow:** `AppointmentService.createWalkIn` generates Queue Token (`Q-001`, `Q-002`) with status `WAITING`.
- **Transitions:** `WAITING` ➔ `IN_CHAIR` (records service start) ➔ `COMPLETED` (transfers to POS).
- **Database Model:** `Appointment` (isWalkIn: true, queueToken, queueStatus).
- **Verified Code Status:** `PARTIALLY IMPLEMENTED` (Interactive queue management operational in UI).

### 5. Client Check-In & Service Commencement
- **UI Trigger:** Front-desk clicks 'Check-In' on pre-booked appointment card.
- **State Transition:** Status updates from `CONFIRMED` to `CHECKED_IN` with timestamp, then `IN_PROGRESS`.
- **Database Model:** `Appointment.checkedInAt`, `Appointment.serviceStartedAt`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 6. Service Completion & POS Cart Transfer
- **UI Trigger:** Stylist marks service finished.
- **State Transition:** Status changes to `COMPLETED` (`serviceCompletedAt` set); bill moves to front-desk checkout.
- **Database Model:** `Appointment.status = 'COMPLETED'`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 7. Point of Sale Express Billing (Front-Desk POS)
- **UI Trigger:** Front-Desk POS Terminal on `http://localhost:3001` or `/pos`.
- **Operations:**
  - Customer selection (e.g. Priya Sharma) auto-detects active Membership (e.g. Royal Diamond VIP 20% discount).
  - Multi-category touch grid (Hair, Skin, Spa, Retail).
  - Line-item stylist attribution (e.g. Balayage to Aarav Mehta, Facial to Maya Iyer).
  - Automatic 18% GST (CGST 9% + SGST 9% / IGST 18%) calculation.
- **Database Model:** `Invoice`, `InvoiceItem`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED` (Full touch POS operational on port 3001).

### 8. Split-Tender Multi-Payment & Invoice Settlement
- **UI Trigger:** Operator clicks 'Collect Payment' in POS modal.
- **Tender Allocation:** Multi-tender split across Cash, UPI QR code, Credit/Debit Card, Prepaid Wallet, and Loyalty Points.
- **Validation:** Live remainder indicator ensures total paid equals net invoice payable.
- **Artifact:** Generates sequential Invoice Number (`INV-YYYY-XXXX`) and printable 80mm thermal slip.
- **Database Model:** `Invoice`, `Payment`, `DigitalReceipt`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 9. Invoice Refund & Credit Note Issuance
- **UI Trigger:** Operator initiates refund from Invoice history in `/finance` or POS.
- **Data Capture:** Item selection, refund amount, refund tender destination, mandatory reason code.
- **Accounting:** Emits refund record, reverses stylist commission, updates stock if retail item returned.
- **Database Model:** `Refund`, `Invoice.status = 'REFUNDED'`, `CommissionLedgerEntry`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 10. Membership Plan Purchase & Activation
- **UI Trigger:** Customer purchases membership plan in `/memberships` or at POS register.
- **Tiers Supported:** 6 Archetypes (Royal Diamond VIP, Prepaid Privilege, Platinum VIP, Corporate, Family, Aesthetic).
- **Benefit Application:** Instant tier discount auto-injected into subsequent POS line items.
- **Database Model:** `MembershipPlan`, `CustomerMembership`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 11. Multi-Session Package Redemption
- **UI Trigger:** Client redeems bundled service (e.g., Session 2 of 6 Laser Hair Reduction).
- **Execution:** Front-desk selects 'Redeem Package'; subtotal is ₹0, package remaining sessions decremented from $N$ to $N-1$.
- **Database Model:** `CustomerPackage.sessionsRemaining`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 12. Prepaid Customer Wallet Top-Up & Deduction
- **UI Trigger:** Customer deposits funds into prepaid salon wallet.
- **Execution:** `WALLET_CREDIT` logged in ledger; POS checkout deducts balance with zero-negative check.
- **Database Model:** `CustomerPrepaidWallet`, `CustomerWalletTransaction`, `WalletLedgerEntry`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 13. Loyalty Points Accumulation & Redemption
- **UI Trigger:** Points accrued on paid invoice totals (1 pt per ₹100 spent).
- **Redemption:** Points converted to instant cash discount during billing.
- **Database Model:** `CustomerLoyaltyLedger`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 14. Vendor Purchase Order & Goods Receiving
- **UI Trigger:** Inventory manager creates PO in `/inventory`.
- **Lifecycle:** `DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` (by CFO) ➔ `RECEIVED` (physical goods counted).
- **Stock Impact:** Branch stock levels increment; `StockLedgerEntry` records `PO_RECEIPT`.
- **Database Model:** `Vendor`, `PurchaseOrder`, `PurchaseOrderItem`, `Stock`, `StockLedgerEntry`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 15. Inter-Branch Stock Transfer
- **UI Trigger:** Transfer request initiated in `/inventory` between two branches.
- **Lifecycle:** `REQUESTED` ➔ `DISPATCHED` (source branch stock decrements) ➔ `RECEIVED` (destination stock increments).
- **Database Model:** `BranchTransfer`, `BranchTransferItem`, `Stock`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 16. Backbar Service Consumption Execution
- **UI Trigger:** Service configured with backbar recipe (e.g., 60ml Color + 90ml Developer).
- **Execution:** Consumption simulator in `/inventory` decrements branch bulk stock and logs `SERVICE_CONSUMPTION`.
- **Database Model:** `ServiceRecipe`, `ServiceRecipeItem`, `StockLedgerEntry`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 17. Biometric Staff Attendance & Shift Rostering
- **UI Trigger:** Manager assigns shift templates in `/staff`; staff records biometric punch IN/OUT.
- **Calculation:** Shift duration, late check-in minutes, and overtime calculated automatically.
- **Database Model:** `ShiftTemplate`, `StaffRosterSchedule`, `StaffAttendanceRecord`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 18. Staff Leave Application & Manager Review
- **UI Trigger:** Staff applies for leave in `/staff`; branch manager reviews and approves/rejects.
- **Calendar Impact:** Approving leave automatically blocks booking on staff diary.
- **Database Model:** `StaffLeaveRequest`, `StaffLeaveBalance`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 19. Progressive Commission Calculation & Payroll
- **UI Trigger:** Month-end commission run in `/commissions`.
- **Algorithm:** Progressive tiered revenue slabs (e.g. 10% on 0–₹50k, 15% on ₹50k–₹100k, 20% >₹100k).
- **Payroll:** Base salary + Net commission - TDS deductions = Net payable. Exportable to bank CSV.
- **Database Model:** `CommissionPlan`, `CommissionSlab`, `CommissionLedgerEntry`, `StaffPayroll`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 20. Automated Marketing Campaign Execution
- **UI Trigger:** Campaign configured in `/marketing` for Birthday, Anniversary, Winback, or Rebooking.
- **Audience:** Dynamic RFM segments (Champions, Loyal, At Risk, Hibernating).
- **Dispatch:** Generates personalized WhatsApp/SMS template vouchers (simulated).
- **Database Model:** `MarketingCampaign`, `MarketingSegment`, `CampaignRecipient`, `WhatsAppTemplate`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 21. Multi-Carrier Retail Order Dispatch
- **UI Trigger:** Guest places retail order on Guest Storefront (`http://localhost:3002`).
- **Fulfillment Choice:** In-Store Branch Pickup (OTP/QR verification) OR Courier Home Delivery.
- **Operations:** Order Console (`/orders`) assigns courier (Bluedart/Delhivery) and tracks status.
- **Database Model:** `Order`, `OrderItem`, `ShippingDetails`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.

### 22. Month-End Fiscal Period Audit & Lock
- **UI Trigger:** CFO reviews Multi-Branch P&L statement in `/finance`.
- **Audit Checklist:** Bank deposits, vendor invoices, stylist commissions, and GST output liability.
- **Execution:** Clicks 'Lock & Freeze Period' — freezes all ledger transactions for that month.
- **Database Model:** `FinancialPeriod`, `FinancialPeriodAudit`, `GeneralLedgerEntry`.
- **Verified Code Status:** `PARTIALLY IMPLEMENTED`.
