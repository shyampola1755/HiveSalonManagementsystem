import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import {
  RetailProduct,
  RetailCategory,
  RetailOrder,
  CreateRetailOrderDto,
  OrderStatus,
  StockValidationItem,
  StockValidationResult,
  DeliveryProviderEstimate,
  OmnichannelCustomerTimelineEvent,
  OrderStatusHistoryItem,
} from '@hive/types';
import { DeliveryService } from './delivery/delivery.service';

@Injectable()
export class EcommerceService {
  private readonly logger = new Logger(EcommerceService.name);

  // In-memory persistent demo database for Phase 15
  private categories: RetailCategory[] = [
    {
      id: 'cat-haircare',
      name: 'Hair Care & Cleansing',
      slug: 'hair-care',
      description: 'Luxury salon-grade shampoos, conditioners, and reparative bond-building baths.',
      icon: 'Scissors',
      productCount: 4,
    },
    {
      id: 'cat-styling',
      name: 'Styling & Thermal Protection',
      slug: 'styling-protection',
      description: 'Heat shields, argan oil serums, blow-dry primers, and finishing gloss sprays.',
      icon: 'Sparkles',
      productCount: 3,
    },
    {
      id: 'cat-scalp',
      name: 'Scalp Therapy & Trichology',
      slug: 'scalp-trichology',
      description: 'Dermatologist-formulated scrubs, micro-exfoliants, and follicle energizers.',
      icon: 'Droplets',
      productCount: 2,
    },
    {
      id: 'cat-skin',
      name: 'Aesthetics & Dermal Care',
      slug: 'skin-aesthetics',
      description: 'Hyaluronic acid serums, vitamin C illuminators, and anti-aging retinols.',
      icon: 'ShieldCheck',
      productCount: 2,
    },
    {
      id: 'cat-tools',
      name: 'Luxury Styling Appliances',
      slug: 'luxury-tools',
      description: 'Professional ionic dryers, intelligent straighteners, and airflow wands.',
      icon: 'Sparkle',
      productCount: 1,
    },
  ];

