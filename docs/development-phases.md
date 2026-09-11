# Hive Salon — Development Phases Roadmap

This document outlines the phased engineering roadmap for the full Hive Salon ERP platform.

---

## Phase 0: Product Foundation & Architecture *(Current)*
- [x] Monorepo workspace configuration (`apps/`, `packages/`, Turborepo, npm workspaces)
- [x] Universal TypeScript Domain Models, DTOs & Validation Schemas (`packages/types`, `packages/validation`)
- [x] Prisma Database Schema with Multi-Tenant & Multi-Branch ERD (`packages/database`)
- [x] Complete Enterprise UI Design System with 26+ Accessible Components (`packages/ui`)
- [x] First-Time Onboarding Setup Wizard (7 steps with completion % and resume)
- [x] Reusable Contextual Help System ("What is this?", "How does this work?")
- [x] Global Search Architecture (`Cmd+K` / `Ctrl+K`)
- [x] Standardized Human-Friendly Error Handling & Boundary System
- [x] Audit Logging Framework & Schemas
- [x] Interactive Backoffice Foundation Shell & Component Showcase (`apps/web-admin`)
- [x] API Modular Monolith Skeleton (`apps/api`)
- [x] Complete System & Security Documentation (`docs/`)

---

## Phase 1: Authentication, Multi-Tenant & Branch Management
- Tenant Onboarding & Domain Subdomain Routing
- JWT Authentication & Redis Session Blacklisting
- RBAC Permission Enforcement (`UserBranch` scoping)
- Branch CRUD, Operating Hours, Tax Rules & Workstations
- Staff Profile Management & Role Assignment

---

## Phase 2: Service Catalog, Staff Roster & Commission Engine
- Category & Subcategory Catalog Management
- Tiered Pricing & Branch-Specific Custom Pricing
- Service Duration, Processing Time & Buffer Time Management
- Staff Shift Scheduling, Leave Tracking & Working Hours
- Commission Profiles (Flat rate, Percentage tiers, Product vs Service)

---

## Phase 3: Appointment Booking, Calendar & Resource Scheduling
- Real-time Multi-Staff Calendar (Day, Week, Month, Workstation view)
- Drag-and-Drop Rescheduling & Double-Booking Protection
- Multi-Service & Group Booking Sequences
- SMS / WhatsApp / Email Booking Reminders (BullMQ Queue)
- Customer Self-Service Online Booking Portal

---

## Phase 4: Point of Sale (POS), Billing, Invoicing & Payments
- Ultra-Fast Touchscreen POS Terminal Interface
- Multi-Payment Split Checkout (Cash, Card, UPI, Loyalty Points, Gift Cards)
- Automatic Commission Calculation & Staff Attribution
- Thermal Receipt Printing & Digital WhatsApp/Email Invoices
- Daily Cash Drawer Management & Shift Reconciliation

---

## Phase 5: Inventory, Supply Chain & Consumption Tracking
- Retail Products & In-Salon Consumption Backbar Tracking
- Barcode Scanner Integration & Stock Take Audits
- Automated Low-Stock Alerts & Purchase Order Generation
- Inter-Branch Stock Transfers & Approvals
- Batch Number & Expiry Date Management

---

## Phase 6: Customer CRM, Memberships, Packages & Loyalty
- 360° Customer Profile (Service History, Formula Notes, Patch Test Records)
- Tiered Loyalty Points & Automated Rewards Program
- Prepaid Service Packages & Wallet Top-ups
- Membership Subscriptions with Recurring Benefits
- Automated Retention Campaigns (Win-back, Birthday discounts)

---

## Phase 7: Analytics, Financial Reports & Business Intelligence
- Real-time Multi-Branch Revenue Dashboard
- Staff Productivity & Revenue Contribution Analytics
- Service Popularity & Peak Hours Heatmap
- Client Retention & Churn Rate Metrics
- Automated Daily Executive Summary Email / PDF Generation

---

## Phase 8: Hardware Integrations, Customer Mobile Apps & Extensions
- WhatsApp Business Cloud API Integration
- Card Payment Terminal SDK Integrations (Stripe Terminal, Square, WisePOS)
- iOS & Android Native Customer Mobile App (React Native / Flutter)
- Stylist Mobile Companion App (Daily Roster, Commission Tracker)
- Open API & Webhook Infrastructure for External Integrations
