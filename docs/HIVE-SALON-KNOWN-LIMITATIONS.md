# HIVE SALON — KNOWN LIMITATIONS & ROADMAP

This document outlines the current operational boundaries and scheduled future roadmap enhancements for Hive Salon.

---

## 1. INTEGRATION PREREQUISITES

| Feature Area | Current Status | Deployment Prerequisite / Limitation |
| :--- | :--- | :--- |
| **Payment Gateway** | POS Tender Logging Active | Direct credit card reader hardware webhook capture requires merchant live keys in `.env`. |
| **WhatsApp Notification** | Printable E-Invoice & Copy Payload | Direct automated background push over WhatsApp Business API requires Twilio/Gupshup credentials. |
| **Automated Refund Engine** | Manual POS Credit Adjustment | Automated line-item tax and commission clawback pipeline is scheduled for the next minor release. |
| **Database Engine** | Hybrid (Atlas / In-Memory Fallback) | For production persistence, an external MongoDB URI must be provided in `.env`. |

---

## 2. CLIENT ENVIRONMENT BOUNDARIES

- **Offline-First Mode**: While the frontend handles network latency and retries gracefully, transaction finalization requires an active internet connection to communicate with the REST API.
- **Physical Thermal Printing**: Receipts are rendered in printable HTML format supported by standard browser print dialogs (`Ctrl + P`); raw binary ESC/POS network printer driver integration is scheduled for Q4.
