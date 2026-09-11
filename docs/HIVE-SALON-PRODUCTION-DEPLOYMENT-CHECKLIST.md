# HIVE SALON — PRODUCTION DEPLOYMENT & ONBOARDING CHECKLIST

This checklist provides standard operating procedures (SOP) for infrastructure DevOps engineers and client onboarding specialists deploying Hive Salon into commercial production environments.

---

## 1. INFRASTRUCTURE & HOSTING DEPLOYMENT

- [ ] **DNS & Domain**: Configure custom domain with DNS A-records pointing to static edge CDN (e.g. `app.hivesalon.com`) and API backend (e.g. `api.hivesalon.com`).
- [ ] **SSL / TLS**: Provision automated Let's Encrypt / Cloudflare SSL certificate (HTTPS enforced, HTTP $\to$ HTTPS 301 redirect).
- [ ] **Database (MongoDB Atlas)**:
  - Provision M10+ dedicated cluster with Replica Set (3 data nodes).
  - Whitelist API server static IP addresses.
  - Enable Automated Daily Snapshots with 30-day point-in-time recovery.
  - Configure `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hive_salon_prod?retryWrites=true&w=majority`.
- [ ] **API Backend Hosting**:
  - Deploy Node.js server (Docker container / AWS ECS / Render / Railway) with `NODE_ENV=production`.
  - Set `PORT=5000` (or reverse proxy port 80/443).
- [ ] **Web Client Hosting**:
  - Deploy built static assets (`dist/`) to Vercel / AWS CloudFront / Nginx.
  - Set `VITE_API_URL=https://api.hivesalon.com/api/v1`.

---

## 2. SECURITY CONFIGURATION & SECRETS MANAGEMENT

- [ ] **JWT Secret**: Generate and set a 256-bit cryptographically secure `JWT_SECRET` in production `.env`.
- [ ] **CORS Origins**: Configure `CORS_ORIGIN=https://app.hivesalon.com` (disallowing wildcard `*` origins).
- [ ] **Security Headers**: Verify Helmet security headers (`X-Content-Type-Options`, `Frame-Options`, `HSTS`).
- [ ] **Rate Limiting**: Confirm rate limits on `/api/v1/auth/login` to prevent credential brute-forcing.

---

## 3. THIRD-PARTY COMMERCIAL INTEGRATIONS

- [ ] **Payment Gateway (Razorpay / Stripe)**:
  - Generate production API keys from merchant dashboard.
  - Set `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` in `.env`.
  - Configure webhook endpoint `https://api.hivesalon.com/api/v1/pos/webhooks/payment` with webhook signing secret.
- [ ] **WhatsApp Messaging (Twilio / Gupshup)**:
  - Submit invoice & appointment reminder HSM templates for Meta WhatsApp approval.
  - Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `WHATSAPP_FROM_NUMBER` in `.env`.

---

## 4. CLIENT SALON ONBOARDING CHECKLIST (18-STEP SOP)

1. [ ] **Step 1: Organization Creation**: Register legal business name, GSTIN, and currency (`INR`).
2. [ ] **Step 2: Branch Creation**: Create flagship and branch location profiles with address, contact, and tax configurations.
3. [ ] **Step 3: Service Catalog**: Import master service menu with categories (Hair, Skin, Spa, Nails), durations, and base prices.
4. [ ] **Step 4: Retail Products**: Import retail inventory catalog with barcodes, SKU numbers, cost prices, and retail prices.
5. [ ] **Step 5: Staff Onboarding**: Add stylist, beautician, and front desk personnel profiles.
6. [ ] **Step 6: Commission Setup**: Configure staff commission tiers (e.g. 15% service, 5% retail, 100% tip attribution).
7. [ ] **Step 7: Tax Rules**: Set GST tax rates (standard 18% CGST 9% + SGST 9%).
8. [ ] **Step 8: Payment Tenders**: Enable accepted payment tenders (Cash, UPI QR, Credit/Debit Card, Prepaid Wallet).
9. [ ] **Step 9: Membership Tiers**: Configure membership plans (e.g. Gold Tier with 10% discount).
10. [ ] **Step 10: Package Sessions**: Create service packages (e.g. 5x Hair Spa package).
11. [ ] **Step 11: Operating Hours**: Set branch opening/closing hours and staff shift schedules.
12. [ ] **Step 12: User Provisioning**: Create secure login accounts for Branch Managers, Receptionists, and Stylists.
13. [ ] **Step 13: Front Desk Verification**: Verify Front Desk login, client search, and appointment booking flow.
14. [ ] **Step 14: Back Office Verification**: Verify Back Office revenue dashboard, branch switches, and inventory views.
15. [ ] **Step 15: Test Transaction**: Run a real test POS bill with mixed service and retail items.
16. [ ] **Step 16: Tax Invoice Check**: Verify the generated invoice number format, CGST/SGST breakdown, and print preview.
17. [ ] **Step 17: Stock Verification**: Confirm that retail sale decremented product stock in MongoDB.
18. [ ] **Step 18: Handover & Go-Live**: Hand over logins to salon manager and begin live operations.
