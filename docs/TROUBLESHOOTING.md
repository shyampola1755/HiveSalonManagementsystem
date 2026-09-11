# Hive Salon — Diagnostic & Troubleshooting Playbook

## 1. Quick Diagnostic Checklist

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **"Double-booking conflict detected"** | Stylist or station already booked during requested time slot | Open Diary and select an open time slot or assign to an alternative available stylist. |
| **"Insufficient wallet balance"** | Customer wallet has less balance than requested debit amount | Top-up the customer wallet or collect remaining balance via UPI/Card/Cash. |
| **"Branch access denied (403 Forbidden)"** | User is not scoped to the selected branch | Contact Super Admin to grant geographic access under Users & Scopes (`/users`). |
| **"Critical Stockout Alert"** | Product units below minimum safety threshold | Generate an automated Purchase Order or trigger an Inter-Branch Stock Transfer (`/inventory`). |
| **"AI Query Rejected (Security Guard)"** | Query contained disallowed SQL keywords (INSERT/UPDATE/DELETE/DROP) | Hive Salon AI operates in strict read-only mode. Use natural language analytical questions only. |

---

## 2. Error Codes Dictionary

### 1. Appointments & Scheduling
- `ERR_APPOINTMENT_DOUBLE_BOOKING`: Overlapping booking detected for stylist or chair.
- `ERR_INVALID_BUFFER_TIME`: Turnaround buffer violated between back-to-back chemical treatments.

### 2. POS & Billing
- `ERR_INVOICE_ALREADY_PAID`: Duplicate payment attempt on an already settled invoice.
- `ERR_INVALID_SPLIT_PAYMENT`: The sum of split payment tenders does not equal the invoice grand total.

### 3. Inventory & Orders
- `ERR_STOCK_INSUFFICIENT`: Available branch stock is lower than requested sale or transfer quantity.
- `ERR_INVALID_PICKUP_OTP`: The 4-digit guest OTP provided at reception does not match the order record.

---

## 3. Support & Emergency Escalation

For high-priority enterprise support, contact:
- **Email**: `support@hivesalon.com`
- **Emergency Hotline**: `+91 (040) 8000-HIVE`
- **In-App Escalation**: Open **Help Center** (`Alt + H`) and click **Report Issue**.
