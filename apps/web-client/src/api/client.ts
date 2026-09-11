import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

export const DEMO_PROFILES: Record<string, any> = {
  'admin@hivesalon.com': {
    id: 'user_admin_01',
    _id: 'user_admin_01',
    email: 'admin@hivesalon.com',
    fullName: 'Shyam Pola (Super Admin)',
    role: 'SUPER_ADMIN',
    primaryBranchId: 'hyd-01',
    branches: [
      { id: 'hyd-01', _id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true },
      { id: 'mum-01', _id: 'mum-01', name: 'Mumbai Salon & Spa (Bandra West)', code: 'MUM-01' },
      { id: 'blr-01', _id: 'blr-01', name: 'Bangalore Lounge (Indiranagar)', code: 'BLR-01' },
    ],
    organization: {
      id: 'org_01',
      _id: 'org_01',
      name: 'Hive Luxury Salon & Spa',
      code: 'HIVE',
      currency: 'INR',
    },
  },
  'manager@hivesalon.com': {
    id: 'user_manager_01',
    _id: 'user_manager_01',
    email: 'manager@hivesalon.com',
    fullName: 'Priya Sharma (Branch Manager)',
    role: 'BRANCH_MANAGER',
    primaryBranchId: 'hyd-01',
    branches: [
      { id: 'hyd-01', _id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true },
    ],
    organization: {
      id: 'org_01',
      _id: 'org_01',
      name: 'Hive Luxury Salon & Spa',
      code: 'HIVE',
      currency: 'INR',
    },
  },
  'frontdesk@hivesalon.com': {
    id: 'user_frontdesk_01',
    _id: 'user_frontdesk_01',
    email: 'frontdesk@hivesalon.com',
    fullName: 'Ananya Reddy (Front Desk Coordinator)',
    role: 'FRONT_DESK',
    primaryBranchId: 'hyd-01',
    branches: [
      { id: 'hyd-01', _id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true },
    ],
    organization: {
      id: 'org_01',
      _id: 'org_01',
      name: 'Hive Luxury Salon & Spa',
      code: 'HIVE',
      currency: 'INR',
    },
  },
  'vikram@hivesalon.com': {
    id: 'user_stylist_01',
    _id: 'user_stylist_01',
    email: 'vikram@hivesalon.com',
    fullName: 'Vikram Mehta (Senior Creative Stylist)',
    role: 'STYLIST',
    primaryBranchId: 'hyd-01',
    branches: [
      { id: 'hyd-01', _id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true },
    ],
    organization: {
      id: 'org_01',
      _id: 'org_01',
      name: 'Hive Luxury Salon & Spa',
      code: 'HIVE',
      currency: 'INR',
    },
  },
};

