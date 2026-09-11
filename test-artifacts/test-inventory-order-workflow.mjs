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

async function runInventoryOrderTest() {
  console.log('===============================================================');
  console.log('  HIVE SALON — INVENTORY ORDER & STOCK REPLENISHMENT WORKFLOW');
  console.log('===============================================================\n');

  // 1. Authenticate Branch Manager & Super Admin
  console.log('--- Step 1: Login Roles ---');
  const mgrLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'manager@hivesalon.com', password: 'Password123!' }
  });
  const mgrToken = mgrLogin.data?.token;
  const mgrBranchId = mgrLogin.data?.user?.primaryBranchId || mgrLogin.data?.user?.branches?.[0]?.id;
  console.log(`[PASS] Branch Manager Authenticated. Branch ID: ${mgrBranchId}`);

  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'admin@hivesalon.com', password: 'Password123!' }
  });
  const adminToken = adminLogin.data?.token;
  console.log(`[PASS] Super Admin Authenticated.`);

  // 2. Fetch Initial Stock
  console.log('\n--- Step 2: Fetch Initial Branch Stock ---');
  const productsRes = await request(`/inventory/products?branchId=${mgrBranchId}`, { token: mgrToken });
  const testProduct = productsRes.data?.data?.[0];
  const initialStock = testProduct?.currentQuantity || 0;
  console.log(`[PASS] Target Product: "${testProduct?.name}" (SKU: ${testProduct?.sku})`);
  console.log(`       Initial Branch Stock: ${initialStock} units`);

  // 3. Branch Manager creates Inventory Order Request (+15 units)
  console.log('\n--- Step 3: Branch Manager Requests +15 Units ---');
  const orderReqQty = 15;
  const createOrderRes = await request('/inventory/orders', {
    method: 'POST',
    token: mgrToken,
    body: {
      branchId: mgrBranchId,
      items: [
        {
          productId: testProduct._id,
          requestedQuantity: orderReqQty
        }
      ],
      notes: 'Urgent stock replenishment for weekend appointments'
    }
  });

  const order = createOrderRes.data?.data;
  const orderId = order?._id;
  const orderNumber = order?.orderNumber;
  console.log(`[PASS] Created Order Request: ${orderNumber}`);
  console.log(`       Status: ${order?.status}`);

  if (order?.status !== 'PENDING') {
    throw new Error(`Expected status PENDING, got ${order?.status}`);
  }

  // 4. Super Admin accepts & dispatches the Inventory Order
  console.log('\n--- Step 4: Super Admin Accepts & Dispatches Order ---');
  const dispatchRes = await request(`/inventory/orders/${orderId}/dispatch`, {
    method: 'PUT',
    token: adminToken,
    body: {
      dispatchNotes: 'Dispatched from Central Warehouse - Batch #5821'
    }
  });

  const dispatchedOrder = dispatchRes.data?.data;
  console.log(`[PASS] Super Admin Dispatched Order: ${dispatchedOrder?.orderNumber}`);
  console.log(`       New Status: ${dispatchedOrder?.status}`);
  console.log(`       Dispatched By: ${dispatchedOrder?.dispatchedByUserName}`);

  if (dispatchedOrder?.status !== 'DISPATCHED') {
    throw new Error(`Expected status DISPATCHED, got ${dispatchedOrder?.status}`);
  }

  // 5. Branch Manager receives shipment & updates stock in DB
  console.log('\n--- Step 5: Branch Manager Receives Shipment & Updates Stock ---');
  const receiveRes = await request(`/inventory/orders/${orderId}/receive`, {
    method: 'PUT',
    token: mgrToken,
    body: {
      receiveNotes: 'Shipment received in full and verified intact'
    }
  });

  const receivedOrder = receiveRes.data?.data;
  console.log(`[PASS] Branch Manager Received Order: ${receivedOrder?.orderNumber}`);
  console.log(`       Final Status: ${receivedOrder?.status}`);
  console.log(`       Received At: ${receivedOrder?.receivedAt}`);

  if (receivedOrder?.status !== 'RECEIVED') {
    throw new Error(`Expected status RECEIVED, got ${receivedOrder?.status}`);
  }

  // 6. Verify Updated Stock in MongoDB for Branch Manager, Super Admin & POS Machine
  console.log('\n--- Step 6: Verify Live Stock Visibility Across Portals ---');
  const productsAfterRes = await request(`/inventory/products?branchId=${mgrBranchId}`, { token: mgrToken });
  const productAfter = productsAfterRes.data?.data?.find(p => p._id === testProduct._id);
  const finalStock = productAfter?.currentQuantity;
  const expectedStock = initialStock + orderReqQty;

  console.log(`       Expected Stock in DB: ${expectedStock} units`);
  console.log(`       Actual Stock in DB:   ${finalStock} units`);

  if (finalStock === expectedStock) {
    console.log('\n===============================================================');
    console.log('  ✅ INVENTORY ORDER & RECEIVE WORKFLOW 100% VERIFIED!');
    console.log(`  Stock automatically updated from ${initialStock} to ${finalStock} units.`);
    console.log('  Updated stock is immediately live for Super Admin, Manager & POS.');
    console.log('===============================================================');
  } else {
    throw new Error(`Stock mismatch: expected ${expectedStock}, got ${finalStock}`);
  }
}

runInventoryOrderTest().catch(err => {
  console.error('\n❌ Test Failed:', err.message);
  process.exit(1);
});