  private products: RetailProduct[] = [
    {
      id: 'prod-olaplex-3',
      organizationId: 'org_hive_demo',
      categoryId: 'cat-haircare',
      categoryName: 'Hair Care & Cleansing',
      name: 'Olaplex No. 3 Hair Perfector (Bond Multiplier)',
      sku: 'OLP-BOND-003',
      barcode: '896457000147',
      brand: 'Olaplex Professional',
      price: 2950.0,
      mrp: 3400.0,
      discountPercentage: 13,
      taxRate: 18.0,
      shortDescription: 'Global #1 bond-repair treatment that visibly repairs broken disulphide bonds caused by chemical, thermal, and mechanical damage.',
      description: 'Olaplex No. 3 Hair Perfector is a concentrated pre-shampoo treatment that strengthens hair from within, reducing breakage and improving look and feel. Formulated with patented Bis-Aminopropyl Diglycol Dimaleate bond-building chemistry, it restores compromised bonds for immediate soft, lustrous vitality.',
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
          stylistTip: 'Do not apply to dry or soaking wet hair; towel-dry thoroughly first for optimal penetration.',
        },
        {
          stepNumber: 2,
          title: 'Comb & Process',
          instruction: 'Comb through thoroughly with a wide-tooth detangling comb and leave on for a minimum of 10–20 minutes.',
          stylistTip: 'For severely distressed hair post-balayage, wrap in a warm damp towel for 30 minutes.',
        },
        {
          stepNumber: 3,
          title: 'Rinse & Shampoo',
          instruction: 'Rinse thoroughly, followed by Olaplex No. 4 Bond Maintenance Shampoo and No. 5 Conditioner.',
          stylistTip: 'Always follow with shampoo and conditioner; No. 3 is a bond builder, not a conditioning mask.',
        },
      ],
      ingredients: ['Water (Aqua)', 'Bis-Aminopropyl Diglycol Dimaleate', 'Propylene Glycol', 'Cetearyl Alcohol', 'Ascorbic Acid (Vitamin C)', 'Tocopheryl Acetate (Vitamin E)', 'Aloe Barbadensis Leaf Juice'],
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
      hairOrSkinTarget: ['Color-Treated', 'Bleached / Highlighted', 'Heat-Damaged', 'Fine to Coarse'],
      recommendedServicePairing: {
        serviceId: 'srv-balayage-01',
        serviceName: 'Balayage Gloss & Moroccan Ritual',
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
          branchName: 'Hive Jubilee Hills Flagship',
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
      ingredients: ['Cyclomethicone', 'Dimethicone', 'Argania Spinosa (Argan) Kernel Oil', 'Fragrance (Parfum)', 'Linum Usitatissimum (Linseed) Seed Extract', 'CI 26100 (Red 17)', 'CI 47000 (Yellow 11)'],
      volumeSize: '100 ml',
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-006240d96d92?auto=format&fit=crop&w=800&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1608248597359-006240d96d92?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80',
      ],
      rating: 4.95,
      reviewCount: 512,
      isFeatured: true,
      isBestSeller: true,
      isOrganicOrVegan: false,
      isSulfateFree: true,
      hairOrSkinTarget: ['Frizzy Hair', 'Dry Ends', 'Medium to Thick Hair', 'All Hair Lengths'],
      recommendedServicePairing: {
        serviceId: 'srv-blowdry-02',
        serviceName: 'Moroccan Royal Silk Blowdry',
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
          branchName: 'Hive Jubilee Hills Flagship',
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
      description: 'Kérastase Chronologiste Pré-Cleanse Régénérant is a purifying pre-shampoo scrub that detoxifies the scalp and roots. Infused with natural active black charcoal, hyaluronic acid, and abyssine, it removes up to 96% more pollution particles and impurities than a conventional shampoo while providing long-lasting hydration.',
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
          title: 'Massage in Circular Motion',
          instruction: 'Gently massage with fingertips for 2–3 minutes to activate microcirculation.',
          stylistTip: 'Emulsify with a splash of warm water to transform the black gel into a fine lather.',
        },
        {
          stepNumber: 3,
          title: 'Rinse Thoroughly',
          instruction: 'Rinse completely and follow with Chronologiste Bain Régénérant Shampoo.',
          stylistTip: 'Use once or twice weekly as a trichological detox ritual.',
        },
      ],
      ingredients: ['Aqua (Water)', 'Sodium Laureth Sulfate', 'Cocamidopropyl Betaine', 'Charcoal Powder', 'Sodium Hyaluronate', 'Alteromonas Ferment Extract (Abyssine)', 'Citric Acid'],
      volumeSize: '200 ml',
      imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
      ],
      rating: 4.88,
      reviewCount: 196,
      isFeatured: true,
      isBestSeller: false,
      isOrganicOrVegan: false,
      isSulfateFree: false,
      hairOrSkinTarget: ['Oily / Congested Scalp', 'Product Buildup', 'Tired Scalp', 'Aging Roots'],
      recommendedServicePairing: {
        serviceId: 'srv-scalp-spa-03',
        serviceName: 'Dermal Infusion Scalp Detox Spa',
        pairingReason: 'Weekly home maintenance to sustain the clinical scalp detoxification results.',
      },
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
          branchName: 'Hive Jubilee Hills Flagship',
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
      categoryName: 'Hair Care & Cleansing',
      name: "L'Oréal Professionnel Absolut Repair Gold Quinoa Mask",
      sku: 'LOR-ABS-250',
      barcode: '30164849',
      brand: "L'Oréal Professionnel",
      price: 1950.0,
      mrp: 2300.0,
      discountPercentage: 15,
      taxRate: 18.0,
      shortDescription: 'Golden resurfacing restorative mask enriched with Gold Quinoa Protein for 7x shinier and 77% less damaged hair without weighing hair down.',
      description: 'Absolut Repair Mask offers the ultimate professional deep repair experience for damaged and dry hair. The golden buttery formula infused with Gold Quinoa + Wheat Protein instantly resurfaces hair fibers with a lightweight touch, leaving hair softer and shinier.',
      benefits: [
        'Resurfaces dry & damaged hair cuticle with Gold Quinoa protein',
        'Provides 7x more shine and 77% surface damage reduction',
        'Zero weigh-down on fine to medium hair textures',
        'Lightweight buttery golden texture with salon floral notes',
      ],
      usageInstructions: [
        {
          stepNumber: 1,
          title: 'Apply to Washed Hair',
          instruction: 'After shampooing with Absolut Repair Shampoo, apply to towel-dried hair.',
          stylistTip: 'Squeeze excess water before applying so mask is not diluted.',
        },
        {
          stepNumber: 2,
          title: 'Distribute & Wait 3-5 Mins',
          instruction: 'Distribute evenly through lengths and ends. Leave on for 3 to 5 minutes.',
          stylistTip: 'Use a wide-tooth comb to ensure every strand is coated.',
        },
        {
          stepNumber: 3,
          title: 'Rinse Clean',
          instruction: 'Rinse thoroughly with cool water to lock in cuticle shine.',
          stylistTip: 'Use twice weekly for optimal restorative effects.',
        },
      ],
      ingredients: ['Aqua / Water', 'Cetearyl Alcohol', 'Behentrimonium Chloride', 'Candelilla Cera', 'Chenopodium Quinoa Seed Extract', 'Hydrolyzed Wheat Protein', 'Phenoxyethanol'],
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
      hairOrSkinTarget: ['Damaged Hair', 'Dry Hair', 'Brittle Ends', 'Chemically Processed'],
      recommendedServicePairing: {
        serviceId: 'srv-spa-01',
        serviceName: 'L’Oréal Absolut Molecular Repair Spa',
        pairingReason: 'Home continuation treatment following our in-salon molecular infusion.',
      },
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
          branchName: 'Hive Jubilee Hills Flagship',
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
      description: 'A patented daytime vitamin C serum that delivers advanced environmental protection and improves the appearance of fine lines, wrinkles, and loss of firmness while brightening skin complexion. Formulated with 15% pure L-ascorbic acid (Vitamin C), 1% alpha-tocopherol (Vitamin E), and 0.5% ferulic acid.',
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
          instruction: 'In the morning after cleansing and toning, apply 4–5 drops to a dry face, neck, and chest.',
          stylistTip: 'Drop directly from pipette onto fingertips to prevent waste.',
        },
        {
          stepNumber: 2,
          title: 'Press & Absorb',
          instruction: 'Gently press into skin using upward smoothing motions until fully absorbed.',
          stylistTip: 'Allow 1 minute for full absorption before applying moisturizers.',
        },
        {
          stepNumber: 3,
          title: 'Follow with SPF',
          instruction: 'Complete your regimen with a broad-spectrum sunscreen like SkinCeuticals Ultra Defense SPF 50.',
          stylistTip: 'Vitamin C paired with SPF provides double shielding against UV hyperpigmentation.',
        },
      ],
      ingredients: ['Aqua / Water', 'Ethoxydiglycol', 'L-Ascorbic Acid (15%)', 'Propylene Glycol', 'Glycerin', 'Laureth-23', 'Alpha Tocopherol (1%)', 'Ferulic Acid (0.5%)', 'Panthenol'],
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
        serviceId: 'srv-hydra-01',
        serviceName: 'Hydra-Infusion Glow Dermal Facial',
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
          branchName: 'Hive Jubilee Hills Flagship',
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
      shortDescription: 'Engineered for salon professionals with intelligent heat control, digital V9 motor, and 5 magnetic styling attachments including Flyaway tool.',
      description: 'The Dyson Supersonic™ Professional hair dryer is engineered for high-demand salon environments. With a powerful Dyson digital motor V9 and intelligent heat control that measures airflow temperature over 40 times per second, it protects hair from extreme heat damage while delivering ultra-fast drying and smooth styling.',
      benefits: [
        'Intelligent Heat Control prevents extreme heat damage to preserve natural keratin shine',
        'Air Multiplier™ technology produces high-pressure, high-velocity jet of controlled air',
        'Acoustically tuned motor operates with low salon vibration',
        'Includes 5 professional magnetic attachments: Flyaway, Styling Concentrator, Diffuser, Gentle Air, Wide-Tooth Comb',
      ],
      usageInstructions: [
        {
          stepNumber: 1,
          title: 'Select Heat & Speed Setting',
          instruction: 'Choose from 3 precise speed settings (High, Medium, Low) and 4 heat settings (100°C fast drying, 80°C regular, 60°C gentle, 28°C cold shot).',
          stylistTip: 'Use cold shot button for 10 seconds at the end of blowdry to seal the cuticle.',
        },
        {
          stepNumber: 2,
          title: 'Snap Magnetic Attachment',
          instruction: 'Snap on the 360° rotating magnetic nozzle suitable for your desired texture.',
          stylistTip: 'The Flyaway attachment hides flyaways under longer hair for a sleek salon-smooth finish.',
        },
        {
          stepNumber: 3,
          title: 'Style & Maintain',
          instruction: 'Dry hair in sections from roots to ends. Wash removable magnetic filter once monthly.',
          stylistTip: 'Clean the filter cage with a lint-free cloth when the LED indicator blinks.',
        },
      ],
      ingredients: ['Acoustic Polycarbonate Body', 'Digital Motor V9 Core', 'Ceramic Heating Grid', 'Magnetic Stainless Steel Filter'],
      volumeSize: 'Complete Professional Tool Kit',
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
      hairOrSkinTarget: ['All Hair Types', 'Precision Styling', 'Zero Heat Damage', 'High Volume'],
      recommendedServicePairing: {
        serviceId: 'srv-cut-01',
        serviceName: 'Couture Haircut & Moroccan Finish',
        pairingReason: 'The exact professional drying tool used by our master stylists.',
      },
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
          branchName: 'Hive Jubilee Hills Flagship',
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

  private orders: RetailOrder[] = [
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
      pickupBranchName: 'Hive Indiranagar Flagship',
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
          description: 'Products verified with barcode scan, sealed with Hive tamper-proof luxury gold ribbon.',
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
      transactionReference: 'CARD-AUTH-881920',
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
          id: 'sh-11',
          status: 'CONFIRMED',
          timestamp: '2026-08-18T09:00:00Z',
          title: 'Confirmed by Dispatch Hub',
          description: 'Order confirmed and scheduled for packaging.',
        },
        {
          id: 'sh-12',
          status: 'PACKED',
          timestamp: '2026-08-18T11:30:00Z',
          title: 'Package Sealed & Barcoded',
          description: 'Delhivery shipping label AWB DLV8910294812 attached.',
        },
        {
          id: 'sh-13',
          status: 'OUT_FOR_DELIVERY',
          timestamp: '2026-08-20T09:15:00Z',
          title: 'Out for Delivery with Courier',
          description: 'Delhivery courier on route to Jubilee Hills.',
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

  constructor(private readonly deliveryService: DeliveryService) {}

  // ---------------------------------------------------------------------------
  // 1. PRODUCTS & STOREFRONT CATALOG
  // ---------------------------------------------------------------------------

  async getAllProducts(filters?: {
    categoryId?: string;
    brand?: string;
    search?: string;
    inStockOnly?: boolean;
    branchId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'featured' | 'bestseller' | 'price_asc' | 'price_desc' | 'rating';
  }): Promise<RetailProduct[]> {
    let result = [...this.products];

    if (filters?.categoryId && filters.categoryId !== 'ALL') {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters?.brand && filters.brand !== 'ALL') {
      result = result.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.benefits.some((b) => b.toLowerCase().includes(q)) ||
          p.hairOrSkinTarget.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= (filters.minPrice || 0));
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= (filters.maxPrice || Infinity));
    }

    if (filters?.inStockOnly) {
      if (filters.branchId) {
        result = result.filter((p) => {
          const bStock = p.branchStockMatrix[filters.branchId!];
          return bStock && bStock.availableStock > 0;
        });
      } else {
        result = result.filter((p) => p.totalAvailableStock > 0);
      }
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'bestseller':
          result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
          break;
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // featured
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return result;
  }

  async getProductById(id: string): Promise<RetailProduct> {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found in retail catalog.`);
    }
    return product;
  }

  async getAllCategories(): Promise<RetailCategory[]> {
    return this.categories.map((c) => ({
      ...c,
      productCount: this.products.filter((p) => p.categoryId === c.id).length,
    }));
  }

  // ---------------------------------------------------------------------------
  // 2. INVENTORY VALIDATION & NEVER-OVERSELL ENGINE
  // ---------------------------------------------------------------------------

  async validateStock(items: StockValidationItem[]): Promise<StockValidationResult> {
    const oversoldItems: StockValidationResult['oversoldItems'] = [];

    for (const item of items) {
      const product = this.products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found.`);
      }

      const branchStock = product.branchStockMatrix[item.branchId];
      const available = branchStock ? branchStock.availableStock : product.totalAvailableStock;

      if (available < item.requestedQuantity) {
        oversoldItems.push({
          productId: product.id,
          productName: product.name,
          branchId: item.branchId,
          branchName: branchStock ? branchStock.branchName : 'Central Hub',
          requestedQuantity: item.requestedQuantity,
          availableStock: Math.max(0, available),
        });
      }
    }

    return {
      isValid: oversoldItems.length === 0,
      oversoldItems,
    };
  }

  // ---------------------------------------------------------------------------
  // 3. CHECKOUT & ORDER CREATION (ATOMIC INVENTORY RESERVATION)
  // ---------------------------------------------------------------------------

  async createOrder(dto: CreateRetailOrderDto): Promise<RetailOrder> {
    // 1. Strict Stock Validation before any order creation
    const validationItems: StockValidationItem[] = dto.items.map((i) => ({
      productId: i.productId,
      requestedQuantity: i.quantity,
      branchId: i.selectedBranchId || dto.pickupBranchId || 'branch-indiranagar',
    }));

    const stockCheck = await this.validateStock(validationItems);
    if (!stockCheck.isValid) {
      const item = stockCheck.oversoldItems[0];
      throw new BadRequestException(
        `Insufficient inventory for "${item.productName}". Requested ${item.requestedQuantity} units, but only ${item.availableStock} available at ${item.branchName}. Never overselling stock.`
      );
    }

    // 2. Construct Order Line Items & Compute Financials
    const orderId = `ord-${Date.now().toString().slice(-6)}`;
    const orderNumber = `HIVE-ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    let subtotal = 0;
    let taxTotal = 0;
    const orderItems = dto.items.map((i, idx) => {
      const product = this.products.find((p) => p.id === i.productId)!;
      const itemTotalPrice = product.price * i.quantity;
      const itemTax = Math.round((itemTotalPrice * (product.taxRate / 100)) / (1 + product.taxRate / 100) * 100) / 100;
      subtotal += itemTotalPrice - itemTax;
      taxTotal += itemTax;

      // 3. Atomic stock reservation (Never oversell)
      const branchId = i.selectedBranchId || dto.pickupBranchId || 'branch-indiranagar';
      if (product.branchStockMatrix[branchId]) {
        product.branchStockMatrix[branchId].reservedStock += i.quantity;
        product.branchStockMatrix[branchId].availableStock -= i.quantity;
        product.totalAvailableStock -= i.quantity;
      }

      return {
        id: `item-${Date.now()}-${idx}`,
        orderId,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        productBrand: product.brand,
        productImageUrl: product.imageUrl,
        volumeSize: product.volumeSize,
        quantity: i.quantity,
        unitPrice: product.price,
        mrp: product.mrp,
        taxRate: product.taxRate,
        taxAmount: itemTax,
        totalPrice: itemTotalPrice,
      };
    });

    const deliveryFee = dto.fulfillmentType === 'BRANCH_PICKUP' ? 0.0 : (dto.deliveryProviderId === 'DUNZO' ? 199.0 : 99.0);
    const couponDiscount = dto.couponCode ? 300.0 : 0.0;
    const loyaltyDiscount = dto.loyaltyPointsToRedeem ? dto.loyaltyPointsToRedeem * 1.0 : 0.0;
    const walletDebit = dto.walletDeductionAmount || 0.0;
    const grandTotal = Math.max(0, subtotal + taxTotal + deliveryFee - couponDiscount - loyaltyDiscount);
    const finalPaidAmount = Math.max(0, grandTotal - walletDebit);

    // 4. Generate Branch Pickup OTP or Carrier Shipment Data
    const pickupOtp = dto.fulfillmentType === 'BRANCH_PICKUP' ? Math.floor(1000 + Math.random() * 9000).toString() : undefined;
    const pickupQrUrl = pickupOtp
      ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${orderNumber}-OTP-${pickupOtp}`
      : undefined;

    let deliveryProviderName: string | undefined;
    let trackingNumber: string | undefined;
    let trackingUrl: string | undefined;

    if (dto.fulfillmentType === 'HOME_DELIVERY' && dto.deliveryProviderId) {
      const provider = this.deliveryService.getProvider(dto.deliveryProviderId);
      deliveryProviderName = provider.name;
      const shipment = await this.deliveryService.createShipment({
        orderId,
        providerId: dto.deliveryProviderId,
        pickupBranchId: dto.pickupBranchId || 'branch-indiranagar',
        shippingAddress: dto.shippingAddress!,
        weightKg: 0.8,
      });
      trackingNumber = shipment.trackingNumber;
      trackingUrl = shipment.trackingUrl;
    }

    const nowIso = new Date().toISOString();
    const initialHistory: OrderStatusHistoryItem[] = [
      {
        id: `sh-${Date.now()}`,
        status: 'PLACED',
        timestamp: nowIso,
        title: 'Order Placed Successfully',
        description: `Order created via ${dto.fulfillmentType === 'BRANCH_PICKUP' ? 'Branch In-Store Pickup' : 'Home Delivery'}. Inventory strictly reserved.`,
        updatedBy: `${dto.customerName} (Customer)`,
      },
    ];

    const newOrder: RetailOrder = {
      id: orderId,
      orderNumber,
      organizationId: dto.organizationId || 'org_hive_demo',
      customerId: dto.customerId,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      customerEmail: dto.customerEmail || null,
      fulfillmentType: dto.fulfillmentType,
      pickupBranchId: dto.pickupBranchId || (dto.fulfillmentType === 'BRANCH_PICKUP' ? 'branch-indiranagar' : null),
      pickupBranchName: dto.pickupBranchId === 'branch-koramangala' ? 'Hive Koramangala Lounge' : 'Hive Indiranagar Flagship',
      pickupBranchAddress: '100ft Road, 12th Main, HAL 2nd Stage, Indiranagar',
      pickupBranchPhone: '+91 80 4123 8899',
      pickupDate: dto.pickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickupSlot: dto.pickupSlot || '11:00 AM – 02:00 PM',
      pickupOtp: pickupOtp || null,
      pickupQrCodeUrl: pickupQrUrl || null,
      readyForPickupAt: null,
      collectedAt: null,
      shippingAddress: dto.shippingAddress || null,
      deliveryProvider: dto.deliveryProviderId || null,
      deliveryProviderName: deliveryProviderName || null,
      trackingNumber: trackingNumber || null,
      trackingUrl: trackingUrl || null,
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      dispatchedAt: null,
      deliveredAt: null,
      deliveryCheckpoints: [],
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxTotal: Math.round(taxTotal * 100) / 100,
      discountTotal: couponDiscount + loyaltyDiscount,
      couponCode: dto.couponCode || null,
      couponDiscount,
      loyaltyPointsRedeemed: dto.loyaltyPointsToRedeem || 0,
      loyaltyDiscountAmount: loyaltyDiscount,
      walletDebitedAmount: walletDebit,
      deliveryFee,
      grandTotal: Math.round(grandTotal * 100) / 100,
      finalPaidAmount: Math.round(finalPaidAmount * 100) / 100,
      paymentStatus: 'PAID',
      paymentMethod: dto.paymentMethod,
      transactionReference: `TXN-${Date.now()}`,
      status: 'PLACED',
      statusHistory: initialHistory,
      notes: dto.notes || null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.orders.unshift(newOrder);
    this.logger.log(`Created retail order ${orderNumber} for customer ${dto.customerName}`);
    return newOrder;
  }

  // ---------------------------------------------------------------------------
  // 4. ORDER STATUS TRANSITIONS (8-STAGE LIFECYCLE & RESTOCKING)
  // ---------------------------------------------------------------------------

  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    updatedBy = 'Salon Dispatch Manager'
  ): Promise<RetailOrder> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }

    const prevStatus = order.status;
    order.status = newStatus;
    const nowIso = new Date().toISOString();

    let title = `Status Updated: ${newStatus}`;
    let description = note || `Order transitioned from ${prevStatus} to ${newStatus}.`;

    if (newStatus === 'CONFIRMED') {
      title = 'Order Confirmed by Salon';
      description = description || 'Branch team approved order for packing.';
    } else if (newStatus === 'PACKED') {
      title = 'Order Packed in Luxury Tote';
      description = description || 'Items packed, barcode checked, and packing slip generated.';
      order.packingSlipGeneratedAt = nowIso;
    } else if (newStatus === 'READY_FOR_PICKUP') {
      title = 'Ready for Branch Pickup';
      description = description || `Order is placed at front desk. Verification OTP: ${order.pickupOtp}.`;
      order.readyForPickupAt = nowIso;
    } else if (newStatus === 'OUT_FOR_DELIVERY') {
      title = 'Out for Delivery with Carrier';
      description = description || `Handed over to ${order.deliveryProviderName || 'Courier Partner'}. Tracking: ${order.trackingNumber}.`;
      order.dispatchedAt = nowIso;
    } else if (newStatus === 'DELIVERED') {
      title = order.fulfillmentType === 'BRANCH_PICKUP' ? 'Collected by Guest at Branch' : 'Delivered to Customer Doorstep';
      description = description || 'Order successfully fulfilled and handed over to guest.';
      order.deliveredAt = nowIso;
      if (order.fulfillmentType === 'BRANCH_PICKUP') {
        order.collectedAt = nowIso;
      }

      // Decrement physical stock permanently on delivery (releasing reservation)
      for (const item of order.items) {
        const product = this.products.find((p) => p.id === item.productId);
        const branchId = order.pickupBranchId || 'branch-indiranagar';
        if (product && product.branchStockMatrix[branchId]) {
          product.branchStockMatrix[branchId].currentStock -= item.quantity;
          product.branchStockMatrix[branchId].reservedStock = Math.max(
            0,
            product.branchStockMatrix[branchId].reservedStock - item.quantity
          );
        }
      }
    } else if (newStatus === 'CANCELLED' || newStatus === 'RETURNED') {
      title = newStatus === 'CANCELLED' ? 'Order Cancelled' : 'Order Returned & Restocked';
      description = description || 'Inventory reservations released back to physical available stock.';
      order.paymentStatus = 'REFUNDED';

      // Release reserved stock back into available stock
      for (const item of order.items) {
        const product = this.products.find((p) => p.id === item.productId);
        const branchId = order.pickupBranchId || 'branch-indiranagar';
        if (product && product.branchStockMatrix[branchId]) {
          if (prevStatus !== 'DELIVERED') {
            product.branchStockMatrix[branchId].reservedStock = Math.max(
              0,
              product.branchStockMatrix[branchId].reservedStock - item.quantity
            );
            product.branchStockMatrix[branchId].availableStock += item.quantity;
            product.totalAvailableStock += item.quantity;
          } else {
            // Returned: restock to current stock
            product.branchStockMatrix[branchId].currentStock += item.quantity;
            product.branchStockMatrix[branchId].availableStock += item.quantity;
            product.totalAvailableStock += item.quantity;
          }
        }
      }
    }

    order.statusHistory.unshift({
      id: `sh-${Date.now()}`,
      status: newStatus,
      timestamp: nowIso,
      title,
      description,
      updatedBy,
    });

    order.updatedAt = nowIso;
    this.logger.log(`Order ${order.orderNumber} updated to ${newStatus}`);
    return order;
  }

  // ---------------------------------------------------------------------------
  // 5. BRANCH PICKUP OTP VERIFICATION
  // ---------------------------------------------------------------------------

  async verifyPickupOtp(orderId: string, otp: string, staffName = 'Front Desk Receptionist'): Promise<{
    success: boolean;
    order: RetailOrder;
    message: string;
  }> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }

    if (order.fulfillmentType !== 'BRANCH_PICKUP') {
      throw new BadRequestException('This order is for Home Delivery, not Branch Pickup.');
    }

    if (order.pickupOtp !== otp.trim()) {
      throw new BadRequestException(`Invalid Pickup OTP. Please check the 4-digit code in the customer's portal.`);
    }

    const updated = await this.updateOrderStatus(
      orderId,
      'DELIVERED',
      `4-Digit OTP ${otp} verified successfully at reception desk by ${staffName}. Order handed over to ${order.customerName}.`,
      staffName
    );

    return {
      success: true,
      order: updated,
      message: `Pickup verified! Handover completed for order ${order.orderNumber}.`,
    };
  }

  // ---------------------------------------------------------------------------
  // 6. ORDER LOOKUP & LISTING
  // ---------------------------------------------------------------------------

  async getOrders(filters?: {
    customerId?: string;
    status?: OrderStatus | 'ALL';
    fulfillmentType?: string;
    branchId?: string;
    search?: string;
  }): Promise<RetailOrder[]> {
    let result = [...this.orders];

    if (filters?.customerId) {
      result = result.filter((o) => o.customerId === filters.customerId);
    }

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((o) => o.status === filters.status);
    }

    if (filters?.fulfillmentType && filters.fulfillmentType !== 'ALL') {
      result = result.filter((o) => o.fulfillmentType === filters.fulfillmentType);
    }

    if (filters?.branchId && filters.branchId !== 'ALL') {
      result = result.filter((o) => o.pickupBranchId === filters.branchId);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.items.some((i) => i.productName.toLowerCase().includes(q))
      );
    }

    return result;
  }

  async getOrderById(id: string): Promise<RetailOrder> {
    const order = this.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) {
      throw new NotFoundException(`Order with identifier ${id} not found.`);
    }
    return order;
  }

  // ---------------------------------------------------------------------------
  // 7. OMNICHANNEL CUSTOMER TIMELINE AGGREGATOR
  // ---------------------------------------------------------------------------

  async getOmnichannelCustomerHistory(customerId: string): Promise<OmnichannelCustomerTimelineEvent[]> {
    const events: OmnichannelCustomerTimelineEvent[] = [];

    // 1. Online Purchases
    const customerOrders = this.orders.filter((o) => o.customerId === customerId);
    for (const ord of customerOrders) {
      const itemsList = ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ');
      events.push({
        id: `ev-ord-${ord.id}`,
        customerId,
        channel: 'ONLINE_ORDER',
        eventType: `ONLINE_ORDER_${ord.status}`,
        title: `Online Retail Order #${ord.orderNumber}`,
        description: `${ord.fulfillmentType === 'BRANCH_PICKUP' ? 'In-Store Branch Pickup' : 'Home Delivery'} (${itemsList}) • Status: ${ord.status}`,
        referenceId: ord.orderNumber,
        amount: ord.grandTotal,
        status: ord.status,
        branchName: ord.pickupBranchName || 'Online Sanctuary Store',
        itemsSummary: itemsList,
        occurredAt: ord.createdAt,
      });
    }

    // 2. Mock POS In-Salon Purchases
    events.push({
      id: 'ev-pos-391',
      customerId,
      channel: 'POS_PURCHASE',
      eventType: 'POS_RETAIL_PURCHASE',
      title: 'In-Salon POS Invoice #HIVE-HYD-0391',
      description: 'Counter checkout: Balayage Gloss & Moroccan Blowdry + Olaplex No. 4 Shampoo retail bottle.',
      referenceId: 'HIVE-HYD-0391',
      amount: 4850.0,
      status: 'PAID',
      branchName: 'Jubilee Hills Flagship',
      itemsSummary: 'Moroccan Blowdry + Olaplex No. 4 Shampoo (250ml)',
      occurredAt: '2026-08-15T12:30:00Z',
    });

    // 3. Mock In-Salon Services
    events.push({
      id: 'ev-srv-apt1',
      customerId,
      channel: 'SALON_SERVICE',
      eventType: 'APPOINTMENT_COMPLETED',
      title: 'Salon Service: Sun-Kissed Balayage & Gloss',
      description: 'Completed 120m styling ritual with Senior Stylist Ananya Reddy. Color formula logged.',
      referenceId: 'APT-20260815-001',
      amount: 4500.0,
      status: 'COMPLETED',
      branchName: 'Jubilee Hills Flagship',
      itemsSummary: 'Balayage Lightening + Dia Richesse 7.13 Gloss',
      occurredAt: '2026-08-15T10:00:00Z',
    });

    events.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
    return events;
  }
}
