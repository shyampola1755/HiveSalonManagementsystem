# Hive Salon — UX Guidelines & Design System Specification

## 1. Core UX Philosophy

Hive Salon must be intuitive and frictionless. A first-time receptionist, salon manager, or stylist should be able to navigate the system without formal training.

### The 4 Mandatory UX Questions

Every screen in Hive Salon must clearly answer:

| UX Question | Implementation Rule |
| :--- | :--- |
| **1. Where am I?** | Display top-level Breadcrumbs, clear Page Title, Active Navigation Pill, and active Branch Selector badge. |
| **2. What can I do here?** | Display primary action buttons (top-right), standard search, date range pickers, and explicit filter pills. |
| **3. What should I do next?** | Provide guided empty states, smart default selections, and contextual wizard prompts. |
| **4. What happened after I took an action?** | Provide immediate toast notifications, optimistic UI state transitions, and clear non-technical error dialogues. |

---

## 2. Terminology & Communication Tone

- **Clarity Over Tech Jargon**:
  - ❌ *"Database transaction deadlock"* -> ✅ *"We couldn't save your changes because another team member just updated this booking. Please refresh to see the latest version."*
  - ❌ *"Foreign key constraint failed on BranchId"* -> ✅ *"We couldn't assign this customer because the selected branch is inactive. Please choose an active branch."*
  - ❌ *"Null pointer on customer.profile"* -> ✅ *"Customer details could not be found. They may have been archived."*
- **Tone**: Professional, encouraging, modern, calm, and reassuring.

---

## 3. Design Tokens & Visual Hierarchy

- **Color Palette (Modern Enterprise Luxury)**:
  - **Primary (Amber / Gold / Honey Bronze)**: Reflects the "Hive" brand with warm sophistication (`#D97706`, `#B45309`, `#F59E0B`).
  - **Neutral / Slate**: Clean dark and light mode foundation (`#0F172A`, `#1E293B`, `#334155`, `#64748B`, `#F8FAFC`).
  - **Success / Emerald**: Appointment confirmed, payment successful, stock sufficient (`#10B981`, `#059669`).
  - **Warning / Amber**: Low stock alert, booking buffer overlap (`#F59E0B`).
  - **Destructive / Rose**: Cancellation, no-show, deletion, overdue balance (`#F43F5E`, `#E11D48`).
  - **Info / Sky**: Informational tooltips, membership badges (`#0EA5E9`).
- **Typography**:
  - Primary Font: **Inter**, **Plus Jakarta Sans**, or **Outfit** for clean legibility at small sizes.
  - Tabular Numbers (`tabular-nums`) for currency, clock times, phone numbers, and invoice totals.

---

## 4. Reusable Help & Contextual Guidance System

1. **Contextual Help Icon**: Every Page Header contains a `?` help button that opens a contextual help slide-over.
2. **Help Sections**:
   - **"What is this?"**: 1-2 sentence high-level overview.
   - **"How does this work?"**: Step-by-step bullet points.
   - **"Keyboard Shortcuts"**: Quick keys for rapid power-user efficiency.
3. **Smart Tooltips**: Subtle hover tooltips on complex metrics and icon-only buttons.

---

## 5. Guided Empty States

Tables, cards, and calendar views must never be blank.

An empty state component must include:
1. An illustrative Lucide icon with a soft circular container.
2. A clear title: *"No customers yet"*
3. A friendly contextual description: *"Customers will appear here once you add your first client or complete a booking."*
4. A direct call-to-action button: `[+ Add First Customer]`
5. An optional secondary link: `[Import from CSV / Excel]`

---

## 6. Keyboard Shortcuts Matrix

- `Ctrl + K` or `Cmd + K`: Open Global Command Search
- `Ctrl + /`: Toggle Contextual Help Guide
- `Esc`: Close open modal, drawer, or dropdown
- `Ctrl + N`: Open Quick Action Menu (New Booking, New Customer, New Sale)
