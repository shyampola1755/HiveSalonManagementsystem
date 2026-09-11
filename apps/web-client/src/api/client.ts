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

// In-Memory / LocalStorage Mock DB for Vercel demo environments
const getMockData = () => {
  const branches = [
    { _id: 'hyd-01', id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true },
    { _id: 'mum-01', id: 'mum-01', name: 'Mumbai Salon & Spa (Bandra West)', code: 'MUM-01' },
    { _id: 'blr-01', id: 'blr-01', name: 'Bangalore Lounge (Indiranagar)', code: 'BLR-01' },
  ];

  const serviceCategories = [
    { _id: 'sc-1', name: 'Hair Services', code: 'HAIR' },
    { _id: 'sc-2', name: 'Color & Highlights', code: 'COLOR' },
    { _id: 'sc-3', name: 'Skin & Facial Therapy', code: 'SKIN' },
    { _id: 'sc-4', name: 'Nails & Hands', code: 'NAILS' },
  ];

  const services = [
    { _id: 's-1', categoryId: { _id: 'sc-1', name: 'Hair Services' }, name: 'Precision Director Haircut', durationMinutes: 45, basePrice: 1500, effectivePrice: 1500 },
    { _id: 's-2', categoryId: { _id: 'sc-2', name: 'Color & Highlights' }, name: 'French Balayage & Glossing', durationMinutes: 120, basePrice: 6500, effectivePrice: 6500 },
    { _id: 's-3', categoryId: { _id: 'sc-1', name: 'Hair Services' }, name: 'Kérastase Chronologiste Luxury Ritual', durationMinutes: 60, basePrice: 3500, effectivePrice: 3500 },
    { _id: 's-4', categoryId: { _id: 'sc-3', name: 'Skin & Facial Therapy' }, name: 'HydraFacial MD Platinum Rejuvenation', durationMinutes: 60, basePrice: 5500, effectivePrice: 5500 },
    { _id: 's-5', categoryId: { _id: 'sc-4', name: 'Nails & Hands' }, name: 'Russian Gel Manicure & Nail Art', durationMinutes: 50, basePrice: 2000, effectivePrice: 2000 },
  ];

  const productCategories = [
    { _id: 'pc-1', name: 'Haircare & Masks' },
    { _id: 'pc-2', name: 'Color & Developers' },
    { _id: 'pc-3', name: 'Skincare Serums' },
  ];

  const products = [
    { _id: 'p-1', name: 'Absolut Repair Molecular Leave-in Mask (100ml)', sku: 'LRL-MOL-100', brand: "L'Oréal Professionnel", categoryId: { name: 'Haircare' }, costPrice: 900, retailPrice: 1400, currentQuantity: 24, isRetailItem: true },
    { _id: 'p-2', name: 'Kérastase Elixir Ultime L\'Huile Originale (100ml)', sku: 'KER-ELX-100', brand: 'Kérastase Paris', categoryId: { name: 'Haircare' }, costPrice: 2600, retailPrice: 3800, currentQuantity: 18, isRetailItem: true },
    { _id: 'p-3', name: 'Dia Light Semi-Permanent Gel-Crème 7.11', sku: 'LRL-DIA-711', brand: "L'Oréal Professionnel", categoryId: { name: 'Color' }, costPrice: 420, retailPrice: 650, currentQuantity: 35, isRetailItem: true },
    { _id: 'p-4', name: 'Olaplex No. 7 Bonding Oil (30ml)', sku: 'OLP-BND-030', brand: 'Olaplex', categoryId: { name: 'Haircare' }, costPrice: 1800, retailPrice: 2800, currentQuantity: 14, isRetailItem: true },
    { _id: 'p-5', name: 'SkinCeuticals C E Ferulic Antioxidant Serum (30ml)', sku: 'SKC-CEF-030', brand: 'SkinCeuticals', categoryId: { name: 'Skincare' }, costPrice: 7500, retailPrice: 11000, currentQuantity: 8, isRetailItem: true },
  ];

  const staff = [
    { _id: 'st-1', displayName: 'Vikram Mehta', employeeCode: 'EMP-HYD-001', jobTitle: 'Senior Creative Hair Stylist', commissionRate: 20, monthlyRevenueTarget: 150000 },
    { _id: 'st-2', displayName: 'Sara Khan', employeeCode: 'EMP-HYD-002', jobTitle: 'Master Aesthetician & Skin Therapist', commissionRate: 18, monthlyRevenueTarget: 120000 },
    { _id: 'st-3', displayName: 'Rahul Verma', employeeCode: 'EMP-HYD-003', jobTitle: 'Creative Color Director', commissionRate: 22, monthlyRevenueTarget: 180000 },
  ];

  const customers = [
    { _id: 'c-1', fullName: 'Aarav Singhania', phone: '+91 98765 43210', email: 'aarav.s@example.com', totalVisits: 8, totalSpent: 42500, loyaltyPoints: 425, membershipTier: 'GOLD', hairProfile: { texture: 'Fine Wavy', density: 'High', scalpCondition: 'Normal' }, skinProfile: { type: 'Combination' } },
    { _id: 'c-2', fullName: 'Deepika Padukone', phone: '+91 98222 11334', email: 'deepika.p@example.com', totalVisits: 14, totalSpent: 98000, loyaltyPoints: 980, membershipTier: 'PLATINUM', hairProfile: { texture: 'Thick Straight', density: 'High', scalpCondition: 'Normal' } },
    { _id: 'c-3', fullName: 'Rohan Mehra', phone: '+91 91234 56789', email: 'rohan.m@example.com', totalVisits: 3, totalSpent: 7500, loyaltyPoints: 75, membershipTier: 'SILVER' },
  ];

  const appointments = [
    { _id: 'app-1', customerName: 'Aarav Singhania', customerPhone: '+91 98765 43210', serviceName: 'French Balayage & Glossing', staffName: 'Vikram Mehta', startTime: '10:00', endTime: '12:00', status: 'IN_SERVICE', totalPrice: 6500 },
    { _id: 'app-2', customerName: 'Deepika Padukone', customerPhone: '+91 98222 11334', serviceName: 'HydraFacial MD Platinum', staffName: 'Sara Khan', startTime: '12:30', endTime: '13:30', status: 'CHECKED_IN', totalPrice: 5500 },
    { _id: 'app-3', customerName: 'Rohan Mehra', customerPhone: '+91 91234 56789', serviceName: 'Precision Director Haircut', staffName: 'Rahul Verma', startTime: '14:00', endTime: '14:45', status: 'SCHEDULED', totalPrice: 1500 },
  ];

  const orders = [
    { _id: 'ord-1', orderNumber: 'ORD-HYD-01-768139', branchName: 'Hyderabad Flagship (Banjara Hills)', requestedByUserName: 'Priya Sharma (Branch Manager)', status: 'RECEIVED', createdAt: new Date().toISOString(), items: [{ productName: 'Absolut Repair Molecular Leave-in Mask (100ml)', requestedQuantity: 15, receivedQuantity: 15 }] },
    { _id: 'ord-2', orderNumber: 'ORD-MUM-01-923145', branchName: 'Mumbai Salon & Spa (Bandra West)', requestedByUserName: 'Rohan Joshi', status: 'DISPATCHED', createdAt: new Date().toISOString(), items: [{ productName: 'Kérastase Elixir Ultime L\'Huile Originale (100ml)', requestedQuantity: 10, dispatchedQuantity: 10 }] },
  ];

  return { branches, serviceCategories, services, productCategories, products, staff, customers, appointments, orders };
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

// Response interceptor with graceful fallback for Vercel demo environments
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();
    const mock = getMockData();

    console.warn(`[API Fallback] Request to ${url} intercepted for offline/demo environment.`);

    // Auth endpoints
    if (url.includes('/auth/login')) {
      let email = 'admin@hivesalon.com';
      try {
        if (config.data) {
          const parsed = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
          if (parsed.email) email = parsed.email.toLowerCase().trim();
        }
      } catch (e) {}

      const user = DEMO_PROFILES[email] || {
        id: `user_${Date.now()}`,
        _id: `user_${Date.now()}`,
        email,
        fullName: email.split('@')[0].toUpperCase() + ' (Staff)',
        role: 'SUPER_ADMIN',
        primaryBranchId: 'hyd-01',
        branches: mock.branches,
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

    // Mock Route Handling
    if (url.includes('/branches/hierarchy') || url.includes('/branches')) {
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newBranch = { _id: `br_${Date.now()}`, id: `br_${Date.now()}`, ...body };
        return { status: 200, data: { success: true, data: newBranch, message: 'Branch created' } };
      }
      return { status: 200, data: { success: true, data: mock.branches } };
    }

    if (url.includes('/services/categories')) {
      return { status: 200, data: { success: true, data: mock.serviceCategories } };
    }
    if (url.includes('/services')) {
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newService = { _id: `s_${Date.now()}`, ...body };
        return { status: 200, data: { success: true, data: newService, message: 'Service created' } };
      }
      return { status: 200, data: { success: true, data: mock.services } };
    }

    if (url.includes('/inventory/categories')) {
      return { status: 200, data: { success: true, data: mock.productCategories } };
    }
    if (url.includes('/inventory/products')) {
      return { status: 200, data: { success: true, data: mock.products } };
    }
    if (url.includes('/inventory/adjust')) {
      return { status: 200, data: { success: true, message: 'Stock adjusted successfully' } };
    }
    if (url.includes('/inventory/orders')) {
      if (method === 'post') {
        const newOrder = {
          _id: `ord_${Date.now()}`,
          orderNumber: `ORD-HYD-01-${Date.now().toString().slice(-6)}`,
          branchName: 'Hyderabad Flagship (Banjara Hills)',
          requestedByUserName: 'Priya Sharma (Branch Manager)',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          items: config.data ? (typeof config.data === 'string' ? JSON.parse(config.data).items : config.data.items) : [],
        };
        return { status: 200, data: { success: true, data: newOrder, message: 'Order request created' } };
      }
      if (method === 'put') {
        return { status: 200, data: { success: true, message: 'Order status updated successfully' } };
      }
      return { status: 200, data: { success: true, data: mock.orders } };
    }

    if (url.includes('/customers')) {
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newCust = { _id: `c_${Date.now()}`, ...body, totalVisits: 1, totalSpent: 0, loyaltyPoints: 0 };
        return { status: 200, data: { success: true, data: newCust, message: 'Customer created' } };
      }
      return { status: 200, data: { success: true, data: mock.customers } };
    }

    if (url.includes('/appointments/queue')) {
      return { status: 200, data: { success: true, data: mock.appointments } };
    }
    if (url.includes('/appointments')) {
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newAppt = { _id: `app_${Date.now()}`, ...body, status: 'SCHEDULED' };
        return { status: 200, data: { success: true, data: newAppt, message: 'Appointment booked' } };
      }
      if (method === 'put') {
        return { status: 200, data: { success: true, message: 'Appointment updated' } };
      }
      return { status: 200, data: { success: true, data: mock.appointments } };
    }

    if (url.includes('/staff/attendance')) {
      const attendance = mock.staff.map(s => ({ staffId: s._id, displayName: s.displayName, status: 'PRESENT', clockIn: '09:00 AM' }));
      return { status: 200, data: { success: true, data: attendance } };
    }
    if (url.includes('/staff')) {
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        const newStaff = { _id: `st_${Date.now()}`, ...body };
        return { status: 200, data: { success: true, data: newStaff, message: 'Staff member added' } };
      }
      return { status: 200, data: { success: true, data: mock.staff } };
    }

    if (url.includes('/finance/expenses')) {
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        return { status: 200, data: { success: true, data: { _id: `exp_${Date.now()}`, ...body }, message: 'Expense logged' } };
      }
      return { status: 200, data: { success: true, data: [{ _id: 'exp-1', category: 'Products & Supplies', amount: 4200, date: new Date().toISOString(), status: 'APPROVED' }] } };
    }
    if (url.includes('/finance/campaigns')) {
      if (method === 'post') {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
        return { status: 200, data: { success: true, data: { _id: `cmp_${Date.now()}`, ...body }, message: 'Campaign created' } };
      }
      return { status: 200, data: { success: true, data: [{ _id: 'cmp-1', name: 'Summer Glow Fest', channel: 'SMS & WhatsApp', reach: 1200, conversions: 84, revenue: 142000, status: 'ACTIVE' }] } };
    }

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

    if (url.includes('/reports/dashboard')) {
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
              totalCustomers: 248,
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

    if (url.includes('/pos/checkout') || url.includes('/pos/invoices') || url.includes('/invoices')) {
      const invNum = `INV-HYD-01-${Date.now().toString().slice(-6)}`;
      return {
        status: 200,
        data: {
          success: true,
          data: {
            _id: `inv_${Date.now()}`,
            invoiceNumber: invNum,
            customerName: 'Aarav Singhania',
            totalAmount: 3761,
            paymentStatus: 'PAID',
            createdAt: new Date().toISOString(),
          },
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

