'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Star,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Wallet,
  Gift,
  FileText,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Phone,
  Tag,
  Scissors,
  Check,
  Sliders,
  Percent,
  Search,
  LogIn,
  LogOut,
  Smartphone,
  ExternalLink,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkle,
  BadgeCheck,
  ArrowLeft,
  CalendarCheck,
  QrCode,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Package,
  Plus,
  Minus,
  Trash2,
  History,
  Eye,
  Layers,
  Award,
} from 'lucide-react';
import type {
  PortalGuestProfile,
  PortalBranchInfo,
  PortalServiceItem,
  PortalAddOn,
  PortalStylistProfile,
  PortalTimeSlot,
  PortalBookingDraft,
  PortalBookingConfirmation,
  PortalAppointmentSummary,
  PortalWalletSummary,
  PortalMembershipSummary,
  PortalPackageSummary,
  PortalLoyaltySummary,
  PortalInvoiceReceipt,
  RetailProduct,
  RetailCategory,
  CartItem,
  RetailOrder,
  OrderStatus,
  FulfillmentType,
  DeliveryProviderId,
  RetailPaymentMethod,
  OmnichannelCustomerTimelineEvent,
  ShippingAddress,
} from '@hive/types';

// ==========================================
// MOCK DATA: LUXURY SALON EXPERIENCES & GUEST
// ==========================================

const MOCK_GUEST: PortalGuestProfile = {
  id: 'c1',
  name: 'Priya Sharma',
  mobile: '9876543210',
  email: 'priya.sharma@example.com',
  gender: 'FEMALE',
  homeBranchId: 'branch-indiranagar',
  homeBranchName: 'Hive Indiranagar Flagship Sanctuary',
  loyaltyTier: 'GOLD',
  loyaltyPoints: 1280,
  walletBalance: 4850,
  activeMembershipName: 'Diamond Elite VIP Pass',
  activeMembershipExpiry: '2027-03-31',
  totalVisits: 14,
};

const MOCK_BRANCHES: PortalBranchInfo[] = [
  {
    id: 'branch-indiranagar',
    name: 'Hive Indiranagar Flagship',
    code: 'BLR-IND-01',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '100ft Road, 12th Main, HAL 2nd Stage, Indiranagar',
    phone: '+91 80 4123 8899',
    openingHours: '09:00 AM – 09:30 PM (Daily)',
    rating: 4.9,
    reviewCount: 428,
    distanceKm: 1.8,
    amenities: ['Valet Parking', 'Private Spa Suite', 'Beverage Bar', 'Wi-Fi 6', 'Curbside Pickup'],
  },
  {
    id: 'branch-koramangala',
    name: 'Hive Koramangala Lounge',
    code: 'BLR-KOR-02',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '80ft Road, 4th Block, Koramangala',
    phone: '+91 80 4987 1122',
    openingHours: '09:30 AM – 09:00 PM (Daily)',
    rating: 4.85,
    reviewCount: 310,
    distanceKm: 4.2,
    amenities: ['Coffee Bar', 'Express Nail Bar', 'Lounge Seating', 'Curbside Pickup'],
  },
  {
    id: 'branch-jubilee',
    name: 'Hive Jubilee Hills Sanctuary',
    code: 'HYD-JUB-01',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Plot 42, Road No. 36, Jubilee Hills',
    phone: '+91 40 2355 8899',
    openingHours: '09:00 AM – 09:30 PM (Daily)',
    rating: 4.96,
    reviewCount: 520,
    distanceKm: 5.5,
    amenities: ['Valet Parking', 'Bridal Suite', 'Beverage Bar', 'Curbside Pickup'],
  },
];

const MOCK_SERVICES: PortalServiceItem[] = [
  {
    id: 'srv-balayage-01',
    name: 'Sun-Kissed Balayage Gloss & Moroccan Ritual',
    category: 'HAIR',
    price: 4500,
    originalPrice: 5200,
    durationMinutes: 90,
    description: 'Bespoke hand-painted balayage highlights infused with Bond Multiplier and finished with a Moroccan Argan gloss.',
    isPopular: true,
  },
  {
    id: 'srv-keratin-02',
    name: 'Keratin Smoothing Infusion & Scalp Therapy',
    category: 'HAIR',
    price: 3800,
    originalPrice: 4500,
    durationMinutes: 75,
    description: 'Formaldehyde-free organic keratin infusion for 90-day anti-frizz mirror sleekness.',
    isPopular: true,
  },
  {
    id: 'srv-hydra-03',
    name: 'Hydra-Facial Illuminating Glass Skin Ritual',
    category: 'SKIN',
    price: 3200,
    originalPrice: 3900,
    durationMinutes: 60,
    description: 'Medical-grade vortex pore cleansing, glycolic peel infusion, and deep hyaluronic acid hydration.',
    isPopular: true,
  },
  {
    id: 'srv-cut-04',
    name: 'Couture Haircut & Moroccan Silk Blowdry',
    category: 'HAIR',
    price: 1400,
    originalPrice: 1600,
    durationMinutes: 45,
    description: 'Face-framing haircut customized to your bone structure with restorative head massage and blowdry.',
    isNew: true,
  },
];

const MOCK_STYLISTS: PortalStylistProfile[] = [
  {
    id: 'stylist-ananya',
    name: 'Ananya Reddy',
    role: 'Creative Master Colorist',
    rating: 4.98,
    reviewCount: 312,
    experienceYears: 9,
    specialties: ['Balayage Artistry', 'Blonde Toning', 'Damage Recovery'],
    bio: 'Trained at Vidal Sassoon London. Specialist in multidimensional sun-kissed brunettes and blonde restorations.',
    isMasterStylist: true,
  },
  {
    id: 'stylist-aarav',
    name: 'Aarav Mehta',
    role: 'Senior Keratin & Hair Sculptor',
    rating: 4.92,
    reviewCount: 240,
    experienceYears: 7,
    specialties: ['Keratin Infusions', 'Volume Blowdries', 'Precision Bobs'],
    bio: 'Precision cut and texture transformation expert. Known for effortless, bouncy runway finishes.',
  },
];

// ==========================================
// MOCK DATA: RETAIL STOREFRONT PRODUCTS & CATEGORIES
// ==========================================

const MOCK_RETAIL_CATEGORIES: RetailCategory[] = [
  {
    id: 'cat-all',
    name: 'All Categories',
    slug: 'all',
    description: 'Browse the complete luxury salon inventory',
    productCount: 6,
  },
  {
    id: 'cat-haircare',
    name: 'Hair Care & Bond Repair',
    slug: 'hair-care',
    description: 'Bond-repairing shampoos, conditioners, and restorative masks',
    productCount: 2,
  },
  {
    id: 'cat-styling',
    name: 'Styling & Thermal Protection',
    slug: 'styling-protection',
    description: 'Heat shields, argan serums, and silk finishing oils',
    productCount: 1,
  },
  {
    id: 'cat-scalp',
    name: 'Scalp Therapy & Trichology',
    slug: 'scalp-trichology',
    description: 'Purifying black charcoal scrubs and follicle energizers',
    productCount: 1,
  },
  {
    id: 'cat-skin',
    name: 'Aesthetics & Dermal Care',
    slug: 'skin-aesthetics',
    description: 'Antioxidant Vitamin C serums and deep hyaluronic acid',
    productCount: 1,
  },
  {
    id: 'cat-tools',
    name: 'Luxury Styling Appliances',
    slug: 'luxury-tools',
    description: 'Ionic dryers and heat-controlled precision appliances',
    productCount: 1,
  },
];