// Initial Seed Data for Mock DB
const INITIAL_CUSTOMERS = [
  {
    _id: 'c-1',
    id: 'c-1',
    fullName: 'Aarav Singhania',
    phone: '+91 98765 43210',
    email: 'aarav.s@example.com',
    gender: 'MALE',
    customerSource: 'INSTAGRAM',
    totalVisits: 8,
    totalSpent: 42500,
    walletBalance: 2500,
    loyaltyPoints: 425,
    membershipTier: 'GOLD',
    tags: ['VIP Client', 'Balayage Regular'],
    hairProfile: { texture: 'Fine Wavy', density: 'High', porosity: 'Medium', scalpCondition: 'Normal' },
    skinProfile: { skinType: 'Combination', allergies: ['None'] },
    colorFormulas: [
      { _id: 'f-1', formulaName: 'French Balayage Tone 9.1', formulaMix: 'Dia Light 9.01 + 9.11 (30g + 15g)', brand: "L'Oréal Professionnel", developerVolume: '6 Vol', processingTimeMinutes: 20 },
    ],
    patchTests: [
      { _id: 'pt-1', testType: 'PPD Hair Color Allergen Test', chemicalOrBrandName: 'Majirel Cool Inforced', result: 'PASSED', date: '2026-08-15' },
    ],
  },
  {
    _id: 'c-2',
    id: 'c-2',
    fullName: 'Deepika Padukone',
    phone: '+91 98222 11334',
    email: 'deepika.p@example.com',
    gender: 'FEMALE',
    customerSource: 'REFERRAL',
    totalVisits: 14,
    totalSpent: 98000,
    walletBalance: 12000,
    loyaltyPoints: 980,
    membershipTier: 'PLATINUM',
    tags: ['Celebrity VIP', 'Kerastase Rituals'],
    hairProfile: { texture: 'Thick Straight', density: 'High', porosity: 'Low', scalpCondition: 'Normal' },
    skinProfile: { skinType: 'Normal Glow', allergies: ['None'] },
    colorFormulas: [
      { _id: 'f-2', formulaName: 'Rich Espresso Gloss', formulaMix: 'Dia Richesse 4.15 + Clear', brand: "L'Oréal Professionnel", developerVolume: '9 Vol', processingTimeMinutes: 25 },
    ],
    patchTests: [
      { _id: 'pt-2', testType: 'Organic Keratin Patch Test', chemicalOrBrandName: 'Brazilian Blowout', result: 'PASSED', date: '2026-07-10' },
    ],
  },
  {
    _id: 'c-3',
    id: 'c-3',
    fullName: 'Rohan Mehra',
    phone: '+91 91234 56789',
    email: 'rohan.m@example.com',
    gender: 'MALE',
    customerSource: 'WALK_IN',
    totalVisits: 3,
    totalSpent: 7500,
    walletBalance: 500,
    loyaltyPoints: 75,
    membershipTier: 'SILVER',
    tags: ['Men Grooming'],
    hairProfile: { texture: 'Medium Straight', density: 'Medium', porosity: 'Normal', scalpCondition: 'Dry' },
    skinProfile: { skinType: 'Oily', allergies: ['None'] },
    colorFormulas: [],
    patchTests: [],
  },
];

const INITIAL_BRANCHES = [
  { _id: 'hyd-01', id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true, address: 'Road No. 12, Banjara Hills', phone: '+91 40 6789 0001' },
  { _id: 'mum-01', id: 'mum-01', name: 'Mumbai Salon & Spa (Bandra West)', code: 'MUM-01', isMainBranch: false, address: 'Pali Hill, Bandra West', phone: '+91 22 4567 8901' },
  { _id: 'blr-01', id: 'blr-01', name: 'Bangalore Lounge (Indiranagar)', code: 'BLR-01', isMainBranch: false, address: '100ft Road, Indiranagar', phone: '+91 80 2345 6789' },
];

const INITIAL_CATEGORIES = [
  { _id: 'sc-1', name: 'Hair Services', code: 'HAIR' },
  { _id: 'sc-2', name: 'Color & Highlights', code: 'COLOR' },
  { _id: 'sc-3', name: 'Skin & Facial Therapy', code: 'SKIN' },
  { _id: 'sc-4', name: 'Nails & Hands', code: 'NAILS' },
];

const INITIAL_SERVICES = [
  { _id: 's-1', categoryId: { _id: 'sc-1', name: 'Hair Services' }, name: 'Precision Director Haircut', durationMinutes: 45, basePrice: 1500, effectivePrice: 1500, taxRate: 18 },
  { _id: 's-2', categoryId: { _id: 'sc-2', name: 'Color & Highlights' }, name: 'French Balayage & Glossing', durationMinutes: 120, basePrice: 6500, effectivePrice: 6500, taxRate: 18 },
  { _id: 's-3', categoryId: { _id: 'sc-1', name: 'Hair Services' }, name: 'Kérastase Chronologiste Luxury Ritual', durationMinutes: 60, basePrice: 3500, effectivePrice: 3500, taxRate: 18 },
  { _id: 's-4', categoryId: { _id: 'sc-3', name: 'Skin & Facial Therapy' }, name: 'HydraFacial MD Platinum Rejuvenation', durationMinutes: 60, basePrice: 5500, effectivePrice: 5500, taxRate: 18 },
  { _id: 's-5', categoryId: { _id: 'sc-4', name: 'Nails & Hands' }, name: 'Russian Gel Manicure & Nail Art', durationMinutes: 50, basePrice: 2000, effectivePrice: 2000, taxRate: 18 },
];

