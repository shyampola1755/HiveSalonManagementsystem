import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import {
  Organization,
  State,
  District,
  City,
  Branch,
  User,
  Customer,
  CustomerColorFormula,
  CustomerPatchTest,
  CustomerNote,
  ServiceCategory,
  Service,
  StaffProfile,
  Appointment,
  Invoice,
  ProductCategory,
  Vendor,
  Product,
  MembershipTier,
  Expense,
} from './models';

export const seedData = async () => {
  console.log('[Seed] Starting Hive Salon MongoDB Seeder...');

  // Clean collections
  await Promise.all([
    Organization.deleteMany({}),
    State.deleteMany({}),
    District.deleteMany({}),
    City.deleteMany({}),
    Branch.deleteMany({}),
    User.deleteMany({}),
    Customer.deleteMany({}),
    CustomerColorFormula.deleteMany({}),
    CustomerPatchTest.deleteMany({}),
    CustomerNote.deleteMany({}),
    ServiceCategory.deleteMany({}),
    Service.deleteMany({}),
    StaffProfile.deleteMany({}),
    Appointment.deleteMany({}),
    Invoice.deleteMany({}),
    ProductCategory.deleteMany({}),
    Vendor.deleteMany({}),
    Product.deleteMany({}),
    MembershipTier.deleteMany({}),
    Expense.deleteMany({}),
  ]);
  console.log('[Seed] Cleared existing data.');

  // 1. Create Organization
  const org = await Organization.create({
    name: 'Hive Luxury Salon & Spa',
    legalName: 'Hive Wellness Private Limited',
    code: 'HIVE',
    businessType: 'CHAIN',
    email: 'contact@hivesalon.com',
    phone: '+91 98765 43210',
    website: 'https://hivesalon.com',
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    country: 'India',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    taxSettings: {
      gstEnabled: true,
      defaultGSTRate: 18,
      gstinNumber: '36AABCH1234F1Z5',
      taxInclusivePrices: true,
    },
    status: 'ACTIVE',
    isSetupComplete: true,
  });

  // 2. Create Geographical Hierarchy
  const telangana = await State.create({ organizationId: org._id, name: 'Telangana', code: 'TS' });
  const maharashtra = await State.create({ organizationId: org._id, name: 'Maharashtra', code: 'MH' });
  const karnataka = await State.create({ organizationId: org._id, name: 'Karnataka', code: 'KA' });

  const hydDistrict = await District.create({ organizationId: org._id, stateId: telangana._id, name: 'Hyderabad', code: 'HYD-DIST' });
  const mumbaiDistrict = await District.create({ organizationId: org._id, stateId: maharashtra._id, name: 'Mumbai Suburban', code: 'MUM-DIST' });
  const blrDistrict = await District.create({ organizationId: org._id, stateId: karnataka._id, name: 'Bangalore Urban', code: 'BLR-DIST' });

  const hydCity = await City.create({ organizationId: org._id, stateId: telangana._id, districtId: hydDistrict._id, name: 'Hyderabad', code: 'HYD' });
  const mumbaiCity = await City.create({ organizationId: org._id, stateId: maharashtra._id, districtId: mumbaiDistrict._id, name: 'Mumbai', code: 'MUM' });
  const blrCity = await City.create({ organizationId: org._id, stateId: karnataka._id, districtId: blrDistrict._id, name: 'Bangalore', code: 'BLR' });

  // 3. Create Branches
  const branchHyd = await Branch.create({
    organizationId: org._id,
    stateId: telangana._id,
    districtId: hydDistrict._id,
    cityId: hydCity._id,
    name: 'Hyderabad Flagship (Banjara Hills)',
    code: 'HYD-01',
    address: 'Plot 42, Road No. 12, Banjara Hills, Hyderabad, 500034',
    phone: '+91 91234 56780',
    email: 'banjara@hivesalon.com',
    isMainBranch: true,
    isActive: true,
    taxConfig: { gstNumber: '36AABCH1234F1Z5', taxRate: 18 },
    invoiceConfig: { prefix: 'INV-HYD', nextNumber: 1001 },
  });

  const branchMum = await Branch.create({
    organizationId: org._id,
    stateId: maharashtra._id,
    districtId: mumbaiDistrict._id,
    cityId: mumbaiCity._id,
    name: 'Mumbai Salon & Spa (Bandra West)',
    code: 'MUM-01',
    address: 'Linking Road, Bandra West, Mumbai, 400050',
    phone: '+91 91234 56781',
    email: 'bandra@hivesalon.com',
    isActive: true,
    taxConfig: { gstNumber: '27AABCH1234F1Z8', taxRate: 18 },
    invoiceConfig: { prefix: 'INV-MUM', nextNumber: 1001 },
  });

  const branchBlr = await Branch.create({
    organizationId: org._id,
    stateId: karnataka._id,
    districtId: blrDistrict._id,
    cityId: blrCity._id,
    name: 'Bangalore Lounge (Indiranagar)',
    code: 'BLR-01',
    address: '100ft Road, Indiranagar, Bangalore, 560038',
    phone: '+91 91234 56782',
    email: 'indiranagar@hivesalon.com',
    isActive: true,
    taxConfig: { gstNumber: '29AABCH1234F1Z2', taxRate: 18 },
    invoiceConfig: { prefix: 'INV-BLR', nextNumber: 1001 },
  });

  // 4. Create Users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const adminUser = await User.create({
    organizationId: org._id,
    email: 'admin@hivesalon.com',
    phone: '+91 90000 00001',
    fullName: 'Shyam Pola (Super Admin)',
    passwordHash,
    role: 'SUPER_ADMIN',
    primaryBranchId: branchHyd._id,
    branches: [branchHyd._id, branchMum._id, branchBlr._id],
  });

  const managerUser = await User.create({
    organizationId: org._id,
    email: 'manager@hivesalon.com',
    phone: '+91 90000 00002',
    fullName: 'Priya Sharma (Branch Manager)',
    passwordHash,
    role: 'BRANCH_MANAGER',
    primaryBranchId: branchHyd._id,
    branches: [branchHyd._id],
  });

  const frontDeskUser = await User.create({
    organizationId: org._id,
    email: 'frontdesk@hivesalon.com',
    phone: '+91 90000 00003',
    fullName: 'Ananya Reddy (Front Desk Coordinator)',
    passwordHash,
    role: 'FRONT_DESK',
    primaryBranchId: branchHyd._id,
    branches: [branchHyd._id],
  });

  // 5. Create Staff Profiles
  const stylist1User = await User.create({
    organizationId: org._id,
    email: 'vikram@hivesalon.com',
    fullName: 'Vikram Mehta',
    passwordHash,
    role: 'STYLIST',
    primaryBranchId: branchHyd._id,
    branches: [branchHyd._id],
  });

  const stylist1 = await StaffProfile.create({
    organizationId: org._id,
    userId: stylist1User._id,
    employeeCode: 'EMP-HYD-001',
    displayName: 'Vikram Mehta',
    jobTitle: 'Senior Creative Hair Stylist',
    staffType: 'STYLIST',
    specialization: ['Balayage', 'Creative Color', 'Precision Cut'],
    skills: ['French Glossing', 'AirTouch Balayage', 'Fade Cut'],
    commissionRate: 20,
    monthlyRevenueTarget: 150000,
    primaryBranchId: branchHyd._id,
    assignedBranchIds: [branchHyd._id],
  });

  const stylist2User = await User.create({
    organizationId: org._id,
    email: 'sara@hivesalon.com',
    fullName: 'Sara Khan',
    passwordHash,
    role: 'STYLIST',
    primaryBranchId: branchHyd._id,
    branches: [branchHyd._id],
  });

  const stylist2 = await StaffProfile.create({
    organizationId: org._id,
    userId: stylist2User._id,
    employeeCode: 'EMP-HYD-002',
    displayName: 'Sara Khan',
    jobTitle: 'Master Aesthetician & Skin Therapist',
    staffType: 'BEAUTICIAN',
    specialization: ['HydraFacial MD', 'Laser Skin Rejuvenation', 'Bridal Makeup'],
    skills: ['Microdermabrasion', 'Chemical Peel', 'LED Therapy'],
    commissionRate: 18,
    monthlyRevenueTarget: 120000,
    primaryBranchId: branchHyd._id,
    assignedBranchIds: [branchHyd._id],
  });

  // 6. Create Service Categories & Services
  const catHair = await ServiceCategory.create({
    organizationId: org._id,
    name: 'Hair Design & Cut',
    slug: 'hair-design',
    icon: 'Scissors',
    color: '#3b82f6',
    sortOrder: 1,
  });

  const catColor = await ServiceCategory.create({
    organizationId: org._id,
    name: 'Color & Highlights',
    slug: 'color-highlights',
    icon: 'Sparkles',
    color: '#ec4899',
    sortOrder: 2,
  });

  const catFacial = await ServiceCategory.create({
    organizationId: org._id,
    name: 'Skin & Facial Therapy',
    slug: 'skin-facial',
    icon: 'Smile',
    color: '#10b981',
    sortOrder: 3,
  });

  const catSpa = await ServiceCategory.create({
    organizationId: org._id,
    name: 'Spa & Wellness',
    slug: 'spa-wellness',
    icon: 'HeartHandshake',
    color: '#8b5cf6',
    sortOrder: 4,
  });

  const svcHaircut = await Service.create({
    organizationId: org._id,
    categoryId: catHair._id,
    name: 'Signature Luxe Haircut & Blowdry',
    customerDescription: 'Customized consultation, scalp massage, precision tailored cut and luxury styling.',
    durationMinutes: 45,
    bufferMinutes: 15,
    basePrice: 1800,
    taxRate: 18,
    status: 'ACTIVE',
    addons: [
      { name: 'Olaplex Express Bond Treatment', durationMinutes: 15, price: 900, isActive: true },
      { name: 'Deep Scalp Clarifying Ritual', durationMinutes: 15, price: 650, isActive: true },
    ],
  });

  const svcBalayage = await Service.create({
    organizationId: org._id,
    categoryId: catColor._id,
    name: 'French Balayage & Glossing',
    customerDescription: 'Hand-painted sun-kissed dimension followed by a multi-tonal acidic shine gloss.',
    durationMinutes: 120,
    bufferMinutes: 20,
    basePrice: 6500,
    taxRate: 18,
    status: 'ACTIVE',
  });

  const svcHdFacial = await Service.create({
    organizationId: org._id,
    categoryId: catFacial._id,
    name: 'Platinum HydraFacial MD & Lymphatic Drainage',
    customerDescription: 'Deep vortex pore extraction, antioxidant infusion, and LED phototherapy glow.',
    durationMinutes: 75,
    bufferMinutes: 15,
    basePrice: 4800,
    taxRate: 18,
    status: 'ACTIVE',
  });

  // 7. Create Customers with CRM 360°
  const customer1 = await Customer.create({
    organizationId: org._id,
    fullName: 'Rhea Kapoor',
    phone: '+91 98765 11223',
    email: 'rhea.kapoor@example.com',
    gender: 'FEMALE',
    customerSource: 'INSTAGRAM',
    tags: ['VIP', 'Color Regular', 'High Spender'],
    walletBalance: 3500,
    loyaltyPoints: 420,
    totalSpent: 38400,
    totalVisits: 8,
    preferredBranchId: branchHyd._id,
    preferredStylistId: stylist1._id,
    hairProfile: {
      texture: 'Fine-Medium',
      porosity: 'High',
      scalpType: 'Normal',
      density: 'Dense',
      curlPattern: '2A Wavy',
      length: 'Past Shoulder',
    },
    skinProfile: {
      skinType: 'Combination Sensitive',
      allergies: ['Ammonia (Strict)'],
      skinConcerns: ['Dehydration'],
    },
    preferences: {
      beverages: 'Iced Matcha Latte / Sparkling Water',
      quietAppointment: false,
    },
  });

  await CustomerColorFormula.create({
    customerId: customer1._id,
    formulaName: 'Warm Honey Balayage Gloss',
    brand: "L'Oréal Professionnel Dia Light",
    formulaMix: '8.34 (30g) + 9.02 (15g) + Clear (10g)',
    developerVolume: '6 Vol (1.8%)',
    developerRatio: '1:1.5',
    processingTimeMinutes: 20,
    stylistNotes: 'Very porous ends. Do not leave longer than 20 mins.',
    technicianUserId: stylist1User._id,
  });

  await CustomerPatchTest.create({
    customerId: customer1._id,
    testType: 'PPD & Ammonia-Free Lightener',
    chemicalOrBrandName: 'Wella Illumina Color',
    result: 'PASSED',
    notes: 'No erythema or itching observed after 48 hours.',
  });

  const customer2 = await Customer.create({
    organizationId: org._id,
    fullName: 'Arjun Singhania',
    phone: '+91 98765 99887',
    email: 'arjun.singh@example.com',
    gender: 'MALE',
    customerSource: 'WALK_IN',
    tags: ['Executive', 'Grooming Regular'],
    walletBalance: 1200,
    loyaltyPoints: 180,
    totalSpent: 16500,
    totalVisits: 5,
    preferredBranchId: branchHyd._id,
  });

  // 8. Create Today's Appointments & Live Queue
  const today = new Date();
  await Appointment.create({
    organizationId: org._id,
    branchId: branchHyd._id,
    customerId: customer1._id,
    customerName: customer1.fullName,
    customerPhone: customer1.phone,
    staffId: stylist1._id,
    staffName: stylist1.displayName,
    serviceId: svcBalayage._id,
    serviceName: svcBalayage.name,
    appointmentDate: today,
    startTime: '11:00',
    endTime: '13:00',
    durationMinutes: 120,
    status: 'IN_SERVICE',
    totalPrice: 6500,
    notes: 'Client requested gentle scalp wash before toner.',
  });

  await Appointment.create({
    organizationId: org._id,
    branchId: branchHyd._id,
    customerId: customer2._id,
    customerName: customer2.fullName,
    customerPhone: customer2.phone,
    staffId: stylist1._id,
    staffName: stylist1.displayName,
    serviceId: svcHaircut._id,
    serviceName: svcHaircut.name,
    appointmentDate: today,
    startTime: '14:30',
    endTime: '15:15',
    durationMinutes: 45,
    status: 'CONFIRMED',
    totalPrice: 1800,
  });

  // 9. Create Product Categories, Products & Stock
  const pCatHairCare = await ProductCategory.create({
    organizationId: org._id,
    name: 'Professional Hair Care',
    description: 'Shampoos, conditioners, bond protectors and serums',
  });

  const vendorLoreal = await Vendor.create({
    organizationId: org._id,
    name: "L'Oréal Professionnel India",
    phone: '+91 22 6700 8000',
    contactPerson: 'Karan Dave',
    email: 'orders@lorealpro.in',
  });

  await Product.create({
    organizationId: org._id,
    categoryId: pCatHairCare._id,
    vendorId: vendorLoreal._id,
    name: 'Absolut Repair Molecular Leave-in Mask (100ml)',
    sku: 'LRL-MOL-100',
    brand: "L'Oréal Professionnel",
    costPrice: 950,
    retailPrice: 1600,
    taxRate: 18,
    isRetailItem: true,
    isProfessionalUse: false,
    minStockThreshold: 4,
    stockLevels: [
      { branchId: branchHyd._id, quantity: 12 },
      { branchId: branchMum._id, quantity: 8 },
      { branchId: branchBlr._id, quantity: 6 },
    ],
  });

  await Product.create({
    organizationId: org._id,
    categoryId: pCatHairCare._id,
    vendorId: vendorLoreal._id,
    name: 'Blond Studio 9 Multi-Techniques Lightening Powder (500g)',
    sku: 'LRL-BS9-500',
    brand: "L'Oréal Professionnel",
    costPrice: 1400,
    retailPrice: 2400,
    taxRate: 18,
    isRetailItem: false,
    isProfessionalUse: true,
    minStockThreshold: 3,
    stockLevels: [
      { branchId: branchHyd._id, quantity: 9 },
      { branchId: branchMum._id, quantity: 5 },
    ],
  });

  // 10. Create Membership Tiers
  await MembershipTier.create({
    organizationId: org._id,
    name: 'Hive VIP Diamond Circle',
    code: 'VIP-DIAMOND',
    price: 15000,
    validityDays: 365,
    discountPercentage: 20,
    freeServicesCount: 4,
    perks: ['20% off all services', 'Priority Stylist Booking', 'Complimentary Scalp Rituals', 'Free Birthday Blowout'],
    colorTheme: '#e11d48',
  });

  await MembershipTier.create({
    organizationId: org._id,
    name: 'Hive Gold Privileges',
    code: 'GOLD-PRIVILEGE',
    price: 8000,
    validityDays: 180,
    discountPercentage: 15,
    freeServicesCount: 2,
    perks: ['15% off all services', 'Complimentary Hair Spa on Renewal'],
    colorTheme: '#f59e0b',
  });

  // 11. Create Sample Completed Invoice
  await Invoice.create({
    organizationId: org._id,
    branchId: branchHyd._id,
    invoiceNumber: 'INV-HYD-1001',
    customerId: customer1._id,
    customerName: customer1.fullName,
    customerPhone: customer1.phone,
    cashierUserId: frontDeskUser._id,
    cashierName: frontDeskUser.fullName,
    items: [
      {
        itemType: 'SERVICE',
        itemId: svcHaircut._id,
        name: svcHaircut.name,
        quantity: 1,
        unitPrice: 1800,
        taxRate: 18,
        taxAmount: 324,
        totalAmount: 1800,
        staffId: stylist1._id,
        staffName: stylist1.displayName,
      },
    ],
    subtotal: 1800,
    discountType: 'FIXED',
    discountValue: 0,
    discountAmount: 0,
    taxAmount: 324,
    cgstAmount: 162,
    sgstAmount: 162,
    tipAmount: 200,
    totalAmount: 2324,
    paidAmount: 2324,
    balanceAmount: 0,
    paymentStatus: 'PAID',
    payments: [{ method: 'UPI', amount: 2324, transactionRef: 'UPI-REF-998811', paidAt: new Date() }],
  });

  // 12. Create Sample Expenses
  await Expense.create({
    organizationId: org._id,
    branchId: branchHyd._id,
    title: 'High-speed Salon Fiber Internet (Banjara)',
    category: 'UTILITIES',
    amount: 2499,
    expenseDate: today,
    paidVia: 'BANK_TRANSFER',
    recordedByUserId: managerUser._id,
  });

  console.log(`
============================================================
  🎉 HIVE SALON MONGODB SEEDING COMPLETED SUCCESSFULLY!
  
  🔑 Login Credentials:
     Super Admin:   admin@hivesalon.com / Password123!
     Branch Mgr:    manager@hivesalon.com / Password123!
     Front Desk:    frontdesk@hivesalon.com / Password123!
     
  🏢 Organization:  Hive Luxury Salon & Spa (Code: HIVE)
  📍 Branches:      Hyderabad, Mumbai, Bangalore
============================================================
  `);
};

export const seedDatabase = async () => {
  await connectDB();
  await seedData();
};

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}