const MOCK_RETAIL_PRODUCTS: RetailProduct[] = [
  {
    id: 'prod-olaplex-3',
    organizationId: 'org_hive_demo',
    categoryId: 'cat-haircare',
    categoryName: 'Hair Care & Bond Repair',
    name: 'Olaplex No. 3 Hair Perfector (Bond Multiplier)',
    sku: 'OLP-BOND-003',
    barcode: '896457000147',
    brand: 'Olaplex Professional',
    price: 2950.0,
    mrp: 3400.0,
    discountPercentage: 13,
    taxRate: 18.0,
    shortDescription: 'Global #1 bond-repair treatment that visibly repairs broken disulphide bonds caused by chemical and thermal styling.',
    description: 'Olaplex No. 3 Hair Perfector is a concentrated pre-shampoo treatment that strengthens hair from within, reducing breakage and improving look and feel. Formulated with patented Bis-Aminopropyl Diglycol Dimaleate bond-building chemistry.',
    benefits: [
      'Restores compromised hair disulphide bonds post-bleach and color treatments',
      'Reduces split ends and breakage by up to 68%',
      'Maintains salon color vibrancy and structure for up to 6 weeks',
      'Free of DEA, Aldehydes, Formaldehyde, Parabens, and Sulfates',
    ],
    usageInstructions: [
      {
        stepNumber: 1,
        title: 'Dampen & Towel Dry',
        instruction: 'Apply generously to damp, towel-dried hair from roots to ends.',
        stylistTip: 'Towel-dry hair thoroughly before applying so the product penetrates deeply.',
      },
      {
        stepNumber: 2,
        title: 'Comb & Process',
        instruction: 'Comb through with wide-tooth comb and leave on for 10–20 minutes.',
        stylistTip: 'Wrap in a warm damp towel for an indulgent at-home luxury spa experience.',
      },
      {
        stepNumber: 3,
        title: 'Rinse & Shampoo',
        instruction: 'Rinse thoroughly, followed by Olaplex No. 4 Shampoo and No. 5 Conditioner.',
        stylistTip: 'Always follow with shampoo and conditioner; No. 3 is a bond builder, not a conditioner.',
      },
    ],
    ingredients: ['Water (Aqua)', 'Bis-Aminopropyl Diglycol Dimaleate', 'Propylene Glycol', 'Cetearyl Alcohol', 'Ascorbic Acid (Vitamin C)', 'Aloe Barbadensis Leaf Juice'],
    volumeSize: '100 ml',
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    reviewCount: 384,
    isFeatured: true,
    isBestSeller: true,
    isOrganicOrVegan: true,
    isSulfateFree: true,
    hairOrSkinTarget: ['Color-Treated', 'Bleached / Highlighted', 'Heat-Damaged', 'All Textures'],
    recommendedServicePairing: {
      serviceId: 'srv-balayage-01',
      serviceName: 'Sun-Kissed Balayage Gloss & Moroccan Ritual',
      pairingReason: 'Essential post-color homecare to prevent tone oxidation and maintain gloss shine.',
    },
    totalAvailableStock: 28,
    branchStockMatrix: {
      'branch-indiranagar': {
        branchId: 'branch-indiranagar',
        branchName: 'Hive Indiranagar Flagship',
        branchCode: 'BLR-IND-01',
        currentStock: 16,
        reservedStock: 2,
        availableStock: 14,
        inStock: true,
      },
      'branch-koramangala': {
        branchId: 'branch-koramangala',
        branchName: 'Hive Koramangala Lounge',
        branchCode: 'BLR-KOR-02',
        currentStock: 10,
        reservedStock: 1,
        availableStock: 9,
        inStock: true,
      },
      'branch-jubilee': {
        branchId: 'branch-jubilee',
        branchName: 'Hive Jubilee Hills Sanctuary',
        branchCode: 'HYD-JUB-01',
        currentStock: 6,
        reservedStock: 1,
        availableStock: 5,
        inStock: true,
      },
    },
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },
  {
    id: 'prod-moroccan-oil',
    organizationId: 'org_hive_demo',
    categoryId: 'cat-styling',
    categoryName: 'Styling & Thermal Protection',
    name: 'Moroccanoil Original Treatment Oil',
    sku: 'MRC-OIL-100',
    barcode: '729001152101',
    brand: 'Moroccanoil',
    price: 3600.0,
    mrp: 4100.0,
    discountPercentage: 12,
    taxRate: 18.0,
    shortDescription: 'Infused with antioxidant-rich argan oil and shine-boosting vitamins, this transformative hair treatment detangles, speeds up blow-drying, and boosts shine.',
    description: 'The iconic foundation for hairstyling. Moroccanoil Treatment can be used as a conditioning, styling, and finishing tool. Infused with argan oil and shine-boosting vitamins, this completely transformative hair treatment speeds up drying time, enhances manageability, and creates silky smoothness.',
    benefits: [
      'Instant 118% increase in hair mirror-like reflective shine',
      'Speeds up blow-dry time by up to 40% with anti-frizz barrier',
      'Protects against humidity and static flyaways for up to 72 hours',
      'Signature Mediterranean amber and floral fragrance',
    ],
    usageInstructions: [
      {
        stepNumber: 1,
        title: 'Dispense 1-2 Pumps',
        instruction: 'Dispense 1–2 pumps of Moroccanoil Treatment into clean, towel-dried palms.',
        stylistTip: 'Rub hands together to warm the argan oil for uniform distribution.',
      },
      {
        stepNumber: 2,
        title: 'Apply Mid-Lengths to Ends',
        instruction: 'Work through damp hair from mid-lengths to ends, avoiding direct application onto roots.',
        stylistTip: 'Comb through with fingers or a styling comb.',
      },
      {
        stepNumber: 3,
        title: 'Blow-Dry or Air-Dry',
        instruction: 'Blow-dry or let dry naturally. Can also be applied on dry hair to tame flyaways and condition split ends.',
        stylistTip: 'Add 1 drop to dry styled curls for high-definition shine.',
      },
    ],
    ingredients: ['Cyclomethicone', 'Dimethicone', 'Argania Spinosa (Argan) Kernel Oil', 'Fragrance (Parfum)', 'Linum Usitatissimum (Linseed) Seed Extract'],
    volumeSize: '100 ml',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-006240d96d92?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1608248597359-006240d96d92?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.95,
    reviewCount: 512,
    isFeatured: true,
    isBestSeller: true,
    isOrganicOrVegan: false,
    isSulfateFree: true,
    hairOrSkinTarget: ['Frizzy Hair', 'Dry Ends', 'Medium to Thick Hair', 'All Lengths'],
    recommendedServicePairing: {
      serviceId: 'srv-cut-04',
      serviceName: 'Couture Haircut & Moroccan Silk Blowdry',
      pairingReason: 'The authentic salon finishing product used in our signature Moroccan blowdry service.',
    },
    totalAvailableStock: 18,
    branchStockMatrix: {
      'branch-indiranagar': {
        branchId: 'branch-indiranagar',
        branchName: 'Hive Indiranagar Flagship',
        branchCode: 'BLR-IND-01',
        currentStock: 10,
        reservedStock: 1,
        availableStock: 9,
        inStock: true,
      },
      'branch-koramangala': {
        branchId: 'branch-koramangala',
        branchName: 'Hive Koramangala Lounge',
        branchCode: 'BLR-KOR-02',
        currentStock: 6,
        reservedStock: 1,
        availableStock: 5,
        inStock: true,
      },
      'branch-jubilee': {
        branchId: 'branch-jubilee',
        branchName: 'Hive Jubilee Hills Sanctuary',
        branchCode: 'HYD-JUB-01',
        currentStock: 4,
        reservedStock: 0,
        availableStock: 4,
        inStock: true,
      },
    },
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },
  {
    id: 'prod-kerastase-chronologiste',
    organizationId: 'org_hive_demo',
    categoryId: 'cat-scalp',
    categoryName: 'Scalp Therapy & Trichology',
    name: 'Kérastase Chronologiste Pré-Cleanse Régénérant',
    sku: 'KRS-CHRN-200',
    barcode: '347463672832',
    brand: 'Kérastase Paris',
    price: 3450.0,
    mrp: 3900.0,
    discountPercentage: 11,
    taxRate: 18.0,
    shortDescription: 'Youth-revitalizing pre-shampoo black gel scrub formulated with Charcoal, Hyaluronic Acid, and Abyssine to deeply cleanse scalp & roots.',
    description: 'Kérastase Chronologiste Pré-Cleanse Régénérant is a purifying pre-shampoo scrub that detoxifies the scalp and roots. Infused with natural active black charcoal, hyaluronic acid, and abyssine, it removes up to 96% more pollution particles than a conventional shampoo.',
    benefits: [
      'Deeply purifies and exfoliates congested scalp pores and roots',
      'Enriched with Hyaluronic Acid for 24-hour scalp moisture balance',
      'Abyssine Molecule revitalizes aging scalp fibroblasts',
      'Luxurious fragrance notes of Persian Lime, Green Tea, and Cedarwood',
    ],
    usageInstructions: [
      {
        stepNumber: 1,
        title: 'Apply to Wet Scalp',
        instruction: 'Apply directly onto wet scalp section by section prior to shampooing.',
        stylistTip: 'Part hair into 4 quadrants for uniform scalp access.',
      },
      {
        stepNumber: 2,
        title: 'Massage & Emulsify',
        instruction: 'Gently massage with fingertips for 2–3 minutes to activate microcirculation.',
        stylistTip: 'Emulsify with warm water to transform the black gel into a fine lather.',
      },
    ],
    ingredients: ['Aqua (Water)', 'Charcoal Powder', 'Sodium Hyaluronate', 'Alteromonas Ferment Extract (Abyssine)', 'Citric Acid'],
    volumeSize: '200 ml',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.88,
    reviewCount: 196,
    isFeatured: true,
    isBestSeller: false,
    isOrganicOrVegan: false,
    isSulfateFree: false,
    hairOrSkinTarget: ['Oily / Congested Scalp', 'Product Buildup', 'Tired Roots', 'Aging Scalp'],
    totalAvailableStock: 12,
    branchStockMatrix: {
      'branch-indiranagar': {
        branchId: 'branch-indiranagar',
        branchName: 'Hive Indiranagar Flagship',
        branchCode: 'BLR-IND-01',
        currentStock: 8,
        reservedStock: 1,
        availableStock: 7,
        inStock: true,
      },
      'branch-koramangala': {
        branchId: 'branch-koramangala',
        branchName: 'Hive Koramangala Lounge',
        branchCode: 'BLR-KOR-02',
        currentStock: 4,
        reservedStock: 0,
        availableStock: 4,
        inStock: true,
      },
      'branch-jubilee': {
        branchId: 'branch-jubilee',
        branchName: 'Hive Jubilee Hills Sanctuary',
        branchCode: 'HYD-JUB-01',
        currentStock: 2,
        reservedStock: 1,
        availableStock: 1,
        inStock: true,
      },
    },
    createdAt: '2026-02-01T14:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },
  {
    id: 'prod-loreal-absolut-repair',
    organizationId: 'org_hive_demo',
    categoryId: 'cat-haircare',
    categoryName: 'Hair Care & Bond Repair',
    name: "L'Oréal Professionnel Absolut Repair Gold Quinoa Mask",
    sku: 'LOR-ABS-250',
    barcode: '30164849',
    brand: "L'Oréal Professionnel",
    price: 1950.0,
    mrp: 2300.0,
    discountPercentage: 15,
    taxRate: 18.0,
    shortDescription: 'Golden resurfacing restorative mask enriched with Gold Quinoa Protein for 7x shinier and 77% less damaged hair without weigh-down.',
    description: 'Absolut Repair Mask offers the ultimate professional deep repair experience for damaged and dry hair. The golden buttery formula infused with Gold Quinoa + Wheat Protein instantly resurfaces hair fibers.',
    benefits: [
      'Resurfaces dry & damaged hair cuticle with Gold Quinoa protein',
      'Provides 7x more shine and 77% surface damage reduction',
      'Zero weigh-down on fine to medium hair textures',
      'Lightweight buttery golden texture with salon floral notes',
    ],
    usageInstructions: [
      {
        stepNumber: 1,
        title: 'Apply & Comb',
        instruction: 'After shampooing, apply to towel-dried hair. Comb through evenly.',
        stylistTip: 'Leave on for 3 to 5 minutes before rinsing with cool water.',
      },
    ],
    ingredients: ['Aqua / Water', 'Cetearyl Alcohol', 'Chenopodium Quinoa Seed Extract', 'Hydrolyzed Wheat Protein'],
    volumeSize: '250 ml',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.82,
    reviewCount: 245,
    isFeatured: false,
    isBestSeller: true,
    isOrganicOrVegan: false,
    isSulfateFree: false,
    hairOrSkinTarget: ['Damaged Hair', 'Dry Hair', 'Brittle Ends', 'Color-Treated'],
    totalAvailableStock: 35,
    branchStockMatrix: {
      'branch-indiranagar': {
        branchId: 'branch-indiranagar',
        branchName: 'Hive Indiranagar Flagship',
        branchCode: 'BLR-IND-01',
        currentStock: 20,
        reservedStock: 2,
        availableStock: 18,
        inStock: true,
      },
      'branch-koramangala': {
        branchId: 'branch-koramangala',
        branchName: 'Hive Koramangala Lounge',
        branchCode: 'BLR-KOR-02',
        currentStock: 12,
        reservedStock: 1,
        availableStock: 11,
        inStock: true,
      },
      'branch-jubilee': {
        branchId: 'branch-jubilee',
        branchName: 'Hive Jubilee Hills Sanctuary',
        branchCode: 'HYD-JUB-01',
        currentStock: 7,
        reservedStock: 1,
        availableStock: 6,
        inStock: true,
      },
    },
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },
  {
    id: 'prod-skinceuticals-ce-ferulic',
    organizationId: 'org_hive_demo',
    categoryId: 'cat-skin',
    categoryName: 'Aesthetics & Dermal Care',
    name: 'SkinCeuticals C E Ferulic Vitamin C Serum',
    sku: 'SKN-CEF-030',
    barcode: '883140024706',
    brand: 'SkinCeuticals Dermal Aesthetics',
    price: 14500.0,
    mrp: 16200.0,
    discountPercentage: 10,
    taxRate: 18.0,
    shortDescription: 'Gold-standard antioxidant vitamin C serum delivering 8x environmental protection against free radical aging and firming skin tone.',
    description: 'A patented daytime vitamin C serum that delivers advanced environmental protection and improves the appearance of fine lines, wrinkles, and loss of firmness while brightening skin complexion.',
    benefits: [
      'Provides 8x skin photoprotection against atmospheric pollution and UV damage',
      'Clinically proven to improve firmness by 37% and brightness by 44%',
      'Remains effective on skin for a minimum of 72 hours once absorbed',
      'Paraben-free and ideal for normal, dry, and sensitive skin types',
    ],
    usageInstructions: [
      {
        stepNumber: 1,
        title: 'Morning Routine',
        instruction: 'Apply 4–5 drops to a dry face, neck, and chest in the morning.',
        stylistTip: 'Follow with broad-spectrum SPF 50 sunscreen.',
      },
    ],
    ingredients: ['Aqua / Water', 'L-Ascorbic Acid (15%)', 'Alpha Tocopherol (1%)', 'Ferulic Acid (0.5%)', 'Hyaluronic Acid'],
    volumeSize: '30 ml Glass Pipette',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.98,
    reviewCount: 168,
    isFeatured: true,
    isBestSeller: true,
    isOrganicOrVegan: false,
    isSulfateFree: true,
    hairOrSkinTarget: ['Hyperpigmentation', 'Fine Lines & Wrinkles', 'Loss of Elasticity', 'Dullness'],
    recommendedServicePairing: {
      serviceId: 'srv-hydra-03',
      serviceName: 'Hydra-Facial Illuminating Glass Skin Ritual',
      pairingReason: 'The clinical dermal post-facial antioxidant shield prescribed by our aesthetic doctors.',
    },
    totalAvailableStock: 8,
    branchStockMatrix: {
      'branch-indiranagar': {
        branchId: 'branch-indiranagar',
        branchName: 'Hive Indiranagar Flagship',
        branchCode: 'BLR-IND-01',
        currentStock: 5,
        reservedStock: 1,
        availableStock: 4,
        inStock: true,
      },
      'branch-koramangala': {
        branchId: 'branch-koramangala',
        branchName: 'Hive Koramangala Lounge',
        branchCode: 'BLR-KOR-02',
        currentStock: 3,
        reservedStock: 0,
        availableStock: 3,
        inStock: true,
      },
      'branch-jubilee': {
        branchId: 'branch-jubilee',
        branchName: 'Hive Jubilee Hills Sanctuary',
        branchCode: 'HYD-JUB-01',
        currentStock: 2,
        reservedStock: 1,
        availableStock: 1,
        inStock: true,
      },
    },
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },
  {
    id: 'prod-dyson-supersonic-pro',
    organizationId: 'org_hive_demo',
    categoryId: 'cat-tools',
    categoryName: 'Luxury Styling Appliances',
    name: 'Dyson Supersonic™ Professional Edition Hair Dryer',
    sku: 'DYS-SPRS-PRO',
    barcode: '502515504128',
    brand: 'Dyson Professional',
    price: 36900.0,
    mrp: 39900.0,
    discountPercentage: 8,
    taxRate: 18.0,
    shortDescription: 'Engineered for salon professionals with intelligent heat control, digital V9 motor, and 5 magnetic styling attachments.',
    description: 'The Dyson Supersonic™ Professional hair dryer is engineered for high-demand salon environments. With a powerful Dyson digital motor V9 and intelligent heat control that measures airflow temperature over 40 times per second.',
    benefits: [
      'Intelligent Heat Control prevents extreme heat damage to preserve natural keratin shine',
      'Air Multiplier™ technology produces high-velocity jet of controlled air',
      'Includes 5 professional magnetic attachments including Flyaway tool',
    ],
    usageInstructions: [
      {
        stepNumber: 1,
        title: 'Snap Magnetic Attachment',
        instruction: 'Snap on the 360° rotating magnetic nozzle suitable for your desired texture.',
        stylistTip: 'The Flyaway attachment hides flyaways under longer hair for sleek smoothness.',
      },
    ],
    ingredients: ['Acoustic Polycarbonate Body', 'Digital Motor V9 Core', 'Ceramic Grid'],
    volumeSize: 'Complete Professional Kit',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.96,
    reviewCount: 310,
    isFeatured: true,
    isBestSeller: true,
    isOrganicOrVegan: false,
    isSulfateFree: true,
    hairOrSkinTarget: ['All Hair Types', 'Precision Styling', 'Zero Heat Damage'],
    totalAvailableStock: 5,
    branchStockMatrix: {
      'branch-indiranagar': {
        branchId: 'branch-indiranagar',
        branchName: 'Hive Indiranagar Flagship',
        branchCode: 'BLR-IND-01',
        currentStock: 3,
        reservedStock: 1,
        availableStock: 2,
        inStock: true,
      },
      'branch-koramangala': {
        branchId: 'branch-koramangala',
        branchName: 'Hive Koramangala Lounge',
        branchCode: 'BLR-KOR-02',
        currentStock: 2,
        reservedStock: 0,
        availableStock: 2,
        inStock: true,
      },
      'branch-jubilee': {
        branchId: 'branch-jubilee',
        branchName: 'Hive Jubilee Hills Sanctuary',
        branchCode: 'HYD-JUB-01',
        currentStock: 1,
        reservedStock: 0,
        availableStock: 1,
        inStock: true,
      },
    },
    createdAt: '2026-03-10T12:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },
];

// Initial Retail Orders for Customer Priya Sharma
const INITIAL_CUSTOMER_ORDERS: RetailOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'HIVE-ORD-2026-00481',
    organizationId: 'org_hive_demo',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'priya.sharma@example.com',
    fulfillmentType: 'BRANCH_PICKUP',
    pickupBranchId: 'branch-indiranagar',
    pickupBranchName: 'Hive Indiranagar Flagship Sanctuary',
    pickupBranchAddress: '100ft Road, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru',
    pickupBranchPhone: '+91 80 4123 8899',
    pickupDate: '2026-09-12',
    pickupSlot: '11:00 AM – 02:00 PM',
    pickupOtp: '7419',
    pickupQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=HIVE-ORD-2026-00481-OTP-7419',
    readyForPickupAt: '2026-09-10T11:30:00Z',
    collectedAt: null,
    items: [
      {
        id: 'item-1',
        orderId: 'ord-101',
        productId: 'prod-olaplex-3',
        productName: 'Olaplex No. 3 Hair Perfector (Bond Multiplier)',
        productSku: 'OLP-BOND-003',
        productBrand: 'Olaplex Professional',
        productImageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        volumeSize: '100 ml',
        quantity: 1,
        unitPrice: 2950.0,
        mrp: 3400.0,
        taxRate: 18.0,
        taxAmount: 450.0,
        totalPrice: 2950.0,
      },
      {
        id: 'item-2',
        orderId: 'ord-101',
        productId: 'prod-moroccan-oil',
        productName: 'Moroccanoil Original Treatment Oil',
        productSku: 'MRC-OIL-100',
        productBrand: 'Moroccanoil',
        productImageUrl: 'https://images.unsplash.com/photo-1608248597359-006240d96d92?auto=format&fit=crop&w=800&q=80',
        volumeSize: '100 ml',
        quantity: 1,
        unitPrice: 3600.0,
        mrp: 4100.0,
        taxRate: 18.0,
        taxAmount: 549.15,
        totalPrice: 3600.0,
      },
    ],
    subtotal: 5550.85,
    taxTotal: 999.15,
    discountTotal: 500.0,
    couponCode: 'VIPGLOW10',
    couponDiscount: 500.0,
    loyaltyPointsRedeemed: 200,
    loyaltyDiscountAmount: 200.0,
    walletDebitedAmount: 1500.0,
    deliveryFee: 0.0,
    grandTotal: 5850.0,
    finalPaidAmount: 4150.0,
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    transactionReference: 'UPI-UTR-9082348123',
    status: 'READY_FOR_PICKUP',
    statusHistory: [
      {
        id: 'sh-1',
        status: 'PLACED',
        timestamp: '2026-09-10T09:15:00Z',
        title: 'Order Placed by Customer',
        description: 'Payment authorized via UPI + Wallet. Stock reserved at Indiranagar Branch.',
        updatedBy: 'Priya Sharma (Customer)',
      },
      {
        id: 'sh-2',
        status: 'CONFIRMED',
        timestamp: '2026-09-10T09:30:00Z',
        title: 'Order Confirmed by Branch',
        description: 'Hive Indiranagar dispatch team acknowledged branch pickup preparation.',
        updatedBy: 'Ananya Reddy (Front Desk Lead)',
      },
      {
        id: 'sh-3',
        status: 'PACKED',
        timestamp: '2026-09-10T10:45:00Z',
        title: 'Packed in Luxury Tote Bag',
        description: 'Products verified with barcode scan, sealed with Hive gold ribbon.',
        updatedBy: 'Rajesh K. (Stock Associate)',
      },
      {
        id: 'sh-4',
        status: 'READY_FOR_PICKUP',
        timestamp: '2026-09-10T11:30:00Z',
        title: 'Ready at Reception Front Desk',
        description: 'Customer notified with 4-digit Pickup OTP (7419). Ready for guest collection.',
        updatedBy: 'Sarah Jenkins (Branch Manager)',
      },
    ],
    notes: 'Customer will collect during scheduled haircut appointment on Sep 12.',
    createdAt: '2026-09-10T09:15:00Z',
    updatedAt: '2026-09-10T11:30:00Z',
  },
  {
    id: 'ord-100',
    orderNumber: 'HIVE-ORD-2026-00392',
    organizationId: 'org_hive_demo',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'priya.sharma@example.com',
    fulfillmentType: 'HOME_DELIVERY',
    shippingAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'Plot 42, Road No. 36',
      addressLine2: 'Jubilee Hills Luxury Enclave',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      landmark: 'Opposite Peddamma Temple Metro Station',
    },
    deliveryProvider: 'DELHIVERY',
    deliveryProviderName: 'Delhivery National Express Surface / Air',
    trackingNumber: 'DLV8910294812',
    trackingUrl: 'https://www.delhivery.com/track/package/DLV8910294812',
    estimatedDeliveryDate: '2026-08-20',
    dispatchedAt: '2026-08-18T14:00:00Z',
    deliveredAt: '2026-08-20T16:30:00Z',
    deliveryCheckpoints: [
      {
        timestamp: '2026-08-18T14:00:00Z',
        status: 'PICKED_UP',
        location: 'Hive Jubilee Hills Dispatch Bay',
        description: 'Package handed over to Delhivery courier driver.',
      },
      {
        timestamp: '2026-08-19T08:00:00Z',
        status: 'IN_TRANSIT',
        location: 'Hyderabad Sort Hub',
        description: 'Sorted and allocated to Jubilee Hills local van.',
      },
      {
        timestamp: '2026-08-20T16:30:00Z',
        status: 'DELIVERED',
        location: 'Customer Doorstep (Road No. 36)',
        description: 'Package delivered safely to Priya Sharma with OTP signature.',
      },
    ],
    items: [
      {
        id: 'item-3',
        orderId: 'ord-100',
        productId: 'prod-loreal-absolut-repair',
        productName: "L'Oréal Professionnel Absolut Repair Gold Quinoa Mask",
        productSku: 'LOR-ABS-250',
        productBrand: "L'Oréal Professionnel",
        productImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        volumeSize: '250 ml',
        quantity: 1,
        unitPrice: 1950.0,
        mrp: 2300.0,
        taxRate: 18.0,
        taxAmount: 297.45,
        totalPrice: 1950.0,
      },
    ],
    subtotal: 1652.55,
    taxTotal: 297.45,
    discountTotal: 0.0,
    deliveryFee: 99.0,
    grandTotal: 2049.0,
    finalPaidAmount: 2049.0,
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    status: 'DELIVERED',
    statusHistory: [
      {
        id: 'sh-10',
        status: 'PLACED',
        timestamp: '2026-08-17T18:20:00Z',
        title: 'Order Placed Online',
        description: 'Order paid via Credit Card.',
      },
      {
        id: 'sh-14',
        status: 'DELIVERED',
        timestamp: '2026-08-20T16:30:00Z',
        title: 'Order Delivered to Customer',
        description: 'Delivered directly to guest address with OTP verification.',
      },
    ],
    createdAt: '2026-08-17T18:20:00Z',
    updatedAt: '2026-08-20T16:30:00Z',
  },
];

