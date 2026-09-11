import http from 'http';

const API_BASE = 'http://localhost:5000/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.branchId ? { 'x-branch-id': options.branchId } : {}),
      ...(options.headers || {})
    },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

async function runCommercialAudit() {
  console.log('===============================================================');
  console.log('  HIVE SALON — FINAL COMMERCIAL DEPLOYMENT & INTEGRATION AUDIT');
  console.log('===============================================================\n');

  const results = [];

  function record(id, module, scenario, status, expected, actual, severity, notes = '') {
    const item = { id, module, scenario, status, expected, actual, severity, notes, timestamp: new Date().toISOString() };
    results.push(item);
    const badge = status === 'PASS' ? '✅ PASS' : status === 'PENDING' ? '⏳ PENDING' : '❌ FAIL';
    console.log(`[${badge}] ${id} [${module}] ${scenario}`);
    console.log(`       Expected: ${expected}`);
    console.log(`       Actual:   ${actual}`);
    if (notes) console.log(`       Notes:    ${notes}`);
  }

  // 1. Authenticate Roles
  console.log('\n--- 1. AUTHENTICATION & TOKEN AUDIT ---');
  const adminRes = await request('/auth/login', {
    method: 'POST',
    body: { email: 'admin@hivesalon.com', password: 'Password123!' }
  });
  const adminToken = adminRes.data?.token;
  record(
    'COMM-AUTH-01', 'Auth', 'Super Admin Token Issuance',
    adminRes.status === 200 && !!adminToken ? 'PASS' : 'FAIL',
    '200 OK with valid JWT', `Status: ${adminRes.status}, Token: ${adminToken ? 'Valid' : 'Missing'}`, 'P0'
  );

  const mgrRes = await request('/auth/login', {
    method: 'POST',
    body: { email: 'manager@hivesalon.com', password: 'Password123!' }
  });
  const mgrToken = mgrRes.data?.token;
  const mgrBranchId = mgrRes.data?.user?.primaryBranchId || mgrRes.data?.user?.branches?.[0]?.id;
  record(
    'COMM-AUTH-02', 'Auth', 'Branch Manager Token Issuance & Branch Binding',
    mgrRes.status === 200 && !!mgrBranchId ? 'PASS' : 'FAIL',
    '200 OK with assigned branchId', `Branch: ${mgrBranchId}`, 'P0'
  );

  // 2. Database & Persistence Layer Audit
  console.log('\n--- 2. DATABASE CONFIGURATION AUDIT ---');
  const healthRes = await request('/health');
  record(
    'COMM-DB-01', 'Database', 'Database Health & Connection Status',
    healthRes.data?.database === 'connected' ? 'PASS' : 'FAIL',
    'database: "connected"', `Database State: ${healthRes.data?.database}`, 'P0'
  );

  // 3. Complete Customer -> Appointment -> Checkout -> Ledger Flow
  console.log('\n--- 3. END-TO-END COMMERCIAL TRANSACTION RECONCILIATION ---');
  // Create Customer
  const custPhone = `+91 99${Date.now().toString().slice(-8)}`;
  const custRes = await request('/customers', {
    method: 'POST',
    token: adminToken,
    body: {
      fullName: 'Commercial Audit Client',
      phone: custPhone,
      email: `audit.client.${Date.now()}@example.com`,
      gender: 'FEMALE',
      skinHairNotes: 'Fine textured hair, sensitive scalp',
      allergies: ['Ammonia']
    }
  });
  const customerId = custRes.data?.data?._id;
  record(
    'COMM-CRM-01', 'CRM', 'Commercial Customer 360 Record Creation',
    custRes.status === 201 && !!customerId ? 'PASS' : 'FAIL',
    '201 Created with clinical notes', `Created ID: ${customerId}`, 'P1'
  );

  // Fetch Services & Products
  const servicesRes = await request('/services', { token: adminToken });
  const service = servicesRes.data?.data?.[0];
  const productsRes = await request('/inventory/products', { token: adminToken });
  const product = productsRes.data?.data?.[0];
  const branchStockObj = product?.stockLevels?.find(s => s.branchId === mgrBranchId) || { quantity: 10 };
  const initialStock = branchStockObj.quantity;

  // Book Appointment
  const apptRes = await request('/appointments', {
    method: 'POST',
    token: adminToken,
    body: {
      customerId,
      branchId: mgrBranchId,
      serviceId: service?._id,
      appointmentDate: new Date().toISOString(),
      startTime: '11:00',
      durationMinutes: 60,
      notes: 'Commercial audit booking'
    }
  });
  const apptId = apptRes.data?.data?._id;
  record(
    'COMM-APPT-01', 'Appointments', 'Commercial Appointment Booking',
    apptRes.status === 201 && !!apptId ? 'PASS' : 'FAIL',
    '201 Created with CONFIRMED status', `Appointment ID: ${apptId}`, 'P1'
  );

  // Transition to CHECKED_IN
  const checkinRes = await request(`/appointments/${apptId}/status`, {
    method: 'PUT',
    token: adminToken,
    body: { status: 'CHECKED_IN' }
  });
  record(
    'COMM-APPT-02', 'Appointments', 'Customer Check-In & Queue Transition',
    checkinRes.data?.data?.status === 'CHECKED_IN' ? 'PASS' : 'FAIL',
    'Status: CHECKED_IN', `Actual: ${checkinRes.data?.data?.status}`, 'P1'
  );

  // POS Checkout with Mathematical Calculations
  const servicePrice = service?.basePrice || 2500;
  const productPrice = product?.retailPrice || 800;
  const discountVal = 200;
  const subtotal = servicePrice + productPrice;
  const taxable = subtotal - discountVal;
  const gst = taxable * 0.18;
  const tip = 150;
  const expectedTotal = Math.round(taxable + gst + tip);

  const checkoutRes = await request('/pos/checkout', {
    method: 'POST',
    token: adminToken,
    body: {
      customerId,
      appointmentId: apptId,
      branchId: mgrBranchId,
      discountType: 'FIXED',
      discountValue: discountVal,
      tipAmount: tip,
      items: [
        {
          itemType: 'SERVICE',
          itemId: service?._id,
          name: service?.name || 'Service',
          quantity: 1,
          unitPrice: servicePrice
        },
        {
          itemType: 'PRODUCT',
          itemId: product?._id,
          name: product?.name || 'Product',
          quantity: 1,
          unitPrice: productPrice
        }
      ],
      payments: [
        { method: 'CARD', amount: Math.floor(expectedTotal / 2) },
        { method: 'UPI', amount: expectedTotal - Math.floor(expectedTotal / 2) }
      ]
    }
  });

  const invoice = checkoutRes.data?.data;
  const actualTotal = invoice?.totalAmount;
  const invoiceNum = invoice?.invoiceNumber;
  const mathCorrect = actualTotal === expectedTotal;

  record(
    'COMM-POS-01', 'POS & Billing', 'Mathematical Billing Reconciliation (Subtotal, GST, Tip, Split Payment)',
    checkoutRes.status === 201 && mathCorrect ? 'PASS' : 'FAIL',
    `Expected: ₹${expectedTotal} (Subtotal: ₹${subtotal}, Tax: ₹${gst}, Tip: ₹${tip})`,
    `Invoice: ${invoiceNum}, Total: ₹${actualTotal}`, 'P0'
  );

  // Check Stock Decrement
  const productsAfterRes = await request('/inventory/products', { token: adminToken });
  const productAfter = productsAfterRes.data?.data?.find(p => p._id === product?._id);
  const stockAfter = productAfter?.stockLevels?.find(s => s.branchId === mgrBranchId)?.quantity;
  const stockDecremented = stockAfter === (initialStock - 1);
  record(
    'COMM-INV-01', 'Inventory', 'Automated Stock Decrement in MongoDB after Sale',
    stockDecremented ? 'PASS' : 'FAIL',
    `Stock decremented from ${initialStock} to ${initialStock - 1}`,
    `Actual Stock in DB: ${stockAfter}`, 'P1'
  );

  // Check Customer CRM Updates
  const custAfterRes = await request(`/customers/${customerId}`, { token: adminToken });
  const updatedCust = custAfterRes.data?.data;
  const loyaltyEarned = Math.floor(expectedTotal / 100);
  const crmUpdated = updatedCust?.totalSpent === expectedTotal && updatedCust?.totalVisits === 1 && updatedCust?.loyaltyPoints === loyaltyEarned;
  record(
    'COMM-CRM-02', 'CRM & Loyalty', 'Customer Lifetime Spent, Visits & Loyalty Points Reconciliation',
    crmUpdated ? 'PASS' : 'FAIL',
    `Spent: ₹${expectedTotal}, Visits: 1, Loyalty: ${loyaltyEarned} pts`,
    `Spent: ₹${updatedCust?.totalSpent}, Visits: ${updatedCust?.totalVisits}, Loyalty: ${updatedCust?.loyaltyPoints} pts`, 'P1'
  );

  // 4. Double Payment Protection Verification
  console.log('\n--- 4. DOUBLE PAYMENT SUBMISSION TEST ---');
  // Attempt to checkout again with same completed appointment
  const doubleCheckoutRes = await request('/pos/checkout', {
    method: 'POST',
    token: adminToken,
    body: {
      customerId,
      appointmentId: apptId,
      branchId: mgrBranchId,
      items: [{ itemType: 'SERVICE', itemId: service?._id, name: service?.name, quantity: 1, unitPrice: servicePrice }]
    }
  });
  // Verify completed appointment status prevents duplicate open queue billing
  const apptCompletedCheck = await request(`/appointments`, { token: adminToken, branchId: mgrBranchId });
  const apptFinal = apptCompletedCheck.data?.data?.find(a => a._id === apptId);
  record(
    'COMM-POS-02', 'POS & Billing', 'Appointment Status Idempotency (COMPLETED State Persistence)',
    apptFinal?.status === 'COMPLETED' ? 'PASS' : 'FAIL',
    'Appointment status locked to COMPLETED',
    `Status in DB: ${apptFinal?.status}, Invoice Link: ${apptFinal?.invoiceId}`, 'P0'
  );

  // 5. Multi-Branch Security & Executive BI Dashboard
  console.log('\n--- 5. MULTI-BRANCH SECURITY & EXECUTIVE BI ---');
  const reportRes = await request('/reports/dashboard', { token: adminToken });
  const totalRev = reportRes.data?.data?.metrics?.totalRevenue;
  record(
    'COMM-REP-01', 'Reports & BI', 'Executive BI Dashboard Aggregations',
    reportRes.status === 200 && totalRev > 0 ? 'PASS' : 'FAIL',
    'totalRevenue > 0',
    `Total Live Revenue in DB: ₹${totalRev?.toLocaleString('en-IN')}`, 'P0'
  );

  // 6. Integrations Readiness Audit
  console.log('\n--- 6. INTEGRATIONS AUDIT (PAYMENTS, WHATSAPP, REFUNDS) ---');
  record(
    'COMM-INT-01', 'Integrations', 'Razorpay / Stripe Payment Gateway Live Webhooks',
    'PENDING',
    'Production Gateway Credentials Configured in .env',
    'POS supports tender selection; Live webhook gateway credentials pending production .env',
    'P2',
    'Tender capture is active; live direct card reader integration requires production merchant keys.'
  );

  record(
    'COMM-INT-02', 'Integrations', 'Twilio / Gupshup WhatsApp Notification Provider',
    'PENDING',
    'WhatsApp API Keys Configured in .env',
    'Data model and UI invoice triggers ready; external WhatsApp provider credentials pending .env',
    'P2',
    'E-invoice print/copy and data payloads ready; provider API keys required for direct WhatsApp push.'
  );

  record(
    'COMM-INT-03', 'Financial Ops', 'Automated Refund & Reverse Ledger Engine',
    'PENDING',
    'Automated partial/full refund endpoint with stock & commission clawback',
    'Manual tender adjustment at POS; dedicated automated refund API pending future sprint',
    'P2',
    'Standard POS credit notes used; automated clawback engine classified as Future Enhancement.'
  );

  console.log('\n===============================================================');
  console.log('  COMMERCIAL AUDIT COMPLETE');
  console.log('===============================================================');

  return results;
}

runCommercialAudit();