const INITIAL_PRODUCT_CATEGORIES = [
  { _id: 'pc-1', name: 'Haircare & Masks' },
  { _id: 'pc-2', name: 'Color & Developers' },
  { _id: 'pc-3', name: 'Skincare Serums' },
];

const INITIAL_PRODUCTS = [
  { _id: 'p-1', name: 'Absolut Repair Molecular Leave-in Mask (100ml)', sku: 'LRL-MOL-100', brand: "L'Oréal Professionnel", categoryId: { name: 'Haircare' }, costPrice: 900, retailPrice: 1400, currentQuantity: 24, isRetailItem: true },
  { _id: 'p-2', name: 'Kérastase Elixir Ultime L\'Huile Originale (100ml)', sku: 'KER-ELX-100', brand: 'Kérastase Paris', categoryId: { name: 'Haircare' }, costPrice: 2600, retailPrice: 3800, currentQuantity: 18, isRetailItem: true },
  { _id: 'p-3', name: 'Dia Light Semi-Permanent Gel-Crème 7.11', sku: 'LRL-DIA-711', brand: "L'Oréal Professionnel", categoryId: { name: 'Color' }, costPrice: 420, retailPrice: 650, currentQuantity: 35, isRetailItem: true },
  { _id: 'p-4', name: 'Olaplex No. 7 Bonding Oil (30ml)', sku: 'OLP-BND-030', brand: 'Olaplex', categoryId: { name: 'Haircare' }, costPrice: 1800, retailPrice: 2800, currentQuantity: 14, isRetailItem: true },
  { _id: 'p-5', name: 'SkinCeuticals C E Ferulic Antioxidant Serum (30ml)', sku: 'SKC-CEF-030', brand: 'SkinCeuticals', categoryId: { name: 'Skincare' }, costPrice: 7500, retailPrice: 11000, currentQuantity: 8, isRetailItem: true },
];

const INITIAL_STAFF = [
  { _id: 'st-1', displayName: 'Vikram Mehta', employeeCode: 'EMP-HYD-001', jobTitle: 'Senior Creative Hair Stylist', commissionRate: 20, monthlyRevenueTarget: 150000 },
  { _id: 'st-2', displayName: 'Sara Khan', employeeCode: 'EMP-HYD-002', jobTitle: 'Master Aesthetician & Skin Therapist', commissionRate: 18, monthlyRevenueTarget: 120000 },
  { _id: 'st-3', displayName: 'Rahul Verma', employeeCode: 'EMP-HYD-003', jobTitle: 'Creative Color Director', commissionRate: 22, monthlyRevenueTarget: 180000 },
];

const INITIAL_APPOINTMENTS = [
  { _id: 'app-1', customerName: 'Aarav Singhania', customerPhone: '+91 98765 43210', serviceName: 'French Balayage & Glossing', staffName: 'Vikram Mehta', startTime: '10:00', endTime: '12:00', status: 'IN_SERVICE', totalPrice: 6500 },
  { _id: 'app-2', customerName: 'Deepika Padukone', customerPhone: '+91 98222 11334', serviceName: 'HydraFacial MD Platinum', staffName: 'Sara Khan', startTime: '12:30', endTime: '13:30', status: 'CHECKED_IN', totalPrice: 5500 },
  { _id: 'app-3', customerName: 'Rohan Mehra', customerPhone: '+91 91234 56789', serviceName: 'Precision Director Haircut', staffName: 'Rahul Verma', startTime: '14:00', endTime: '14:45', status: 'SCHEDULED', totalPrice: 1500 },
];