export default function CustomerPortalPage() {
  // Authentication & Guest State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [guest, setGuest] = useState<PortalGuestProfile>(MOCK_GUEST);
  const [loginPhone, setLoginPhone] = useState('9876543210');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'home' | 'shop' | 'cart' | 'orders' | 'omnichannel' | 'book' | 'appointments' | 'membership' | 'wallet' | 'rewards' | 'bills'
  >('home');

  // ==========================================
  // RETAIL E-COMMERCE & CART STATE (PHASE 15)
  // ==========================================
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      productId: 'prod-olaplex-3',
      product: MOCK_RETAIL_PRODUCTS[0],
      quantity: 1,
      unitPrice: 2950.0,
      mrp: 3400.0,
      taxRate: 18.0,
      taxAmount: 450.0,
      totalPrice: 2950.0,
      selectedBranchId: 'branch-indiranagar',
    },
  ]);

  const [customerOrders, setCustomerOrders] = useState<RetailOrder[]>(INITIAL_CUSTOMER_ORDERS);
  const [selectedProductModal, setSelectedProductModal] = useState<RetailProduct | null>(null);
  const [storeCategoryFilter, setStoreCategoryFilter] = useState<string>('cat-all');
  const [storeSearchQuery, setStoreSearchQuery] = useState<string>('');
  const [storeInStockOnly, setStoreInStockOnly] = useState<boolean>(false);
  const [storeSortBy, setStoreSortBy] = useState<'featured' | 'bestseller' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<RetailOrder | null>(INITIAL_CUSTOMER_ORDERS[0]);
  const [omnichannelFilter, setOmnichannelFilter] = useState<'ALL' | 'SALON_SERVICE' | 'POS_PURCHASE' | 'ONLINE_ORDER'>('ALL');

  // 2-Step Checkout State
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [checkoutFulfillmentType, setCheckoutFulfillmentType] = useState<FulfillmentType>('BRANCH_PICKUP');
  const [checkoutPickupBranch, setCheckoutPickupBranch] = useState<PortalBranchInfo>(MOCK_BRANCHES[0]);
  const [checkoutPickupDate, setCheckoutPickupDate] = useState<string>('2026-09-14');
  const [checkoutPickupSlot, setCheckoutPickupSlot] = useState<string>('11:00 AM – 02:00 PM');
  const [checkoutDeliveryAddress, setCheckoutDeliveryAddress] = useState<ShippingAddress>({
    fullName: 'Priya Sharma',
    phone: '+91 98765 43210',
    addressLine1: 'Plot 42, Road No. 36',
    addressLine2: 'Jubilee Hills Luxury Enclave',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    landmark: 'Near Peddamma Temple',
  });
  const [checkoutCarrier, setCheckoutCarrier] = useState<DeliveryProviderId>('INTERNAL_FLEET');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<RetailPaymentMethod>('UPI');
  const [checkoutUseWallet, setCheckoutUseWallet] = useState<boolean>(false);
  const [checkoutUsePoints, setCheckoutUsePoints] = useState<boolean>(false);
  const [checkoutCouponCode, setCheckoutCouponCode] = useState<string>('VIPGLOW10');
  const [checkoutCouponDiscount, setCheckoutCouponDiscount] = useState<number>(500);

  // Booking Wizard Step: 1 -> 6 (Phase 14)
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedBranch, setSelectedBranch] = useState<PortalBranchInfo>(MOCK_BRANCHES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedService, setSelectedService] = useState<PortalServiceItem>(MOCK_SERVICES[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<PortalAddOn[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<PortalStylistProfile>(MOCK_STYLISTS[0]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-12');
  const [selectedSlot, setSelectedSlot] = useState<string>('04:00 PM');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  
  // Checkout Adjustments (Services)
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponInput, setCouponInput] = useState<string>('HIVE20');
  const [useWalletCredits, setUseWalletCredits] = useState<boolean>(false);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<'PAY_AT_VENUE' | 'ONLINE_UPI' | 'ONLINE_CARD' | 'WALLET_ONLY'>('ONLINE_UPI');
  const [confirmedBooking, setConfirmedBooking] = useState<PortalBookingConfirmation | null>(null);

  // Appointments State
  const [appointments, setAppointments] = useState<PortalAppointmentSummary[]>([
    {
      id: 'app-901',
      bookingRef: 'HV-2026-9014',
      branchId: 'branch-indiranagar',
      branchName: 'Hive Indiranagar Flagship',
      serviceName: 'Keratin Smoothing Infusion & Scalp Therapy',
      category: 'HAIR',
      stylistName: 'Aarav Mehta',
      date: '2026-09-12',
      timeSlot: '04:30 PM',
      durationMinutes: 75,
      status: 'UPCOMING',
      totalAmount: 3800,
      isPaid: true,
      canReschedule: true,
      canCancel: true,
    },
    {
      id: 'app-842',
      bookingRef: 'HV-2026-8421',
      branchId: 'branch-indiranagar',
      branchName: 'Hive Indiranagar Flagship',
      serviceName: 'Hydra-Facial Illuminating Glass Skin Ritual',
      category: 'SKIN',
      stylistName: 'Natasha Roy',
      date: '2026-08-28',
      timeSlot: '11:00 AM',
      durationMinutes: 60,
      status: 'COMPLETED',
      totalAmount: 3200,
      isPaid: true,
      canReschedule: false,
      canCancel: false,
      feedbackRating: 5,
      feedbackComment: 'Incredible experience! Natasha made my skin glow before my sister wedding.',
    },
    {
      id: 'app-710',
      bookingRef: 'HV-2026-7102',
      branchId: 'branch-koramangala',
      branchName: 'Hive Koramangala Lounge',
      serviceName: 'Precision Couture Haircut & Styling',
      category: 'HAIR',
      stylistName: 'Rahul Verma',
      date: '2026-07-15',
      timeSlot: '02:00 PM',
      durationMinutes: 45,
      status: 'COMPLETED',
      totalAmount: 1200,
      isPaid: true,
      canReschedule: false,
      canCancel: false,
    },
  ]);

  // Modals
  const [rescheduleModalApp, setRescheduleModalApp] = useState<PortalAppointmentSummary | null>(null);
  const [rescheduleNewDate, setRescheduleNewDate] = useState<string>('2026-09-14');
  const [rescheduleNewSlot, setRescheduleNewSlot] = useState<string>('02:30 PM');
  const [cancelModalApp, setCancelModalApp] = useState<PortalAppointmentSummary | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Schedule conflict');
  const [cancelAgreedPolicy, setCancelAgreedPolicy] = useState<boolean>(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(2500);
  const [reviewModalApp, setReviewModalApp] = useState<PortalAppointmentSummary | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [viewInvoiceModal, setViewInvoiceModal] = useState<PortalInvoiceReceipt | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==========================================
  // CART & E-COMMERCE CALCULATIONS
  // ==========================================

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
  }, [cartItems]);

  const cartMrpTotal = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.mrp * curr.quantity, 0);
  }, [cartItems]);

  const cartDeliveryFee = useMemo(() => {
    if (checkoutFulfillmentType === 'BRANCH_PICKUP') return 0;
    if (checkoutCarrier === 'DUNZO') return 199;
    if (checkoutCarrier === 'BLUEDART') return 249;
    return 99; // Standard / Internal
  }, [checkoutFulfillmentType, checkoutCarrier]);

  const cartTaxTotal = useMemo(() => {
    return Math.round(cartSubtotal * 0.18);
  }, [cartSubtotal]);

  const cartLoyaltyDeduction = useMemo(() => {
    if (!checkoutUsePoints) return 0;
    return Math.min(guest.loyaltyPoints, cartSubtotal);
  }, [checkoutUsePoints, guest.loyaltyPoints, cartSubtotal]);

  const cartGrandTotal = useMemo(() => {
    return Math.max(0, cartSubtotal + cartDeliveryFee - checkoutCouponDiscount - cartLoyaltyDeduction);
  }, [cartSubtotal, cartDeliveryFee, checkoutCouponDiscount, cartLoyaltyDeduction]);

  const cartWalletDeduction = useMemo(() => {
    if (!checkoutUseWallet) return 0;
    return Math.min(guest.walletBalance, cartGrandTotal);
  }, [checkoutUseWallet, guest.walletBalance, cartGrandTotal]);

  const cartFinalPayable = useMemo(() => {
    return Math.max(0, cartGrandTotal - cartWalletDeduction);
  }, [cartGrandTotal, cartWalletDeduction]);

  // Cart Management Handlers with Strict Never-Oversell Validation
  const handleAddToCart = (product: RetailProduct, quantity = 1) => {
    const existing = cartItems.find((i) => i.productId === product.id);
    const currentInCart = existing ? existing.quantity : 0;
    const maxAvailable = product.totalAvailableStock;

    if (currentInCart + quantity > maxAvailable) {
      showToast(`⚠️ Cannot add more. Only ${maxAvailable} units in stock across branches!`);
      return;
    }

    if (existing) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.productId === product.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                totalPrice: (i.quantity + quantity) * product.price,
              }
            : i
        )
      );
    } else {
      const newItem: CartItem = {
        productId: product.id,
        product,
        quantity,
        unitPrice: product.price,
        mrp: product.mrp,
        taxRate: product.taxRate,
        taxAmount: Math.round(product.price * 0.18),
        totalPrice: product.price * quantity,
        selectedBranchId: 'branch-indiranagar',
      };
      setCartItems((prev) => [...prev, newItem]);
    }

    showToast(`🛍️ Added ${quantity}x "${product.name}" to your luxury bag!`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.productId !== productId));
      showToast('Item removed from bag');
      return;
    }

    if (newQty > item.product.totalAvailableStock) {
      showToast(`⚠️ Max stock limit reached (${item.product.totalAvailableStock} available)`);
      return;
    }

    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity: newQty,
              totalPrice: newQty * i.unitPrice,
            }
          : i
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
    showToast('Item removed from bag');
  };

  // Checkout Placement Handler
  const handleExecuteCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your bag is empty!');
      return;
    }

    const orderId = `ord-${Date.now().toString().slice(-5)}`;
    const orderNumber = `HIVE-ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const pickupOtp = checkoutFulfillmentType === 'BRANCH_PICKUP' ? Math.floor(1000 + Math.random() * 9000).toString() : undefined;
    const nowIso = new Date().toISOString();

    const newOrder: RetailOrder = {
      id: orderId,
      orderNumber,
      organizationId: 'org_hive_demo',
      customerId: guest.id,
      customerName: guest.name,
      customerPhone: guest.mobile,
      customerEmail: guest.email,
      fulfillmentType: checkoutFulfillmentType,
      pickupBranchId: checkoutFulfillmentType === 'BRANCH_PICKUP' ? checkoutPickupBranch.id : undefined,
      pickupBranchName: checkoutFulfillmentType === 'BRANCH_PICKUP' ? checkoutPickupBranch.name : undefined,
      pickupBranchAddress: checkoutFulfillmentType === 'BRANCH_PICKUP' ? checkoutPickupBranch.address : undefined,
      pickupBranchPhone: checkoutFulfillmentType === 'BRANCH_PICKUP' ? checkoutPickupBranch.phone : undefined,
      pickupDate: checkoutFulfillmentType === 'BRANCH_PICKUP' ? checkoutPickupDate : undefined,
      pickupSlot: checkoutFulfillmentType === 'BRANCH_PICKUP' ? checkoutPickupSlot : undefined,
      pickupOtp: pickupOtp || null,
      pickupQrCodeUrl: pickupOtp ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${orderNumber}-OTP-${pickupOtp}` : null,
      shippingAddress: checkoutFulfillmentType === 'HOME_DELIVERY' ? checkoutDeliveryAddress : null,
      deliveryProvider: checkoutFulfillmentType === 'HOME_DELIVERY' ? checkoutCarrier : null,
      deliveryProviderName: checkoutFulfillmentType === 'HOME_DELIVERY' ? (checkoutCarrier === 'DUNZO' ? 'Dunzo Hyperlocal Express' : 'Hive Salon Concierge') : null,
      trackingNumber: checkoutFulfillmentType === 'HOME_DELIVERY' ? `HIVE-CNC-${Math.floor(100000 + Math.random() * 900000)}` : null,
      items: cartItems.map((c, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        orderId,
        productId: c.productId,
        productName: c.product.name,
        productSku: c.product.sku,
        productBrand: c.product.brand,
        productImageUrl: c.product.imageUrl,
        volumeSize: c.product.volumeSize,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        mrp: c.mrp,
        taxRate: c.taxRate,
        taxAmount: c.taxAmount,
        totalPrice: c.totalPrice,
      })),
      subtotal: cartSubtotal,
      taxTotal: cartTaxTotal,
      discountTotal: checkoutCouponDiscount + cartLoyaltyDeduction,
      couponCode: checkoutCouponDiscount > 0 ? checkoutCouponCode : null,
      couponDiscount: checkoutCouponDiscount,
      loyaltyPointsRedeemed: cartLoyaltyDeduction,
      loyaltyDiscountAmount: cartLoyaltyDeduction,
      walletDebitedAmount: cartWalletDeduction,
      deliveryFee: cartDeliveryFee,
      grandTotal: cartGrandTotal,
      finalPaidAmount: cartFinalPayable,
      paymentStatus: 'PAID',
      paymentMethod: checkoutPaymentMethod,
      transactionReference: `TXN-${Date.now()}`,
      status: 'PLACED',
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          status: 'PLACED',
          timestamp: nowIso,
          title: 'Order Placed by Customer',
          description: `Order authorized via ${checkoutPaymentMethod}. Stock strictly reserved.`,
          updatedBy: `${guest.name} (Customer)`,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Deduct wallet/points
    if (cartWalletDeduction > 0) {
      setGuest((prev) => ({ ...prev, walletBalance: prev.walletBalance - cartWalletDeduction }));
    }
    if (cartLoyaltyDeduction > 0) {
      setGuest((prev) => ({ ...prev, loyaltyPoints: prev.loyaltyPoints - cartLoyaltyDeduction }));
    }

    setCustomerOrders([newOrder, ...customerOrders]);
    setActiveTrackingOrder(newOrder);
    setCartItems([]);
    setCheckoutStep(3);
    setActiveTab('orders');
    showToast(`🎉 Order #${orderNumber} placed successfully! Stock reserved.`);
  };

  // Filtered Storefront Products
  const filteredStoreProducts = useMemo(() => {
    let list = [...MOCK_RETAIL_PRODUCTS];

    if (storeCategoryFilter !== 'cat-all') {
      list = list.filter((p) => p.categoryId === storeCategoryFilter);
    }

    if (storeSearchQuery.trim()) {
      const q = storeSearchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.benefits.some((b) => b.toLowerCase().includes(q))
      );
    }

    if (storeInStockOnly) {
      list = list.filter((p) => p.totalAvailableStock > 0);
    }

    if (storeSortBy === 'price_asc') list.sort((a, b) => a.price - b.price);
    if (storeSortBy === 'price_desc') list.sort((a, b) => b.price - a.price);
    if (storeSortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (storeSortBy === 'bestseller') list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));

    return list;
  }, [storeCategoryFilter, storeSearchQuery, storeInStockOnly, storeSortBy]);

  // Unified Omnichannel History Events
  const omnichannelEvents: OmnichannelCustomerTimelineEvent[] = useMemo(() => {
    const list: OmnichannelCustomerTimelineEvent[] = [];

    // Online Store Orders
    customerOrders.forEach((ord) => {
      const itemsText = ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ');
      list.push({
        id: `ev-ord-${ord.id}`,
        customerId: guest.id,
        channel: 'ONLINE_ORDER',
        eventType: `ONLINE_ORDER_${ord.status}`,
        title: `Online Retail Order #${ord.orderNumber}`,
        description: `${ord.fulfillmentType === 'BRANCH_PICKUP' ? '🏪 In-Store Branch Pickup' : '🚚 Doorstep Delivery'} • Items: ${itemsText} • Status: ${ord.status.replace(/_/g, ' ')}`,
        referenceId: ord.orderNumber,
        amount: ord.grandTotal,
        status: ord.status,
        branchName: ord.pickupBranchName || 'Online Sanctuary Store',
        itemsSummary: itemsText,
        occurredAt: ord.createdAt,
      });
    });

    // In-Salon POS Counter Bills
    list.push({
      id: 'ev-pos-391',
      customerId: guest.id,
      channel: 'POS_PURCHASE',
      eventType: 'POS_RETAIL_PURCHASE',
      title: 'In-Salon POS Invoice #HIVE-HYD-0391',
      description: 'Reception desk checkout: Balayage Gloss & Moroccan Blowdry + Olaplex No. 4 Shampoo counter retail bottle paid via Wallet + UPI.',
      referenceId: 'HIVE-HYD-0391',
      amount: 4850.0,
      status: 'PAID',
      branchName: 'Jubilee Hills Flagship',
      itemsSummary: 'Moroccan Blowdry + Olaplex No. 4 Shampoo (250ml)',
      occurredAt: '2026-08-15T12:30:00Z',
    });

    // In-Salon Services
    appointments.forEach((app) => {
      list.push({
        id: `ev-app-${app.id}`,
        customerId: guest.id,
        channel: 'SALON_SERVICE',
        eventType: `APPOINTMENT_${app.status}`,
        title: `Salon Service: ${app.serviceName}`,
        description: `${app.durationMinutes}m appointment with Stylist ${app.stylistName} at ${app.branchName} • Ref: ${app.bookingRef}`,
        referenceId: app.bookingRef,
        amount: app.totalAmount,
        status: app.status,
        branchName: app.branchName,
        itemsSummary: app.serviceName,
        occurredAt: `${app.date}T10:00:00Z`,
      });
    });

    list.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
    return list;
  }, [customerOrders, appointments, guest.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/95 border border-amber-500/50 text-amber-200 px-5 py-3 rounded-full shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30">
            H
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base sm:text-lg">HIVE SALON</span>
              <span className="text-[10px] uppercase tracking-widest font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                GUEST PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              {guest.homeBranchName.split('—')[0]}
            </p>
          </div>
        </div>

        {/* Guest Profile & Quick Nav */}
        <div className="flex items-center gap-3">
          {/* Quick Cart Pill */}
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              activeTab === 'cart'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-amber-500/50'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
            <span>Bag</span>
            {cartItemCount > 0 && (
              <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {cartItemCount}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200">{guest.name}</span>
                <span className="text-[10px] text-amber-400 font-medium">{guest.loyaltyTier} VIP • ₹{guest.walletBalance.toLocaleString('en-IN')} Wallet</span>
              </div>
              <button
                onClick={() => setActiveTab('wallet')}
                className="flex items-center gap-1.5 bg-slate-900 border border-amber-500/30 text-amber-300 hover:border-amber-400 px-3 py-1.5 rounded-xl text-xs font-medium transition shadow-sm"
              >
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span>₹{guest.walletBalance.toLocaleString('en-IN')}</span>
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                title="Switch Guest / Logout"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoggedIn(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs hover:brightness-110 shadow-lg shadow-amber-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Login with OTP</span>
            </button>
          )}
        </div>
      </header>

      {/* NAVIGATION TABS (Desktop / Tablet Top Bar) */}
      <nav className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-8 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-6xl mx-auto flex items-center gap-1 sm:gap-2">
          {[
            { id: 'home', label: 'Customer Home', icon: Sparkle },
            { id: 'shop', label: 'Shop & Retail', icon: ShoppingBag, badge: 'Phase 15' },
            { id: 'cart', label: 'My Bag', icon: ShoppingCart, count: cartItemCount },
            { id: 'orders', label: 'My Orders', icon: Package, count: customerOrders.filter((o) => o.status !== 'DELIVERED').length },
            { id: 'omnichannel', label: 'Omnichannel History', icon: History },
            { id: 'book', label: 'Book Service', icon: Calendar },
            { id: 'appointments', label: 'My Appointments', icon: CalendarCheck, count: appointments.filter((a) => a.status === 'UPCOMING').length },
            { id: 'membership', label: 'My Membership', icon: ShieldCheck },
            { id: 'wallet', label: 'My Wallet', icon: Wallet },
            { id: 'rewards', label: 'My Rewards', icon: Gift },
            { id: 'bills', label: 'My Bills', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'book') setBookingStep(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count ? (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 mb-20 md:mb-8">

        {/* ======================================================== */}
        {/* TAB 1: CUSTOMER HOME DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* HERO WELCOME GREETING */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-8">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Welcome back, {guest.name}
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                      {guest.loyaltyTier} TIER
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Your Personal Salon Sanctuary
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                    Experience luxury salon services, authentic professional homecare retail products, and frictionless multi-channel ordering.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/20 hover:brightness-105 active:scale-95 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Explore Retail Store</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('book');
                      setBookingStep(1);
                    }}
                    className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold px-4 py-3.5 rounded-2xl text-sm transition"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CURATED BESTSELLERS CAROUSEL */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Top Stylist-Approved Retail Picks
                  </h2>
                  <p className="text-xs text-slate-400">Authentic professional bond builders, argan serums, and dermal elixirs.</p>
                </div>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>View All Retail Products</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_RETAIL_PRODUCTS.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 hover:border-amber-500/40 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-950">
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                          {prod.brand}
                        </span>
                        {prod.isBestSeller && (
                          <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            ★ BESTSELLER
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-white line-clamp-1">{prod.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{prod.shortDescription}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-extrabold text-amber-400">₹{prod.price.toLocaleString('en-IN')}</span>
                        <span className="text-[11px] text-slate-500 line-through ml-1.5">₹{prod.mrp.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProductModal(prod)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleAddToCart(prod, 1)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SHOP & RETAIL STOREFRONT (PHASE 15) */}
        {/* ======================================================== */}
        {activeTab === 'shop' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* STOREFRONT BANNER */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  OFFICIAL SALON RETAIL STORE
                </span>
                <h1 className="text-2xl font-extrabold text-white mt-1">Authentic Professional Haircare & Aesthetics</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Order salon-exclusive hair bond multipliers, argan elixirs, and dermal treatments. Pick up at your favorite salon branch or enjoy same-day white-glove doorstep delivery.
                </p>
              </div>

              {/* Bag summary banner button */}
              <button
                onClick={() => setActiveTab('cart')}
                className="flex items-center gap-3 bg-slate-900 border border-amber-500/40 hover:border-amber-400 px-5 py-3 rounded-2xl transition group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Shopping Bag</span>
                  <span className="text-xs font-bold text-amber-400">
                    {cartItemCount} Items • ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </button>
            </div>

            {/* SEARCH & FILTERS BAR */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Live Search */}
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={storeSearchQuery}
                    onChange={(e) => setStoreSearchQuery(e.target.value)}
                    placeholder="Search by product name, brand, benefit (e.g. Olaplex, Frizz)..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Sort & In-Stock Filter */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={storeInStockOnly}
                      onChange={(e) => setStoreInStockOnly(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>In Stock Only</span>
                  </label>

                  <select
                    value={storeSortBy}
                    onChange={(e) => setStoreSortBy(e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="featured">Featured Picks</option>
                    <option value="bestseller">Best Sellers</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                {MOCK_RETAIL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setStoreCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      storeCategoryFilter === cat.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT GRID */}
            {filteredStoreProducts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
                <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">No Products Found</h3>
                <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms.</p>
                <button
                  onClick={() => {
                    setStoreCategoryFilter('cat-all');
                    setStoreSearchQuery('');
                    setStoreInStockOnly(false);
                  }}
                  className="mt-3 text-xs text-amber-400 font-bold hover:underline"
                >
                  Reset Storefront Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStoreProducts.map((product) => {
                  const indiranagarStock = product.branchStockMatrix['branch-indiranagar']?.availableStock || 0;
                  const koramangalaStock = product.branchStockMatrix['branch-koramangala']?.availableStock || 0;

                  return (
                    <div
                      key={product.id}
                      className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 space-y-3.5 hover:border-amber-500/40 transition flex flex-col justify-between group shadow-sm"
                    >
                      <div className="space-y-3">
                        {/* Image Container with Badge */}
                        <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-950 cursor-pointer" onClick={() => setSelectedProductModal(product)}>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            {product.brand}
                          </span>
                          <span className="absolute bottom-2.5 right-2.5 bg-slate-950/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 border border-slate-800">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.volumeSize}</span>
                            {product.isSulfateFree && (
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20">
                                Sulfate-Free
                              </span>
                            )}
                          </div>
                          <h3
                            onClick={() => setSelectedProductModal(product)}
                            className="font-bold text-sm text-white line-clamp-1 hover:text-amber-400 cursor-pointer transition"
                          >
                            {product.name}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {product.shortDescription}
                          </p>
                        </div>

                        {/* Real-time Branch Stock Availability Matrix */}
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Real-Time Stock Availability:
                          </span>
                          <div className="flex justify-between text-slate-300">
                            <span>Indiranagar Flagship:</span>
                            <span className={`font-mono font-bold ${indiranagarStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {indiranagarStock > 0 ? `${indiranagarStock} left` : 'Out of Stock'}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Koramangala Lounge:</span>
                            <span className={`font-mono font-bold ${koramangalaStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {koramangalaStock > 0 ? `${koramangalaStock} left` : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Add to Bag Buttons */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-amber-400 tabular-nums">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-500 line-through">
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold block">
                            Save {product.discountPercentage}%
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProductModal(product)}
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                            title="Product Details & Ritual"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product, 1)}
                            disabled={product.totalAvailableStock <= 0}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                              product.totalAvailableStock > 0
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{product.totalAvailableStock > 0 ? 'Add to Bag' : 'Sold Out'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SHOPPING BAG & 2-STEP CHECKOUT (PHASE 15) */}
        {/* ======================================================== */}
        {activeTab === 'cart' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-amber-400" /> Your Luxury Shopping Bag
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Review items, select branch pickup or home delivery, and complete order.</p>
              </div>
              <button
                onClick={() => setActiveTab('shop')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More Products</span>
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto opacity-60" />
                <h3 className="text-base font-bold text-white">Your Shopping Bag is Empty</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Explore our salon-grade hair care, heat protectants, and aesthetic skin products to keep your salon glow lasting at home.
                </p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs shadow-lg transition"
                >
                  Browse Retail Storefront
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Cart Line Items & Step Flow */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Step Selector Pills */}
                  <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                        checkoutStep === 1 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>1. Bag & Fulfillment</span>
                    </button>
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                        checkoutStep === 2 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>2. Payment & Confirmation</span>
                    </button>
                  </div>

                  {/* STEP 1: BAG ITEMS & FULFILLMENT METHOD */}
                  {checkoutStep === 1 && (
                    <div className="space-y-4">
                      {/* Cart Items List */}
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div
                            key={item.productId}
                            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                              />
                              <div>
                                <span className="text-[10px] text-amber-400 font-bold uppercase">{item.product.brand}</span>
                                <h4 className="font-bold text-xs text-white line-clamp-1">{item.product.name}</h4>
                                <span className="text-[11px] text-slate-400">{item.product.volumeSize} • SKU: {item.product.sku}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-xl border border-slate-700">
                                <button
                                  onClick={() => handleUpdateCartQty(item.productId, -1)}
                                  className="p-1 text-slate-400 hover:text-white transition"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-mono font-bold w-4 text-center text-white">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateCartQty(item.productId, 1)}
                                  className="p-1 text-slate-400 hover:text-white transition"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="text-right">
                                <span className="text-sm font-extrabold text-white font-mono block">
                                  ₹{item.totalPrice.toLocaleString('en-IN')}
                                </span>
                                <button
                                  onClick={() => handleRemoveFromCart(item.productId)}
                                  className="text-[10px] text-red-400 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Fulfillment Method Selection */}
                      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Truck className="w-4 h-4 text-amber-400" /> Select Delivery / Pickup Method
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Option 1: Branch Pickup */}
                          <div
                            onClick={() => setCheckoutFulfillmentType('BRANCH_PICKUP')}
                            className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                              checkoutFulfillmentType === 'BRANCH_PICKUP'
                                ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/30'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-amber-400" /> In-Store Branch Pickup
                              </span>
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                FREE
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Collect at salon reception desk with secret 4-digit OTP. Zero waiting.
                            </p>
                          </div>

                          {/* Option 2: Home Delivery */}
                          <div
                            onClick={() => setCheckoutFulfillmentType('HOME_DELIVERY')}
                            className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                              checkoutFulfillmentType === 'HOME_DELIVERY'
                                ? 'bg-indigo-500/15 border-indigo-400 ring-2 ring-indigo-400/30'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-indigo-400" /> Doorstep Home Delivery
                              </span>
                              <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                                from ₹99
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Delivered in climate-controlled luxury packaging to your residence.
                            </p>
                          </div>
                        </div>

                        {/* Branch Pickup Settings */}
                        {checkoutFulfillmentType === 'BRANCH_PICKUP' && (
                          <div className="pt-3 border-t border-slate-800 space-y-3 animate-in fade-in">
                            <label className="text-xs font-semibold text-slate-300 block">Choose Salon Pickup Location</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {MOCK_BRANCHES.map((b) => (
                                <div
                                  key={b.id}
                                  onClick={() => setCheckoutPickupBranch(b)}
                                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                                    checkoutPickupBranch.id === b.id
                                      ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                                      : 'bg-slate-950 border-slate-800 text-slate-400'
                                  }`}
                                >
                                  <span className="block font-semibold">{b.name}</span>
                                  <span className="text-[10px] opacity-80 block">{b.city}</span>
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2">
                              <div>
                                <label className="text-[11px] text-slate-400 block mb-1">Pickup Date</label>
                                <input
                                  type="date"
                                  value={checkoutPickupDate}
                                  onChange={(e) => setCheckoutPickupDate(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] text-slate-400 block mb-1">Pickup Time Window</label>
                                <select
                                  value={checkoutPickupSlot}
                                  onChange={(e) => setCheckoutPickupSlot(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                                >
                                  <option value="11:00 AM – 02:00 PM">11:00 AM – 02:00 PM</option>
                                  <option value="02:00 PM – 05:00 PM">02:00 PM – 05:00 PM</option>
                                  <option value="05:00 PM – 08:30 PM">05:00 PM – 08:30 PM</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Home Delivery Address & Carrier Settings */}
                        {checkoutFulfillmentType === 'HOME_DELIVERY' && (
                          <div className="pt-3 border-t border-slate-800 space-y-3 animate-in fade-in">
                            <label className="text-xs font-semibold text-slate-300 block">Shipping Address</label>
                            <input
                              type="text"
                              value={checkoutDeliveryAddress.addressLine1}
                              onChange={(e) => setCheckoutDeliveryAddress({ ...checkoutDeliveryAddress, addressLine1: e.target.value })}
                              placeholder="Flat / House No. / Building Name"
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={checkoutDeliveryAddress.city}
                                onChange={(e) => setCheckoutDeliveryAddress({ ...checkoutDeliveryAddress, city: e.target.value })}
                                placeholder="City"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                              />
                              <input
                                type="text"
                                value={checkoutDeliveryAddress.pincode}
                                onChange={(e) => setCheckoutDeliveryAddress({ ...checkoutDeliveryAddress, pincode: e.target.value })}
                                placeholder="Pincode (e.g. 500033)"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                              />
                            </div>

                            <label className="text-xs font-semibold text-slate-300 block pt-2">Select Delivery Speed</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {[
                                { id: 'INTERNAL_FLEET', name: 'Salon Concierge', days: '24h Express', fee: 149 },
                                { id: 'DUNZO', name: 'Dunzo Hyperlocal', days: '60–90 Mins', fee: 199 },
                                { id: 'DELHIVERY', name: 'Delhivery Surface', days: '2–3 Days', fee: 99 },
                              ].map((c) => (
                                <div
                                  key={c.id}
                                  onClick={() => setCheckoutCarrier(c.id as any)}
                                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                                    checkoutCarrier === c.id
                                      ? 'bg-indigo-500/20 border-indigo-400 text-white font-bold'
                                      : 'bg-slate-950 border-slate-800 text-slate-400'
                                  }`}
                                >
                                  <span className="block font-semibold">{c.name}</span>
                                  <span className="text-[10px] text-slate-400 block">{c.days} • ₹{c.fee}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => setCheckoutStep(2)}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
                        >
                          <span>Proceed to Payment & Review</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PAYMENT METHOD & COUPONS */}
                  {checkoutStep === 2 && (
                    <div className="space-y-4 animate-in fade-in">
                      {/* Loyalty & Wallet Deductions */}
                      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Gift className="w-4 h-4 text-amber-400" /> Apply Rewards & Wallet Balance
                        </h3>

                        <div className="space-y-2 text-xs">
                          {/* Wallet Debit Toggle */}
                          <div
                            onClick={() => setCheckoutUseWallet(!checkoutUseWallet)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              checkoutUseWallet ? 'bg-emerald-500/15 border-emerald-400' : 'bg-slate-950 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-emerald-400" />
                              <div>
                                <span className="font-bold text-white block">Use Prepaid Wallet Balance</span>
                                <span className="text-[10px] text-slate-400">Available: ₹{guest.walletBalance.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                            <input type="checkbox" checked={checkoutUseWallet} readOnly className="rounded accent-emerald-500" />
                          </div>

                          {/* Loyalty Points Toggle */}
                          <div
                            onClick={() => setCheckoutUsePoints(!checkoutUsePoints)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              checkoutUsePoints ? 'bg-amber-500/15 border-amber-400' : 'bg-slate-950 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Gift className="w-4 h-4 text-amber-400" />
                              <div>
                                <span className="font-bold text-white block">Redeem Loyalty Points</span>
                                <span className="text-[10px] text-slate-400">Available: {guest.loyaltyPoints} points (= ₹{guest.loyaltyPoints})</span>
                              </div>
                            </div>
                            <input type="checkbox" checked={checkoutUsePoints} readOnly className="rounded accent-amber-500" />
                          </div>
                        </div>
                      </div>

                      {/* Payment Options */}
                      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-amber-400" /> Select Payment Method
                        </h3>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            { id: 'UPI', label: 'UPI / QR Code', icon: Smartphone },
                            { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
                            { id: 'PAY_ON_PICKUP', label: 'Pay at Reception', icon: MapPin },
                            { id: 'WALLET', label: '1-Click Wallet Only', icon: Wallet },
                          ].map((p) => {
                            const Icon = p.icon;
                            return (
                              <div
                                key={p.id}
                                onClick={() => setCheckoutPaymentMethod(p.id as any)}
                                className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2 ${
                                  checkoutPaymentMethod === p.id
                                    ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                                    : 'bg-slate-950 border-slate-800 text-slate-400'
                                }`}
                              >
                                <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>{p.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setCheckoutStep(1)}
                          className="px-4 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-xs"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleExecuteCheckout}
                          className="flex-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-extrabold py-3.5 rounded-2xl text-xs shadow-xl transition"
                        >
                          Authorize Payment & Place Order (₹{cartFinalPayable.toLocaleString('en-IN')})
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Order Summary & Price Breakdown */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center justify-between">
                      <span>Order Summary</span>
                      <span className="text-xs font-mono text-slate-400">{cartItemCount} items</span>
                    </h3>

                    {/* Financial Line Items */}
                    <div className="space-y-2 text-xs border-t border-slate-800 pt-3 text-slate-400">
                      <div className="flex justify-between">
                        <span>Original MRP Total:</span>
                        <span className="line-through font-mono">₹{cartMrpTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Bag Subtotal:</span>
                        <span className="font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery / Pickup:</span>
                        <span className={`font-mono ${cartDeliveryFee === 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {cartDeliveryFee === 0 ? 'FREE' : `+₹${cartDeliveryFee}`}
                        </span>
                      </div>
                      {checkoutCouponDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Coupon Discount (VIPGLOW10):</span>
                          <span className="font-mono">-₹{checkoutCouponDiscount}</span>
                        </div>
                      )}
                      {cartLoyaltyDeduction > 0 && (
                        <div className="flex justify-between text-amber-400">
                          <span>Loyalty Points Redeemed:</span>
                          <span className="font-mono">-₹{cartLoyaltyDeduction}</span>
                        </div>
                      )}
                      {cartWalletDeduction > 0 && (
                        <div className="flex justify-between text-emerald-400 font-medium">
                          <span>Prepaid Wallet Deduction:</span>
                          <span className="font-mono">-₹{cartWalletDeduction.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm font-extrabold text-white pt-3 border-t border-slate-800">
                        <span>Net Payable:</span>
                        <span className="text-amber-400 font-mono text-base">
                          ₹{cartFinalPayable.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>100% Genuine Salon Products Guaranteed</span>
                      </div>
                      <p>Synchronized directly with branch stock. Never overselling inventory.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MY ORDERS & LIVE TRACKING (PHASE 15) */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Package className="w-6 h-6 text-amber-400" /> My Retail Store Orders
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Track live branch pickup status, 4-digit OTP, and courier delivery dispatches.</p>
              </div>
              <button
                onClick={() => setActiveTab('shop')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop More</span>
              </button>
            </div>

            <div className="space-y-4">
              {customerOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-sm"
                >
                  {/* Order Top Line */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">{ord.orderNumber}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                            ord.status === 'DELIVERED'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')} • {ord.items.length} Items
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-amber-400 font-mono">
                        ₹{ord.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* 8-Stage Interactive Progress Bar */}
                  <div className="py-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
                      <span className={ord.status === 'PLACED' ? 'text-amber-400' : ''}>Placed</span>
                      <span className={ord.status === 'CONFIRMED' ? 'text-amber-400' : ''}>Confirmed</span>
                      <span className={ord.status === 'PACKED' ? 'text-amber-400' : ''}>Packed</span>
                      <span className={ord.status === 'READY_FOR_PICKUP' || ord.status === 'OUT_FOR_DELIVERY' ? 'text-amber-400' : ''}>
                        {ord.fulfillmentType === 'BRANCH_PICKUP' ? 'Ready for Pickup' : 'Out for Delivery'}
                      </span>
                      <span className={ord.status === 'DELIVERED' ? 'text-emerald-400' : ''}>Delivered</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-500"
                        style={{
                          width:
                            ord.status === 'PLACED'
                              ? '20%'
                              : ord.status === 'CONFIRMED'
                              ? '40%'
                              : ord.status === 'PACKED'
                              ? '60%'
                              : ord.status === 'READY_FOR_PICKUP' || ord.status === 'OUT_FOR_DELIVERY'
                              ? '80%'
                              : '100%',
                        }}
                      />
                    </div>
                  </div>

                  {/* Order Line Items */}
                  <div className="space-y-2">
                    {ord.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img src={item.productImageUrl} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <span className="font-semibold text-white block">{item.productName}</span>
                            <span className="text-[10px] text-slate-400">{item.productBrand} • Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold font-mono text-slate-200">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Fulfillment Specific Card: Pickup OTP or Courier Tracking */}
                  {ord.fulfillmentType === 'BRANCH_PICKUP' ? (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-amber-400" /> In-Store Pickup at {ord.pickupBranchName}
                        </span>
                        <p className="text-[11px] text-slate-300">
                          {ord.pickupBranchAddress} • Slot: {ord.pickupSlot}
                        </p>
                      </div>

                      {ord.pickupOtp && (
                        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-amber-500/40">
                          <QrCode className="w-8 h-8 text-amber-400 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">4-Digit Pickup OTP</span>
                            <span className="text-lg font-mono font-black text-amber-400 tracking-widest block">
                              {ord.pickupOtp}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-indigo-400" /> Delivery via {ord.deliveryProviderName || 'Courier Partner'}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Ship to: {ord.shippingAddress?.addressLine1}, {ord.shippingAddress?.city} ({ord.shippingAddress?.pincode})
                        </p>
                      </div>
                      {ord.trackingNumber && (
                        <span className="font-mono bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-500/30 font-bold">
                          AWB: {ord.trackingNumber}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: UNIFIED OMNICHANNEL CUSTOMER HISTORY (PHASE 15) */}
        {/* ======================================================== */}
        {activeTab === 'omnichannel' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  OMNICHANNEL 360° CUSTOMER PROFILE
                </span>
                <h1 className="text-2xl font-extrabold text-white mt-1">Unified Guest Experience Timeline</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Your complete salon relationship in one single chronological timeline: in-salon hair & aesthetic services, POS reception purchases, and online storefront deliveries.
                </p>
              </div>

              {/* 3-Part Omnichannel Spend Breakdown */}
              <div className="flex gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">Salon Services</span>
                  <span className="font-bold text-amber-400 font-mono">₹48,500</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">POS Retail</span>
                  <span className="font-bold text-emerald-400 font-mono">₹4,850</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">Online Orders</span>
                  <span className="font-bold text-indigo-400 font-mono">₹7,899</span>
                </div>
              </div>
            </div>

            {/* Omnichannel Channel Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'ALL', label: 'All Timeline Events' },
                { id: 'SALON_SERVICE', label: '💈 Salon Services' },
                { id: 'POS_PURCHASE', label: '🧾 POS Counter Bills' },
                { id: 'ONLINE_ORDER', label: '🛍️ Online Storefront' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setOmnichannelFilter(filter.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
                    omnichannelFilter === filter.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {omnichannelEvents
                .filter((evt) => {
                  if (omnichannelFilter === 'ALL') return true;
                  return evt.channel === omnichannelFilter;
                })
                .map((evt) => {
                  const isService = evt.channel === 'SALON_SERVICE';
                  const isPos = evt.channel === 'POS_PURCHASE';
                  const isOnline = evt.channel === 'ONLINE_ORDER';

                  return (
                    <div key={evt.id} className="relative group text-left">
                      <div
                        className={`absolute -left-[27px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 border-2 ${
                          isService ? 'border-amber-500' : isPos ? 'border-emerald-500' : 'border-indigo-500'
                        }`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            isService ? 'bg-amber-500' : isPos ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                        />
                      </div>

                      <div className="p-4 rounded-3xl border border-slate-800 bg-slate-900/70 hover:border-amber-500/40 transition space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                isService
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : isPos
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                              }`}
                            >
                              {isService ? '💈 Salon Service' : isPos ? '🧾 POS In-Store Bill' : '🛍️ Online Storefront'}
                            </span>
                            <h3 className="text-xs font-bold text-white">{evt.title}</h3>
                          </div>

                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(evt.occurredAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Location: <strong>{evt.branchName}</strong></span>
                          {evt.amount && (
                            <span className="font-bold text-amber-400 font-mono">
                              ₹{evt.amount.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* EXISTING TABS (BOOK, APPOINTMENTS, MEMBERSHIP, WALLET, REWARDS, BILLS) */}
        {/* ======================================================== */}
        {activeTab === 'book' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white">Book Salon Experience</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_SERVICES.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setSelectedService(srv);
                      showToast(`Selected service: ${srv.name}`);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      selectedService.id === srv.id ? 'bg-amber-500/20 border-amber-400' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <span className="font-bold text-sm text-white block">{srv.name}</span>
                    <p className="text-xs text-slate-400 mt-1">{srv.description}</p>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800">
                      <span className="text-xs text-slate-400">{srv.durationMinutes} mins</span>
                      <span className="font-bold text-amber-400 font-mono">₹{srv.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white">My Salon Appointments</h2>
            <div className="space-y-3">
              {appointments.map((app) => (
                <div key={app.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{app.serviceName}</span>
                    <span className="text-slate-400">Stylist: {app.stylistName} • {app.branchName} • {app.date} at {app.timeSlot}</span>
                  </div>
                  <span className="font-bold text-amber-400 font-mono">₹{app.totalAmount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'membership' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-xs space-y-3 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white">Diamond Elite VIP Membership</h2>
            <p className="text-slate-300">Active until March 31, 2027. Enjoy 15% discount on all styling rituals, free beverage bar upgrades, and priority weekend bookings.</p>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-xs space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white">Prepaid Guest Wallet</h2>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Available Balance</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">₹{guest.walletBalance.toLocaleString('en-IN')}</span>
              </div>
              <button
                onClick={() => setTopUpModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl"
              >
                Top-up Balance
              </button>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-xs space-y-3 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white">Loyalty & Reward Points</h2>
            <p className="text-slate-300">You have <strong>{guest.loyaltyPoints} Gold VIP points</strong>. Redeem at checkout for ₹1.00 per point discount on salon services or retail products.</p>
          </div>
        )}

        {activeTab === 'bills' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white">My Tax Invoices & Receipts</h2>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-white block">Invoice #HIVE-HYD-0391</span>
                <span className="text-slate-400">Aug 15, 2026 • Balayage Gloss & Moroccan Blowdry</span>
              </div>
              <span className="font-bold text-amber-400 font-mono">₹4,850</span>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* PRODUCT DETAILS & USAGE RITUAL MODAL (PHASE 15) */}
      {/* ======================================================== */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {selectedProductModal.brand}
                </span>
                <h2 className="text-xl font-black text-white mt-1">{selectedProductModal.name}</h2>
                <span className="text-xs text-slate-400">{selectedProductModal.volumeSize} • SKU: {selectedProductModal.sku}</span>
              </div>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Gallery Image */}
            <div className="rounded-2xl overflow-hidden aspect-16/9 bg-slate-950 border border-slate-800">
              <img src={selectedProductModal.imageUrl} alt={selectedProductModal.name} className="w-full h-full object-cover" />
            </div>

            {/* Description & Key Benefits */}
            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">{selectedProductModal.description}</p>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Key Salon Benefits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProductModal.benefits.map((b, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step How to Use Instructions */}
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-amber-400" /> Stylist Application Ritual & Instructions
                </h4>
                <div className="space-y-2">
                  {selectedProductModal.usageInstructions.map((step) => (
                    <div key={step.stepNumber} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                          {step.stepNumber}
                        </span>
                        <span className="font-bold text-slate-200">{step.title}</span>
                      </div>
                      <p className="text-slate-400 pl-7">{step.instruction}</p>
                      {step.stylistTip && (
                        <p className="text-amber-400 text-[11px] pl-7 italic">
                          💡 Stylist Tip: {step.stylistTip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Salon Pairing */}
              {selectedProductModal.recommendedServicePairing && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase block">Recommended Salon Pairing</span>
                    <span className="font-bold text-white block">{selectedProductModal.recommendedServicePairing.serviceName}</span>
                    <span className="text-slate-400 text-[11px]">{selectedProductModal.recommendedServicePairing.pairingReason}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 line-through block">MRP: ₹{selectedProductModal.mrp}</span>
                <span className="text-xl font-black text-amber-400 font-mono">₹{selectedProductModal.price.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProductModal(null)}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProductModal, 1);
                    setSelectedProductModal(null);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP-UP MODAL */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" /> Recharge Guest Wallet
              </h3>
              <button onClick={() => setTopUpModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-slate-400">Get an instant 10% promotional bonus credit on all top-ups today.</p>
            <div className="grid grid-cols-3 gap-2">
              {[1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`p-3 rounded-xl border text-center transition ${
                    topUpAmount === amt ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  <span className="text-xs block">₹{amt.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] opacity-80">+₹{Math.round(amt * 0.1)} Free</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const bonus = Math.round(topUpAmount * 0.1);
                setGuest((prev) => ({ ...prev, walletBalance: prev.walletBalance + topUpAmount + bonus }));
                showToast(`Wallet credited with ₹${topUpAmount} + ₹${bonus} bonus!`);
                setTopUpModalOpen(false);
              }}
              className="w-full bg-emerald-500 text-slate-950 font-bold py-3.5 rounded-2xl text-xs shadow-lg"
            >
              Confirm Recharge (₹{topUpAmount})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