const INITIAL_ORDERS = [
  { _id: 'ord-1', orderNumber: 'ORD-HYD-01-768139', branchName: 'Hyderabad Flagship (Banjara Hills)', requestedByUserName: 'Priya Sharma (Branch Manager)', status: 'RECEIVED', createdAt: new Date().toISOString(), items: [{ productName: 'Absolut Repair Molecular Leave-in Mask (100ml)', requestedQuantity: 15, receivedQuantity: 15 }] },
  { _id: 'ord-2', orderNumber: 'ORD-MUM-01-923145', branchName: 'Mumbai Salon & Spa (Bandra West)', requestedByUserName: 'Rohan Joshi', status: 'DISPATCHED', createdAt: new Date().toISOString(), items: [{ productName: 'Kérastase Elixir Ultime L\'Huile Originale (100ml)', requestedQuantity: 10, dispatchedQuantity: 10 }] },
];

// Helper to access and persist stateful mock collections
const getStorageList = (key: string, defaultData: any[]): any[] => {
  try {
    const saved = localStorage.getItem(`hive_db_${key}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  try {
    localStorage.setItem(`hive_db_${key}`, JSON.stringify(defaultData));
  } catch (e) {}
  return defaultData;
};

const saveStorageList = (key: string, data: any[]): void => {
  try {
    localStorage.setItem(`hive_db_${key}`, JSON.stringify(data));
  } catch (e) {}
};

// Request interceptor to attach JWT token and active branch header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hive_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const activeBranchId = localStorage.getItem('hive_active_branch');
  if (activeBranchId) {
    config.headers['x-branch-id'] = activeBranchId;
  }

  return config;
});

// Response interceptor with graceful fallback & full reactive mock DB for Vercel demo environments
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    console.warn(`[API Fallback] Request to ${url} handled by reactive local mock DB.`);

    // 1. Auth Endpoints
    if (url.includes('/auth/login')) {
      let email = 'admin@hivesalon.com';
      try {
        if (config.data) {
          const parsed = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
          if (parsed.email) email = parsed.email.toLowerCase().trim();
        }
      } catch (e) {}

      const branches = getStorageList('branches', INITIAL_BRANCHES);
      const user = DEMO_PROFILES[email] || {
        id: `user_${Date.now()}`,
        _id: `user_${Date.now()}`,
        email,
        fullName: email.split('@')[0].toUpperCase() + ' (Staff)',
        role: 'SUPER_ADMIN',
        primaryBranchId: 'hyd-01',
        branches,
        organization: { id: 'org_01', name: 'Hive Luxury Salon & Spa', code: 'HIVE', currency: 'INR' },
      };

      const token = `demo_session_${user.role.toLowerCase()}_${Date.now()}`;
      return {
        status: 200,
        data: {
          success: true,
          token,
          user,
          message: 'Login successful (Demo Mode)',
        },
      };
    }

    if (url.includes('/auth/me')) {
      const savedUserStr = localStorage.getItem('hive_user');
      const user = savedUserStr ? JSON.parse(savedUserStr) : DEMO_PROFILES['admin@hivesalon.com'];
      return {
        status: 200,
        data: {
          success: true,
          user,
        },
      };
    }

    if (url.includes('/auth/logout')) {
      return {
        status: 200,
        data: {
          success: true,
          message: 'Logged out successfully',
        },
      };
    }

    // 2. Customer CRM Endpoints (Persistent CRUD + Wallet Topup + Search)
    if (url.includes('/customers')) {
      const customerList = getStorageList('customers', INITIAL_CUSTOMERS);

      // POST /customers/:id/wallet
      if (url.includes('/wallet')) {
        const match = url.match(/\/customers\/([^/]+)\/wallet/);
        const targetId = match ? match[1] : '';
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const amount = Number(body.amount) || 0;

        const updated = customerList.map((c: any) => {
          if (c._id === targetId || c.id === targetId) {
            return { ...c, walletBalance: (c.walletBalance || 0) + amount };
          }
          return c;
        });
        saveStorageList('customers', updated);
        return { status: 200, data: { success: true, message: 'Wallet credited successfully' } };
      }

      // POST /customers (Register new customer)
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newCustId = `c_${Date.now()}`;
        const newCust = {
          _id: newCustId,
          id: newCustId,
          fullName: body.fullName || 'New Client',
          phone: body.phone || '',
          email: body.email || '',
          gender: body.gender || 'FEMALE',
          customerSource: body.customerSource || 'WALK_IN',
          address: body.address || '',
          walletBalance: 0,
          loyaltyPoints: 50,
          totalSpent: 0,
          totalVisits: 1,
          membershipTier: 'SILVER',
          tags: ['New Client', body.customerSource || 'Walk-In'],
          hairProfile: { texture: 'Normal', density: 'Medium', porosity: 'Normal', scalpCondition: 'Healthy' },
          skinProfile: { skinType: 'Combination', allergies: [] },
          colorFormulas: [],
          patchTests: [],
          createdAt: new Date().toISOString(),
        };

        const updated = [newCust, ...customerList];
        saveStorageList('customers', updated);
        return { status: 200, data: { success: true, data: newCust, message: 'Customer registered successfully' } };
      }

      // GET /customers/:id (Single Customer 360 View)
      const singleMatch = url.match(/\/customers\/([a-zA-Z0-9_-]+)$/);
      if (singleMatch && !url.includes('?')) {
        const id = singleMatch[1];
        const found = customerList.find((c: any) => c._id === id || c.id === id) || customerList[0];
        return { status: 200, data: { success: true, data: found } };
      }

      // GET /customers?search=...
      const searchParam = new URLSearchParams(url.split('?')[1] || '').get('search') || '';
      let filtered = customerList;
      if (searchParam.trim()) {
        const s = searchParam.toLowerCase().trim();
        filtered = customerList.filter((c: any) =>
          (c.fullName && c.fullName.toLowerCase().includes(s)) ||
          (c.phone && c.phone.toLowerCase().includes(s)) ||
          (c.email && c.email.toLowerCase().includes(s))
        );
      }
      return { status: 200, data: { success: true, data: filtered } };
    }

    // 3. Branches Endpoints
    if (url.includes('/branches/hierarchy') || url.includes('/branches')) {
      const branches = getStorageList('branches', INITIAL_BRANCHES);
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newBranch = { _id: `br_${Date.now()}`, id: `br_${Date.now()}`, ...body };
        const updated = [...branches, newBranch];
        saveStorageList('branches', updated);
        return { status: 200, data: { success: true, data: newBranch, message: 'Branch created' } };
      }
      return { status: 200, data: { success: true, data: branches } };
    }

    // 4. Services Endpoints
    if (url.includes('/services/categories')) {
      return { status: 200, data: { success: true, data: INITIAL_CATEGORIES } };
    }
    if (url.includes('/services')) {
      const services = getStorageList('services', INITIAL_SERVICES);
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newService = { _id: `s_${Date.now()}`, taxRate: 18, ...body };
        const updated = [...services, newService];
        saveStorageList('services', updated);
        return { status: 200, data: { success: true, data: newService, message: 'Service created' } };
      }
      return { status: 200, data: { success: true, data: services } };
    }

    // 5. Inventory & Products Endpoints
    if (url.includes('/inventory/categories')) {
      return { status: 200, data: { success: true, data: INITIAL_PRODUCT_CATEGORIES } };
    }
    if (url.includes('/inventory/products')) {
      const products = getStorageList('products', INITIAL_PRODUCTS);
      return { status: 200, data: { success: true, data: products } };
    }
    if (url.includes('/inventory/adjust')) {
      return { status: 200, data: { success: true, message: 'Stock adjusted successfully' } };
    }

    // 6. Inventory Orders (Multi-branch Request -> Super Admin Dispatch -> Receive flow)
    if (url.includes('/inventory/orders')) {
      const orders = getStorageList('inventory_orders', INITIAL_ORDERS);

      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newOrder = {
          _id: `ord_${Date.now()}`,
          orderNumber: `ORD-HYD-01-${Date.now().toString().slice(-6)}`,
          branchName: 'Hyderabad Flagship (Banjara Hills)',
          requestedByUserName: 'Priya Sharma (Branch Manager)',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          items: body.items || [],
        };
        const updated = [newOrder, ...orders];
        saveStorageList('inventory_orders', updated);
        return { status: 200, data: { success: true, data: newOrder, message: 'Order request created' } };
      }

      if (method === 'put') {
        const updated = orders.map((o: any) => {
          if (url.includes(o._id)) {
            if (url.includes('/dispatch')) return { ...o, status: 'DISPATCHED' };
            if (url.includes('/receive')) return { ...o, status: 'RECEIVED' };
            if (url.includes('/reject')) return { ...o, status: 'REJECTED' };
          }
          return o;
        });
        saveStorageList('inventory_orders', updated);
        return { status: 200, data: { success: true, message: 'Order status updated successfully' } };
      }

      return { status: 200, data: { success: true, data: orders } };
    }

    // 7. Appointments & Floor Queue
    if (url.includes('/appointments/queue') || url.includes('/appointments')) {
      const appts = getStorageList('appointments', INITIAL_APPOINTMENTS);

      // GET /appointments/queue
      if (url.includes('/appointments/queue')) {
        const queue = appts.filter((a: any) =>
          ['CHECKED_IN', 'IN_SERVICE', 'SCHEDULED', 'CONFIRMED'].includes(a.status)
        );
        return { status: 200, data: { success: true, count: queue.length, data: queue } };
      }

      // POST /appointments
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const { customerId, serviceId, staffId, appointmentDate, startTime, durationMinutes = 60, notes, source } = body;

        const d = new Date();
        const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const targetDate = appointmentDate || todayStr;

        // 1. Past date & time validation
        if (targetDate < todayStr) {
          return { status: 400, data: { success: false, message: 'Cannot schedule appointments for past dates.' } };
        }

        const [startH, startM] = (startTime || '00:00').split(':').map(Number);
        const startTotalMinutes = startH * 60 + (startM || 0);
        const duration = Number(durationMinutes) || 60;
        const endTotalMinutes = startTotalMinutes + duration;
        const endH = Math.floor(endTotalMinutes / 60).toString().padStart(2, '0');
        const endM = (endTotalMinutes % 60).toString().padStart(2, '0');
        const endTime = `${endH}:${endM}`;

        if (targetDate === todayStr) {
          const currentMinutes = d.getHours() * 60 + d.getMinutes();
          if (startTotalMinutes <= currentMinutes) {
            return { status: 400, data: { success: false, message: 'Cannot schedule appointments in the past. Please select an upcoming time slot.' } };
          }
        }

        // 2. Single Appointment per Customer (Concurrent Appointment Overlap Check)
        const customerConflict = appts.find((a: any) => {
          if (a.status === 'CANCELLED' || a.status === 'NO_SHOW') return false;
          const aDate = a.appointmentDate ? (typeof a.appointmentDate === 'string' ? a.appointmentDate.split('T')[0] : '') : todayStr;
          if (aDate && aDate !== targetDate) return false;

          const aCustId = a.customerId?._id || a.customerId?.id || a.customerId;
          if (aCustId !== customerId) return false;

          const [aH, aM] = (a.startTime || '00:00').split(':').map(Number);
          const aStart = aH * 60 + (aM || 0);
          let aEnd = aStart + (Number(a.durationMinutes) || 60);
          if (a.endTime) {
            const [aeH, aeM] = a.endTime.split(':').map(Number);
            aEnd = aeH * 60 + (aeM || 0);
          }

          return (startTotalMinutes < aEnd && endTotalMinutes > aStart);
        });

        if (customerConflict) {
          return {
            status: 400,
            data: {
              success: false,
              message: `This customer already has an active appointment scheduled at ${customerConflict.startTime}. Concurrent bookings for the same client are not allowed.`,
            },
          };
        }

        // 3. Stylist Overlap Check
        if (staffId) {
          const staffConflict = appts.find((a: any) => {
            if (a.status === 'CANCELLED' || a.status === 'NO_SHOW') return false;
            const aDate = a.appointmentDate ? (typeof a.appointmentDate === 'string' ? a.appointmentDate.split('T')[0] : '') : todayStr;
            if (aDate && aDate !== targetDate) return false;

            const aStaffId = a.staffId?._id || a.staffId?.id || a.staffId;
            if (aStaffId !== staffId) return false;

            const [aH, aM] = (a.startTime || '00:00').split(':').map(Number);
            const aStart = aH * 60 + (aM || 0);
            let aEnd = aStart + (Number(a.durationMinutes) || 60);
            if (a.endTime) {
              const [aeH, aeM] = a.endTime.split(':').map(Number);
              aEnd = aeH * 60 + (aeM || 0);
            }

            return (startTotalMinutes < aEnd && endTotalMinutes > aStart);
          });

          if (staffConflict) {
            return {
              status: 400,
              data: {
                success: false,
                message: `Selected stylist is already booked at ${staffConflict.startTime}. Please select another time or stylist.`,
              },
            };
          }
        }

        // Resolve relations
        const customers = getStorageList('customers', INITIAL_CUSTOMERS);
        const services = getStorageList('services', INITIAL_SERVICES);
        const staff = getStorageList('staff', INITIAL_STAFF);

        const foundCust = customers.find((c: any) => c._id === customerId || c.id === customerId);
        const foundSvc = services.find((s: any) => s._id === serviceId || s.id === serviceId);
        const foundStaff = staff.find((s: any) => s._id === staffId || s.id === staffId);

        const newAppt = {
          _id: `app_${Date.now()}`,
          id: `app_${Date.now()}`,
          customerId: foundCust ? { _id: foundCust._id, fullName: foundCust.fullName, phone: foundCust.phone } : customerId,
          customerName: foundCust?.fullName || 'Walk-in Client',
          customerPhone: foundCust?.phone || '',
          serviceId: foundSvc ? { _id: foundSvc._id, name: foundSvc.name, basePrice: foundSvc.basePrice } : serviceId,
          serviceName: foundSvc?.name || 'Hair & Beauty Service',
          staffId: foundStaff ? { _id: foundStaff._id, displayName: foundStaff.displayName, jobTitle: foundStaff.jobTitle } : staffId,
          staffName: foundStaff?.displayName || 'Stylist',
          appointmentDate: targetDate,
          startTime,
          endTime,
          durationMinutes: duration,
          totalPrice: foundSvc?.basePrice || 1500,
          status: 'SCHEDULED',
          source: source || 'CALENDAR',
          notes: notes || '',
          createdAt: new Date().toISOString(),
        };

        const updated = [newAppt, ...appts];
        saveStorageList('appointments', updated);
        return { status: 200, data: { success: true, data: newAppt, message: 'Appointment booked successfully' } };
      }

      // PUT /appointments/:id
      if (method === 'put') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const updated = appts.map((a: any) => (url.includes(a._id) || (a.id && url.includes(a.id)) ? { ...a, ...body } : a));
        saveStorageList('appointments', updated);
        return { status: 200, data: { success: true, message: 'Appointment updated successfully' } };
      }

      // GET /appointments?date=...
      const dateParam = new URLSearchParams(url.split('?')[1] || '').get('date') || '';
      let filtered = appts;
      if (dateParam) {
        filtered = appts.filter((a: any) => {
          if (!a.appointmentDate) return true;
          return a.appointmentDate === dateParam || a.appointmentDate.startsWith(dateParam);
        });
      }
      return { status: 200, data: { success: true, data: filtered } };
    }

    // 8. Staff & Team
    if (url.includes('/staff/attendance')) {
      const staffList = getStorageList('staff', INITIAL_STAFF);
      const attendance = staffList.map((s: any) => ({ staffId: s._id, displayName: s.displayName, status: 'PRESENT', clockIn: '09:00 AM' }));
      return { status: 200, data: { success: true, data: attendance } };
    }
    if (url.includes('/staff')) {
      const staffList = getStorageList('staff', INITIAL_STAFF);
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newStaff = { _id: `st_${Date.now()}`, ...body };
        const updated = [...staffList, newStaff];
        saveStorageList('staff', updated);
        return { status: 200, data: { success: true, data: newStaff, message: 'Staff member added' } };
      }
      return { status: 200, data: { success: true, data: staffList } };
    }

    // 9. Finance & Expenses
    if (url.includes('/finance/expenses')) {
      const expenses = getStorageList('expenses', [{ _id: 'exp-1', category: 'Products & Supplies', amount: 4200, date: new Date().toISOString(), status: 'APPROVED' }]);
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newExp = { _id: `exp_${Date.now()}`, date: new Date().toISOString(), status: 'APPROVED', ...body };
        const updated = [newExp, ...expenses];
        saveStorageList('expenses', updated);
        return { status: 200, data: { success: true, data: newExp, message: 'Expense logged' } };
      }
      return { status: 200, data: { success: true, data: expenses } };
    }

    if (url.includes('/finance/campaigns')) {
      return { status: 200, data: { success: true, data: [{ _id: 'cmp-1', name: 'Summer Glow Fest', channel: 'SMS & WhatsApp', reach: 1200, conversions: 84, revenue: 142000, status: 'ACTIVE' }] } };
    }

    // 10. Memberships & Loyalty
    if (url.includes('/memberships')) {
      return {
        status: 200,
        data: {
          success: true,
          data: [
            { _id: 'mem-1', name: 'Hive VIP Gold', price: 9999, validityDays: 365, discountPercent: 15, complimentaryCredits: 2000 },
            { _id: 'mem-2', name: 'Hive Elite Platinum', price: 19999, validityDays: 365, discountPercent: 25, complimentaryCredits: 5000 },
          ],
        },
      };
    }

    // 11. Reports & Dashboard
    if (url.includes('/reports/dashboard')) {
      const custCount = getStorageList('customers', INITIAL_CUSTOMERS).length;
      return {
        status: 200,
        data: {
          success: true,
          data: {
            metrics: {
              todayRevenue: 28500,
              totalRevenue: 148500,
              todayExpenseTotal: 4200,
              netToday: 24300,
              todayAppointmentsCount: 14,
              totalCustomers: custCount,
              activeBranches: 3,
              totalStaff: 12,
              inventoryCount: 48,
            },
            appointmentBreakdown: { total: 14, scheduled: 5, checkedIn: 3, inService: 4, completed: 2 },
            revenueTrend: [
              { date: 'Mon', revenue: 18200 },
              { date: 'Tue', revenue: 22400 },
              { date: 'Wed', revenue: 19800 },
              { date: 'Thu', revenue: 26500 },
              { date: 'Fri', revenue: 31200 },
              { date: 'Sat', revenue: 42000 },
              { date: 'Sun', revenue: 38500 },
            ],
          },
        },
      };
    }

    // 12. POS Checkout & Invoices
    if (url.includes('/pos/checkout') || url.includes('/pos/invoices') || url.includes('/invoices')) {
      const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
      const invNum = `INV-HYD-01-${Date.now().toString().slice(-6)}`;
      const newInvoice = {
        _id: `inv_${Date.now()}`,
        invoiceNumber: invNum,
        customerName: body.customerName || 'Aarav Singhania',
        totalAmount: body.payments?.[0]?.amount || 3761,
        paymentStatus: 'PAID',
        payments: body.payments || [{ method: 'UPI', amount: 3761 }],
        createdAt: new Date().toISOString(),
      };

      const invoices = getStorageList('invoices', []);
      saveStorageList('invoices', [newInvoice, ...invoices]);

      return {
        status: 200,
        data: {
          success: true,
          data: newInvoice,
          message: 'Invoice created successfully',
        },
      };
    }

    return {
      status: 200,
      data: {
        success: true,
        data: [],
        message: 'Fallback response',
      },
    };
  }
);

