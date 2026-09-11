'use client';

import * as React from 'react';
import {
  PageHeader,
  Search,
  Button,
  Badge,
  Modal,
  Input,
  useToast,
} from '@hive/ui';
import {
  Plus,
  Sparkles,
  Scissors,
  Clock,
  IndianRupee,
  Building2,
  Users,
  Eye,
  Edit2,
  Trash2,
  Tag,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Layers,
  Settings,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Sliders,
  ShieldCheck,
  FileText,
  Calendar,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import { STANDARD_SERVICE_CATEGORIES } from '@hive/config';
import type {
  ServiceItem,
  ServiceCategoryItem,
  ServiceBranchPrice,
  ServiceStaffEligibilityItem,
  ServiceAddonItem,
} from '@hive/types';

// Initial Mock Seed Data representing full multi-branch salon catalog
const initialCategories: ServiceCategoryItem[] = [
  { id: 'cat-1', name: 'Hair', code: 'HAIR', description: 'Cuts, styling, blowouts and beard trims', displayOrder: 1, isActive: true },
  { id: 'cat-2', name: 'Hair Color', code: 'HAIR_COLOR', description: 'Global coloring, balayage, highlights and root touch-up', displayOrder: 2, isActive: true },
  { id: 'cat-3', name: 'Hair Treatment', code: 'HAIR_TREATMENT', description: 'Keratin, cysteine, botox and deep conditioning spas', displayOrder: 3, isActive: true },
  { id: 'cat-4', name: 'Facial', code: 'FACIAL', description: 'Hydra-facials, organic glow, anti-aging & cleanup', displayOrder: 4, isActive: true },
  { id: 'cat-5', name: 'Skin', code: 'SKIN', description: 'Derma peels, skin brightening, acne therapy & de-tan', displayOrder: 5, isActive: true },
  { id: 'cat-6', name: 'Spa', code: 'SPA', description: 'Full body scrubs, wraps, aromatic relaxation baths', displayOrder: 6, isActive: true },
  { id: 'cat-7', name: 'Massage', code: 'MASSAGE', description: 'Swedish, deep tissue, hot stone & Balinese therapies', displayOrder: 7, isActive: true },
  { id: 'cat-8', name: 'Nails', code: 'NAILS', description: 'Gel extensions, acrylic art, express manicure & pedicure', displayOrder: 8, isActive: true },
  { id: 'cat-9', name: 'Makeup', code: 'MAKEUP', description: 'Party makeup, HD airbrush, editorial & glam sessions', displayOrder: 9, isActive: true },
  { id: 'cat-10', name: 'Bridal', code: 'BRIDAL', description: 'Complete bridal packages, groom styling & pre-wedding ritual', displayOrder: 10, isActive: true },
  { id: 'cat-11', name: 'Tattoo', code: 'TATTOO', description: 'Custom ink, microblading & cosmetic pigmentation', displayOrder: 11, isActive: true },
  { id: 'cat-12', name: 'Aesthetic', code: 'AESTHETIC', description: 'Laser hair reduction, HIFU sculpting & aesthetic consultations', displayOrder: 12, isActive: true },
  { id: 'cat-13', name: 'Wellness', code: 'WELLNESS', description: 'Detox, reflexology, scalp stimulation & holistic therapies', displayOrder: 13, isActive: true },
  { id: 'cat-14', name: 'Other', code: 'OTHER', description: 'Miscellaneous custom salon & spa experiences', displayOrder: 14, isActive: true },
];

const branchesList = [
  { id: 'br-jubilee', name: 'Jubilee Hills Flagship', code: 'HYD-JUB-01', city: 'Hyderabad', tier: 'Tier 1 Luxury' },
  { id: 'br-banjara', name: 'Banjara Hills Premium', code: 'HYD-BAN-02', city: 'Hyderabad', tier: 'Tier 1 Premium' },
  { id: 'br-hitech', name: 'Hitech City Studio', code: 'HYD-HIT-03', city: 'Hyderabad', tier: 'Tier 2 Studio' },
  { id: 'br-gachibowli', name: 'Gachibowli Tech Park', code: 'HYD-GAC-04', city: 'Hyderabad', tier: 'Tier 2 Express' },
  { id: 'br-indiranagar', name: 'Indiranagar Prime', code: 'BLR-IND-01', city: 'Bengaluru', tier: 'Tier 1 Luxury' },
];

const staffList = [
  { id: 'st-1', name: 'Aarav Mehta', role: 'Creative Director & Master Stylist', branchName: 'Jubilee Hills Flagship' },
  { id: 'st-2', name: 'Pooja Hegde', role: 'Senior Colorist & Chemical Specialist', branchName: 'Jubilee Hills Flagship' },
  { id: 'st-3', name: 'Vikram Sethi', role: 'Senior Stylist & Barber', branchName: 'Banjara Hills Premium' },
  { id: 'st-4', name: 'Ananya Roy', role: 'Lead Aesthetician & Skin Expert', branchName: 'Jubilee Hills Flagship' },
  { id: 'st-5', name: 'David Jones', role: 'Certified Spa & Body Therapist', branchName: 'Banjara Hills Premium' },
  { id: 'st-6', name: 'Meera Nambiar', role: 'Senior Nail Artist & Extensionist', branchName: 'Hitech City Studio' },
];

const initialServices: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Signature Royal Haircut & Beard Sculpting',
    code: 'HAIR-001',
    categoryId: 'cat-1',
    categoryName: 'Hair',
    customerDescription: 'A personalized consultation, scalp rejuvenation wash, custom precision shear sculpting, hot towel finish, and botanical beard nourishing oil massage.',
    internalNotes: 'Use Kérastase Bain Satin shampoo. Check hair density and crown whorl direction before tapering. Apply Moroccan Argan oil on beard.',
    durationMinutes: 45,
    bufferMinutes: 15,
    totalSlotMinutes: 60,
    basePrice: 650,
    taxRate: 18,
    status: 'ACTIVE',
    genderTarget: 'MALE',
    onlineBookingEnabled: true,
    branchPricings: [
      { branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', price: 850, isAvailable: true },
      { branchId: 'br-banjara', branchName: 'Banjara Hills Premium', price: 750, isAvailable: true },
      { branchId: 'br-hitech', branchName: 'Hitech City Studio', price: 650, isAvailable: true },
    ],
    staffEligibilities: [
      { staffId: 'st-1', staffName: 'Aarav Mehta', role: 'Master Stylist', skillLevel: 'Master', isEligible: true },
      { staffId: 'st-3', staffName: 'Vikram Sethi', role: 'Senior Stylist', skillLevel: 'Senior', isEligible: true },
    ],
    addons: [
      { id: 'add-1', serviceId: 'srv-1', name: 'Clarifying Charcoal Scalp Scrub', description: 'Deep pore scalp detox and oil balance', price: 350, durationMinutes: 15, isActive: true },
      { id: 'add-2', serviceId: 'srv-1', name: 'Keratin Beard Smoothing Infusion', description: 'Tames coarse beard frizz for 2 weeks', price: 500, durationMinutes: 20, isActive: true },
      { id: 'add-3', serviceId: 'srv-1', name: 'Cooling Collagen Eye Mask', description: 'Relieves digital eye strain and puffiness', price: 250, durationMinutes: 10, isActive: true },
    ],
  },
  {
    id: 'srv-2',
    name: 'Balayage & Multi-Dimensional Glaze',
    code: 'COLOR-002',
    categoryId: 'cat-2',
    categoryName: 'Hair Color',
    customerDescription: 'Sun-kissed, hand-painted balayage highlights seamlessly blended with our proprietary gloss glaze for radiant reflection and zero harsh regrowth lines.',
    internalNotes: 'Patch test mandatory 24h prior. Formula: L’Oreal Blond Studio 9 + 20 Vol developer with Olaplex No.1 bond multiplier. Tone with Shades EQ 09V+09N.',
    durationMinutes: 150,
    bufferMinutes: 30,
    totalSlotMinutes: 180,
    basePrice: 5500,
    taxRate: 18,
    status: 'ACTIVE',
    genderTarget: 'ALL',
    onlineBookingEnabled: true,
    branchPricings: [
      { branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', price: 6800, isAvailable: true },
      { branchId: 'br-banjara', branchName: 'Banjara Hills Premium', price: 6200, isAvailable: true },
      { branchId: 'br-hitech', branchName: 'Hitech City Studio', price: 5500, isAvailable: true },
    ],
    staffEligibilities: [
      { staffId: 'st-1', staffName: 'Aarav Mehta', role: 'Master Stylist', skillLevel: 'Master', isEligible: true },
      { staffId: 'st-2', staffName: 'Pooja Hegde', role: 'Senior Colorist', skillLevel: 'Master', isEligible: true },
    ],
    addons: [
      { id: 'add-4', serviceId: 'srv-2', name: 'Olaplex Bond Rebuilding Treatment No. 2', description: 'Restores broken disulfide hair bonds post color', price: 1200, durationMinutes: 20, isActive: true },
      { id: 'add-5', serviceId: 'srv-2', name: 'Post-Color UV Shield & Shine Sealer', description: 'Locks color vibrancy for 30+ washes', price: 800, durationMinutes: 15, isActive: true },
    ],
  },
  {
    id: 'srv-3',
    name: 'Hydra-Oxygen Rejuvenation Medi-Facial',
    code: 'FACIAL-003',
    categoryId: 'cat-4',
    categoryName: 'Facial',
    customerDescription: 'Medical-grade hydra-dermabrasion infusing hyaluronic acid, peptides, and 98% pure pressurized oxygen for immediate glass skin glow.',
    internalNotes: 'Check skin sensitivity history. Discontinue active retinoids 48h prior. Vacuum suction level 3 for T-zone, level 2 for cheeks.',
    durationMinutes: 60,
    bufferMinutes: 15,
    totalSlotMinutes: 75,
    basePrice: 2800,
    taxRate: 18,
    status: 'ACTIVE',
    genderTarget: 'ALL',
    onlineBookingEnabled: true,
    branchPricings: [
      { branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', price: 3400, isAvailable: true },
      { branchId: 'br-banjara', branchName: 'Banjara Hills Premium', price: 3100, isAvailable: true },
      { branchId: 'br-hitech', branchName: 'Hitech City Studio', price: 2800, isAvailable: true },
    ],
    staffEligibilities: [
      { staffId: 'st-4', staffName: 'Ananya Roy', role: 'Lead Aesthetician', skillLevel: 'Senior', isEligible: true },
    ],
    addons: [
      { id: 'add-6', serviceId: 'srv-3', name: 'LED Phototherapy Boost (Red/Blue)', description: 'Stimulates cellular collagen and kills acne bacteria', price: 650, durationMinutes: 15, isActive: true },
      { id: 'add-7', serviceId: 'srv-3', name: '24K Bio-Gold Alginate Rubber Mask', description: 'Deep infusion of pure micronized colloidal gold', price: 950, durationMinutes: 20, isActive: true },
    ],
  },
  {
    id: 'srv-4',
    name: 'Balinese Aromatic Deep Tissue Body Therapy',
    code: 'SPA-004',
    categoryId: 'cat-7',
    categoryName: 'Massage',
    customerDescription: 'Ancient holistic therapy blending gentle stretches, acupressure, and warmed organic essential oils to unblock meridian energy flows and relieve chronic muscle tension.',
    internalNotes: 'Ask client about pressure preferences and spine/joint injury. Warm sesame oil blend with lemongrass & ginger to 42°C.',
    durationMinutes: 75,
    bufferMinutes: 20,
    totalSlotMinutes: 95,
    basePrice: 3200,
    taxRate: 18,
    status: 'ACTIVE',
    genderTarget: 'ALL',
    onlineBookingEnabled: true,
    branchPricings: [
      { branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', price: 3900, isAvailable: true },
      { branchId: 'br-banjara', branchName: 'Banjara Hills Premium', price: 3500, isAvailable: true },
      { branchId: 'br-hitech', branchName: 'Hitech City Studio', price: 3200, isAvailable: true },
    ],
    staffEligibilities: [
      { staffId: 'st-5', staffName: 'David Jones', role: 'Spa & Body Therapist', skillLevel: 'Master', isEligible: true },
    ],
    addons: [
      { id: 'add-8', serviceId: 'srv-4', name: 'Heated Basalt Stone Placement', description: 'Volcanic hot stones to melt deep muscle knots', price: 700, durationMinutes: 15, isActive: true },
      { id: 'add-9', serviceId: 'srv-4', name: 'Dead Sea Salt Body Polish', description: 'Exfoliates dead skin before aromatherapy massage', price: 1100, durationMinutes: 25, isActive: true },
    ],
  },
  {
    id: 'srv-5',
    name: 'Russian Gel Nail Architecture & Custom Art',
    code: 'NAIL-005',
    categoryId: 'cat-8',
    categoryName: 'Nails',
    customerDescription: 'Flawless dry e-file cuticle detailing, builder gel overlay strengthening, and bespoke hand-painted artistic finishes lasting up to 4 weeks chip-free.',
    internalNotes: 'Use diamond flame bit at 15,000 RPM. Dehydrate nail plate thoroughly with isopropanol. Cure builder gel 60s under LED lamp.',
    durationMinutes: 90,
    bufferMinutes: 15,
    totalSlotMinutes: 105,
    basePrice: 2200,
    taxRate: 18,
    status: 'ACTIVE',
    genderTarget: 'FEMALE',
    onlineBookingEnabled: true,
    branchPricings: [
      { branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', price: 2600, isAvailable: true },
      { branchId: 'br-banjara', branchName: 'Banjara Hills Premium', price: 2400, isAvailable: true },
      { branchId: 'br-hitech', branchName: 'Hitech City Studio', price: 2200, isAvailable: true },
    ],
    staffEligibilities: [
      { staffId: 'st-6', staffName: 'Meera Nambiar', role: 'Senior Nail Artist', skillLevel: 'Master', isEligible: true },
    ],
    addons: [
      { id: 'add-10', serviceId: 'srv-5', name: 'Swarovski Crystal Accent Studding', description: 'Genuine crystals set in hard resin per nail', price: 400, durationMinutes: 15, isActive: true },
      { id: 'add-11', serviceId: 'srv-5', name: 'Intense Paraffin Dip & Hydration Pack', description: 'Restores rough cuticles and restores softness', price: 500, durationMinutes: 15, isActive: true },
    ],
  },
  {
    id: 'srv-6',
    name: 'Cysteine Protein Smoothing & Anti-Frizz Ritual',
    code: 'TREAT-006',
    categoryId: 'cat-3',
    categoryName: 'Hair Treatment',
    customerDescription: 'Formaldehyde-free natural plant-derived cysteine treatment to eliminate 90% frizz while preserving natural curls and structural hair volume.',
    internalNotes: 'Wash with clarifying shampoo 2x. Blow-dry 80%. Apply treatment 1/2 inch away from scalp. Iron at 210°C in thin 1cm sections.',
    durationMinutes: 120,
    bufferMinutes: 20,
    totalSlotMinutes: 140,
    basePrice: 4800,
    taxRate: 18,
    status: 'ACTIVE',
    genderTarget: 'ALL',
    onlineBookingEnabled: true,
    branchPricings: [
      { branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', price: 5800, isAvailable: true },
      { branchId: 'br-banjara', branchName: 'Banjara Hills Premium', price: 5200, isAvailable: true },
      { branchId: 'br-hitech', branchName: 'Hitech City Studio', price: 4800, isAvailable: true },
    ],
    staffEligibilities: [
      { staffId: 'st-1', staffName: 'Aarav Mehta', role: 'Master Stylist', skillLevel: 'Master', isEligible: true },
      { staffId: 'st-2', staffName: 'Pooja Hegde', role: 'Senior Colorist', skillLevel: 'Senior', isEligible: true },
      { staffId: 'st-3', staffName: 'Vikram Sethi', role: 'Senior Stylist', skillLevel: 'Senior', isEligible: true },
    ],
    addons: [
      { id: 'add-12', serviceId: 'srv-6', name: 'Deep Moisture Hair Ampoule Shot', description: 'Concentrated protein boost for dry porous ends', price: 750, durationMinutes: 15, isActive: true },
    ],
  },
];

export interface ServicesViewProps {
  initialView?: 'SERVICES' | 'CATEGORIES' | 'PRICING' | 'ADDONS' | 'RECIPES';
  initialCategoryModalOpen?: boolean;
}

export function ServicesView({
  initialView = 'SERVICES',
  initialCategoryModalOpen = false,
}: ServicesViewProps) {
  const toast = useToast();

  // State
  const [services, setServices] = React.useState<ServiceItem[]>(initialServices);
  const [categories, setCategories] = React.useState<ServiceCategoryItem[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('all');
  const [selectedBranchContext, setSelectedBranchContext] = React.useState<string>(
    initialView === 'PRICING' ? 'br-jubilee' : 'all'
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [genderFilter, setGenderFilter] = React.useState<'ALL' | 'FEMALE' | 'MALE' | 'KIDS'>('ALL');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');

  // Modals
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [wizardStep, setWizardStep] = React.useState<number>(1);
  const [editingServiceId, setEditingServiceId] = React.useState<string | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [detailService, setDetailService] = React.useState<ServiceItem | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(
    initialCategoryModalOpen || initialView === 'CATEGORIES'
  );
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newCategoryCode, setNewCategoryCode] = React.useState('');
  const [newCategoryDesc, setNewCategoryDesc] = React.useState('');

  // 6-Step Wizard Form State
  const [formName, setFormName] = React.useState('');
  const [formCode, setFormCode] = React.useState('');
  const [formCategoryId, setFormCategoryId] = React.useState(categories[0]?.id || '');
  const [formCustomerDesc, setFormCustomerDesc] = React.useState('');
  const [formInternalNotes, setFormInternalNotes] = React.useState('');
  const [formDuration, setFormDuration] = React.useState(45);
  const [formBuffer, setFormBuffer] = React.useState(15);
  const [formBasePrice, setFormBasePrice] = React.useState(800);
  const [formTaxRate, setFormTaxRate] = React.useState(18);
  const [formGenderTarget, setFormGenderTarget] = React.useState<'ALL' | 'FEMALE' | 'MALE' | 'KIDS'>('ALL');
  const [formOnlineBooking, setFormOnlineBooking] = React.useState(true);
  const [formStatus, setFormStatus] = React.useState<'ACTIVE' | 'INACTIVE' | 'DRAFT'>('ACTIVE');

  // Step 2 Branch Pricing Overrides State
  const [formBranchPrices, setFormBranchPrices] = React.useState<{ [branchId: string]: { enabled: boolean; price: number } }>({});

  // Step 4 Staff Eligibility State
  const [formEligibleStaffIds, setFormEligibleStaffIds] = React.useState<string[]>([]);

  // Step 5 Branch Availability State
  const [formAvailableBranchIds, setFormAvailableBranchIds] = React.useState<string[]>([]);

  // Step 6 Add-ons State
  const [formAddons, setFormAddons] = React.useState<ServiceAddonItem[]>([]);
  const [newAddonName, setNewAddonName] = React.useState('');
  const [newAddonPrice, setNewAddonPrice] = React.useState(350);
  const [newAddonDuration, setNewAddonDuration] = React.useState(15);
  const [newAddonDesc, setNewAddonDesc] = React.useState('');

  // Initial branch prices setup helper
  const resetWizardForm = () => {
    setWizardStep(1);
    setEditingServiceId(null);
    setFormName('');
    setFormCode('');
    setFormCategoryId(categories[0]?.id || '');
    setFormCustomerDesc('');
    setFormInternalNotes('');
    setFormDuration(45);
    setFormBuffer(15);
    setFormBasePrice(800);
    setFormTaxRate(18);
    setFormGenderTarget('ALL');
    setFormOnlineBooking(true);
    setFormStatus('ACTIVE');

    const defaultBranchPrices: { [branchId: string]: { enabled: boolean; price: number } } = {};
    branchesList.forEach((b) => {
      defaultBranchPrices[b.id] = { enabled: false, price: 800 };
    });
    setFormBranchPrices(defaultBranchPrices);
    setFormEligibleStaffIds(staffList.slice(0, 2).map((s) => s.id));
    setFormAvailableBranchIds(branchesList.map((b) => b.id));
    setFormAddons([]);
  };

  const openCreateWizard = () => {
    resetWizardForm();
    setIsWizardOpen(true);
  };

  const openEditWizard = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setFormName(srv.name);
    setFormCode(srv.code || '');
    setFormCategoryId(srv.categoryId);
    setFormCustomerDesc(srv.customerDescription || '');
    setFormInternalNotes(srv.internalNotes || '');
    setFormDuration(srv.durationMinutes);
    setFormBuffer(srv.bufferMinutes);
    setFormBasePrice(srv.basePrice);
    setFormTaxRate(srv.taxRate || 18);
    setFormGenderTarget(srv.genderTarget || 'ALL');
    setFormOnlineBooking(srv.onlineBookingEnabled !== false);
    setFormStatus(srv.status);

    const bp: { [branchId: string]: { enabled: boolean; price: number } } = {};
    branchesList.forEach((b) => {
      const match = srv.branchPricings?.find((p) => p.branchId === b.id);
      if (match) {
        bp[b.id] = { enabled: true, price: match.price };
      } else {
        bp[b.id] = { enabled: false, price: srv.basePrice };
      }
    });
    setFormBranchPrices(bp);

    setFormEligibleStaffIds(srv.staffEligibilities?.map((s) => s.staffId) || []);
    setFormAvailableBranchIds(
      srv.branchPricings && srv.branchPricings.length > 0
        ? srv.branchPricings.map((p) => p.branchId)
        : branchesList.map((b) => b.id)
    );
    setFormAddons(
      srv.addons?.map((a) => ({
        id: a.id,
        serviceId: srv.id,
        name: a.name,
        description: a.description || '',
        price: a.price,
        durationMinutes: a.durationMinutes || 15,
        isActive: a.isActive !== false,
      })) || []
    );

    setWizardStep(1);
    setIsWizardOpen(true);
  };

  const handleAddAddonToWizard = () => {
    if (!newAddonName.trim()) {
      toast.error('Add-on name required', 'Please specify an add-on service name (e.g. Hair Wash, Ampoule Shot).');
      return;
    }
    const newAddon: ServiceAddonItem = {
      id: `add-${Date.now()}`,
      serviceId: editingServiceId || 'temp',
      name: newAddonName.trim(),
      description: newAddonDesc.trim(),
      price: Number(newAddonPrice) || 0,
      durationMinutes: Number(newAddonDuration) || 10,
      isActive: true,
    };
    setFormAddons([...formAddons, newAddon]);
    setNewAddonName('');
    setNewAddonDesc('');
    setNewAddonPrice(350);
    setNewAddonDuration(15);
    toast.success('Add-on added', `Added "${newAddon.name}" (+₹${newAddon.price}, ${newAddon.durationMinutes}m) to service upsells.`);
  };

  const handleRemoveAddonFromWizard = (id: string) => {
    setFormAddons(formAddons.filter((a) => a.id !== id));
  };

  const handleSaveWizard = () => {
    if (!formName.trim()) {
      toast.error('Service Name Required', 'Please enter a valid service name before saving.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === formCategoryId);

    const compiledBranchPricings: ServiceBranchPrice[] = [];
    Object.entries(formBranchPrices).forEach(([branchId, cfg]) => {
      if (cfg.enabled) {
        const br = branchesList.find((b) => b.id === branchId);
        compiledBranchPricings.push({
          branchId,
          branchName: br?.name || branchId,
          price: cfg.price,
          isAvailable: formAvailableBranchIds.includes(branchId),
        });
      }
    });

    const compiledStaff: ServiceStaffEligibilityItem[] = formEligibleStaffIds.map((stId) => {
      const st = staffList.find((s) => s.id === stId);
      return {
        staffId: stId,
        staffName: st?.name || stId,
        role: st?.role || 'Stylist',
        skillLevel: 'Certified',
        isEligible: true,
      };
    });

    if (editingServiceId) {
      // Update existing
      setServices((prev) =>
        prev.map((s) => {
          if (s.id === editingServiceId) {
            return {
              ...s,
              name: formName.trim(),
              code: formCode.trim() || `SRV-${Math.floor(100 + Math.random() * 900)}`,
              categoryId: formCategoryId,
              categoryName: selectedCategory?.name || 'General',
              customerDescription: formCustomerDesc.trim(),
              internalNotes: formInternalNotes.trim(),
              durationMinutes: Number(formDuration),
              bufferMinutes: Number(formBuffer),
              totalSlotMinutes: Number(formDuration) + Number(formBuffer),
              basePrice: Number(formBasePrice),
              taxRate: Number(formTaxRate),
              genderTarget: formGenderTarget,
              onlineBookingEnabled: formOnlineBooking,
              status: formStatus,
              branchPricings: compiledBranchPricings,
              staffEligibilities: compiledStaff,
              addons: formAddons,
              updatedAt: new Date().toISOString(),
            };
          }
          return s;
        })
      );
      toast.success('Service Updated Successfully', `"${formName}" catalog configurations, branch overrides & add-ons have been saved.`);
    } else {
      // Create new
      const newService: ServiceItem = {
        id: `srv-${Date.now()}`,
        name: formName.trim(),
        code: formCode.trim() || `SRV-${Math.floor(100 + Math.random() * 900)}`,
        categoryId: formCategoryId,
        categoryName: selectedCategory?.name || 'General',
        customerDescription: formCustomerDesc.trim(),
        internalNotes: formInternalNotes.trim(),
        durationMinutes: Number(formDuration),
        bufferMinutes: Number(formBuffer),
        totalSlotMinutes: Number(formDuration) + Number(formBuffer),
        basePrice: Number(formBasePrice),
        taxRate: Number(formTaxRate),
        genderTarget: formGenderTarget,
        onlineBookingEnabled: formOnlineBooking,
        status: formStatus,
        branchPricings: compiledBranchPricings,
        staffEligibilities: compiledStaff,
        addons: formAddons,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setServices([newService, ...services]);
      toast.success('New Service Created', `"${formName}" has been added to the catalog across selected branches.`);
    }

    setIsWizardOpen(false);
  };

  const handleDeleteService = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete service "${name}"? This action cannot be undone.`)) {
      setServices(services.filter((s) => s.id !== id));
      toast.info('Service Removed', `Service "${name}" has been deleted from the catalog.`);
    }
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Category Name Required', 'Please enter a name for the new category.');
      return;
    }
    const newCat: ServiceCategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      code: newCategoryCode.trim() || newCategoryName.trim().toUpperCase().replace(/\s+/g, '_'),
      description: newCategoryDesc.trim(),
      displayOrder: categories.length + 1,
      isActive: true,
      serviceCount: 0,
      isCustom: true,
    };
    setCategories([...categories, newCat]);
    setNewCategoryName('');
    setNewCategoryCode('');
    setNewCategoryDesc('');
    setIsCategoryModalOpen(false);
    toast.success('Category Created', `New category "${newCat.name}" is now available for service assignment.`);
  };

  // Helper to resolve effective price for a service under the selected branch context
  const getEffectivePriceInfo = (srv: ServiceItem) => {
    if (selectedBranchContext === 'all') {
      return {
        price: srv.basePrice,
        isOverride: false,
        label: 'Global Base Price',
        diff: 0,
      };
    }
    const match = srv.branchPricings?.find((p) => p.branchId === selectedBranchContext);
    if (match && match.price !== srv.basePrice) {
      const diff = match.price - srv.basePrice;
      return {
        price: match.price,
        isOverride: true,
        label: `${diff > 0 ? '+' : ''}₹${diff} Branch Override`,
        diff,
      };
    }
    return {
      price: srv.basePrice,
      isOverride: false,
      label: 'Base Price Applied',
      diff: 0,
    };
  };

  // Filtered services
  const filteredServices = services.filter((s) => {
    // Category match
    if (selectedCategoryId !== 'all' && s.categoryId !== selectedCategoryId) {
      return false;
    }
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchCode = s.code?.toLowerCase().includes(q);
      const matchCat = s.categoryName?.toLowerCase().includes(q);
      const matchDesc = s.customerDescription?.toLowerCase().includes(q);
      const matchNotes = s.internalNotes?.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchCat && !matchDesc && !matchNotes) {
        return false;
      }
    }
    // Gender filter
    if (genderFilter !== 'ALL' && s.genderTarget !== genderFilter) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'ALL' && s.status !== statusFilter) {
      return false;
    }
    // Branch context availability
    if (selectedBranchContext !== 'all') {
      const branchPrice = s.branchPricings?.find((p) => p.branchId === selectedBranchContext);
      if (branchPrice && branchPrice.isAvailable === false) {
        return false;
      }
    }
    return true;
  });

  // Calculate high-level catalog stats
  const totalServicesCount = services.length;
  const activeServicesCount = services.filter((s) => s.status === 'ACTIVE').length;
  const totalAddonsCount = services.reduce((acc, s) => acc + (s.addons?.length || 0), 0);
  const totalOverridesCount = services.reduce((acc, s) => acc + (s.branchPricings?.length || 0), 0);

  return (
    <div className="space-y-6 p-6">
      {/* 1. Page Header & Primary Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Service Catalog & Pricing Engine
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Configure 14 standard & custom salon categories, independent branch-specific pricing overrides (GST included), staff skill certification, and upsell add-ons.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Layers className="h-4 w-4" />
            + New Category
          </Button>
          <Button
            onClick={openCreateWizard}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create New Service
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Services</span>
            <Scissors className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalServicesCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            {activeServicesCount} Active in Catalog
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</span>
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {categories.length}
          </div>
          <span className="text-[11px] text-slate-500">
            14 Standard + Custom
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Branch Price Overrides</span>
            <Building2 className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalOverridesCount}
          </div>
          <span className="text-[11px] text-purple-600 font-medium">
            Tier-based Price Multipliers
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Upsell Add-ons</span>
            <Tag className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalAddonsCount}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">
            Separate Upsell Revenue
          </span>
        </div>
      </div>

      {/* 3. Dynamic Branch Context Switcher Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Active Branch Pricing Context
              </span>
              <Badge variant="warning">Dynamic Resolver</Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Viewing prices & availability as resolved for:{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                {selectedBranchContext === 'all'
                  ? 'Organization Global Base (Headquarters)'
                  : branchesList.find((b) => b.id === selectedBranchContext)?.name}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Switch Context:</span>
          <select
            className="w-full md:w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            value={selectedBranchContext}
            onChange={(e) => setSelectedBranchContext(e.target.value)}
          >
            <option value="all">🏢 Global Base Pricing (HQ View)</option>
            {branchesList.map((b) => (
              <option key={b.id} value={b.id}>
                📍 {b.name} ({b.city} • {b.tier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Category Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedCategoryId('all')}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
              selectedCategoryId === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All Services
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${selectedCategoryId === 'all' ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
              {services.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = services.filter((s) => s.categoryId === cat.id).length;
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-amber-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name}
                {count > 0 && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isSelected ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 max-w-md">
          <Search
            placeholder="Search service name, technical notes, chemicals, code..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Gender Filter */}
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
          >
            <option value="ALL">All Genders</option>
            <option value="FEMALE">Female Only</option>
            <option value="MALE">Male Only</option>
            <option value="KIDS">Kids Only</option>
          </select>

          {/* Status Filter */}
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* 6. Service Catalog Grid Cards */}
      {filteredServices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <Scissors className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
            No services found matching filters
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query, gender filter, or selected category.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryId('all');
              setGenderFilter('ALL');
              setStatusFilter('ALL');
            }}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => {
            const priceInfo = getEffectivePriceInfo(service);
            const totalSlotMinutes = service.durationMinutes + (service.bufferMinutes || 0);
            const gstAmount = Math.round(priceInfo.price * ((service.taxRate || 18) / 100));
            const totalWithGst = priceInfo.price + gstAmount;

            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-amber-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500"
              >
                <div>
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                        {service.categoryName || 'General'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {service.code || 'SRV'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {service.genderTarget && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {service.genderTarget}
                        </span>
                      )}
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          service.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                        title={service.status}
                      />
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {service.name}
                  </h3>

                  {/* Customer-Facing Description */}
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {service.customerDescription || 'No customer description specified.'}
                  </p>

                  {/* Internal Technical Prep Pill */}
                  {service.internalNotes && (
                    <div className="mt-2.5 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-amber-700 dark:text-amber-400">Technical Note: </span>
                      <span className="line-clamp-1">{service.internalNotes}</span>
                    </div>
                  )}

                  {/* Pricing Breakdown Box */}
                  <div className="mt-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-3 dark:from-slate-800/80 dark:to-slate-800/30 border border-amber-100 dark:border-slate-700">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {selectedBranchContext === 'all' ? 'Base Catalog Price' : 'Resolved Price'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                            ₹{priceInfo.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            + 18% GST (₹{gstAmount}) = <strong className="text-slate-800 dark:text-slate-200">₹{totalWithGst}</strong>
                          </span>
                        </div>
                      </div>

                      {priceInfo.isOverride && (
                        <Badge variant="warning" className="text-[9px]">
                          {priceInfo.label}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Duration & Scheduling Details */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                    <div className="flex items-center gap-1.5" title="Service Duration + Buffer Turnaround">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        <strong>{service.durationMinutes}m</strong> service + <strong>{service.bufferMinutes || 0}m</strong> buffer
                      </span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                      {totalSlotMinutes}m Total Slot
                    </span>
                  </div>

                  {/* Staff Eligibility & Add-ons Badges */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      <Users className="h-3 w-3" />
                      {service.staffEligibilities?.length || 0} Certified Staff
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                      <Tag className="h-3 w-3" />
                      {service.addons?.length || 0} Upsell Add-ons
                    </span>

                    {service.onlineBookingEnabled ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3 w-3" /> Online Booking
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400">
                        Walk-in Only
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDetailService(service);
                      setIsDetailModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Quick 360 View
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditWizard(service)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      title="Edit Service & Branch Overrides"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(service.id, service.name)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                      title="Delete Service"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. 6-Step Service Creation & Edit Wizard Modal */}
      <Modal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-100 p-1.5 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              {editingServiceId ? 'Edit Service & Pricing Matrix' : '6-Step Service Creation Wizard'}
            </span>
          </div>
        }
        description={`Step ${wizardStep} of 6 — ${
          wizardStep === 1
            ? 'Basic Information & Marketing Details'
            : wizardStep === 2
            ? 'Global Base Pricing & Branch Overrides'
            : wizardStep === 3
            ? 'Duration & Buffer Time Scheduling'
            : wizardStep === 4
            ? 'Staff Eligibility & Stylist Certification'
            : wizardStep === 5
            ? 'Branch Availability & Distribution'
            : 'Upsell Add-ons & Revenue Attribution'
        }`}
        maxWidth="lg"
      >
        <div className="space-y-6">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    wizardStep === s
                      ? 'bg-amber-600 text-white shadow'
                      : wizardStep > s
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  }`}
                >
                  {wizardStep > s ? <Check className="h-3.5 w-3.5" /> : s}
                </div>
                <span
                  className={`hidden text-[11px] font-medium sm:inline ${
                    wizardStep === s
                      ? 'font-bold text-amber-700 dark:text-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {s === 1
                    ? 'Basics'
                    : s === 2
                    ? 'Pricing'
                    : s === 3
                    ? 'Duration'
                    : s === 4
                    ? 'Staff'
                    : s === 5
                    ? 'Branches'
                    : 'Add-ons'}
                </span>
                {s < 6 && <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-700" />}
              </div>
            ))}
          </div>

          {/* STEP 1: Basic Information */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Service Name *
                  </label>
                  <Input
                    placeholder="e.g. Royal Balayage & Glaze"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Service Code (SKU)
                  </label>
                  <Input
                    placeholder="e.g. COLOR-BAL-01"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category *
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Gender
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    value={formGenderTarget}
                    onChange={(e) => setFormGenderTarget(e.target.value as any)}
                  >
                    <option value="ALL">All Genders / Unisex</option>
                    <option value="FEMALE">Female Only</option>
                    <option value="MALE">Male Only</option>
                    <option value="KIDS">Kids Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Service Status
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                  >
                    <option value="ACTIVE">Active in Catalog</option>
                    <option value="INACTIVE">Inactive / Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Customer-Facing Marketing Description
                </label>
                <textarea
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  placeholder="Appears on client booking app, invoices, and online portal..."
                  value={formCustomerDesc}
                  onChange={(e) => setFormCustomerDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Internal Technical Notes & Prep Instructions (Staff Only)
                </label>
                <textarea
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  placeholder="Chemical ratios, patch test checks, required tool sanitization, temperature settings..."
                  value={formInternalNotes}
                  onChange={(e) => setFormInternalNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="onlineToggle"
                  checked={formOnlineBooking}
                  onChange={(e) => setFormOnlineBooking(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="onlineToggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Enable client self-service online booking for this service
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: Pricing & Branch Overrides */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-xl bg-amber-50/50 p-4 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Global Base Price (INR ₹) *
                    </label>
                    <Input
                      type="number"
                      value={formBasePrice}
                      onChange={(e) => setFormBasePrice(Number(e.target.value))}
                      className="mt-1 text-base font-bold"
                    />
                    <span className="text-[10px] text-slate-500">
                      Default price applied unless branch override is active.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      GST Tax Rate (%)
                    </label>
                    <Input
                      type="number"
                      value={formTaxRate}
                      onChange={(e) => setFormTaxRate(Number(e.target.value))}
                      className="mt-1"
                    />
                    <span className="text-[10px] text-slate-500">
                      Standard salon GST in India is 18%.
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Branch-Specific Price Overrides
                </h4>
                <p className="text-[11px] text-slate-500 mb-2">
                  Set independent prices for premium flagship locations or tier-2 outlets.
                </p>

                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50 max-h-60 overflow-y-auto">
                  {branchesList.map((branch) => {
                    const cfg = formBranchPrices[branch.id] || { enabled: false, price: formBasePrice };
                    const diff = cfg.price - formBasePrice;

                    return (
                      <div
                        key={branch.id}
                        className="flex items-center justify-between gap-4 rounded-lg bg-white p-2.5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            id={`override-${branch.id}`}
                            checked={cfg.enabled}
                            onChange={(e) => {
                              setFormBranchPrices({
                                ...formBranchPrices,
                                [branch.id]: {
                                  enabled: e.target.checked,
                                  price: e.target.checked ? cfg.price : formBasePrice,
                                },
                              });
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          <div>
                            <label
                              htmlFor={`override-${branch.id}`}
                              className="text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
                            >
                              {branch.name}
                            </label>
                            <span className="block text-[10px] text-slate-400">
                              {branch.city} • {branch.tier}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {cfg.enabled ? (
                            <div className="flex items-center gap-2">
                              <div className="w-28">
                                <Input
                                  type="number"
                                  value={cfg.price}
                                  onChange={(e) => {
                                    setFormBranchPrices({
                                      ...formBranchPrices,
                                      [branch.id]: {
                                        enabled: true,
                                        price: Number(e.target.value),
                                      },
                                    });
                                  }}
                                  className="h-8 text-xs font-bold"
                                />
                              </div>
                              <span
                                className={`text-[10px] font-bold ${
                                  diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-amber-600' : 'text-slate-400'
                                }`}
                              >
                                {diff > 0 ? `+₹${diff}` : diff < 0 ? `-₹${Math.abs(diff)}` : 'Same'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">
                              Inherits Base (₹{formBasePrice})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Duration & Scheduling */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Service Execution Duration (Minutes) *
                  </label>
                  <Input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="mt-1 text-base font-bold"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Actual chair time spent performing the service on the client.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Buffer / Turnover Time (Minutes)
                  </label>
                  <Input
                    type="number"
                    value={formBuffer}
                    onChange={(e) => setFormBuffer(Number(e.target.value))}
                    className="mt-1 text-base font-bold"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Chair sanitization, bowl cleaning, formula prep, and staff turnaround.
                  </p>
                </div>
              </div>

              {/* Total Slot Calculator */}
              <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                        Total Calendar Booking Slot
                      </span>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400">
                        The appointment scheduler will reserve this exact block on the stylist calendar.
                      </p>
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-amber-800 dark:text-amber-200">
                    {Number(formDuration) + Number(formBuffer)} Minutes
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Staff Eligibility */}
          {wizardStep === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Certified Staff & Stylists
                </h4>
                <p className="text-[11px] text-slate-500 mb-2">
                  Select which stylists or therapists have the required certifications to perform this service.
                </p>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50 max-h-64 overflow-y-auto">
                {staffList.map((staff) => {
                  const isChecked = formEligibleStaffIds.includes(staff.id);

                  return (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`staff-${staff.id}`}
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormEligibleStaffIds([...formEligibleStaffIds, staff.id]);
                            } else {
                              setFormEligibleStaffIds(formEligibleStaffIds.filter((id) => id !== staff.id));
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                          <label
                            htmlFor={`staff-${staff.id}`}
                            className="text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
                          >
                            {staff.name}
                          </label>
                          <span className="block text-[10px] text-slate-500">
                            {staff.role} • {staff.branchName}
                          </span>
                        </div>
                      </div>

                      {isChecked ? (
                        <Badge variant="success" className="text-[9px]">
                          Certified & Eligible
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-slate-400">Not Assigned</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Branch Availability */}
          {wizardStep === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Branch Availability Matrix
                </h4>
                <p className="text-[11px] text-slate-500 mb-2">
                  Select all branches where this service will be actively bookable and displayed on the POS terminal.
                </p>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50 max-h-64 overflow-y-auto">
                {branchesList.map((branch) => {
                  const isAvailable = formAvailableBranchIds.includes(branch.id);

                  return (
                    <div
                      key={branch.id}
                      className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`branch-avail-${branch.id}`}
                          checked={isAvailable}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormAvailableBranchIds([...formAvailableBranchIds, branch.id]);
                            } else {
                              setFormAvailableBranchIds(formAvailableBranchIds.filter((id) => id !== branch.id));
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                          <label
                            htmlFor={`branch-avail-${branch.id}`}
                            className="text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
                          >
                            {branch.name}
                          </label>
                          <span className="block text-[10px] text-slate-500">
                            {branch.city} • Code: {branch.code}
                          </span>
                        </div>
                      </div>

                      {isAvailable ? (
                        <Badge variant="success" className="text-[9px]">
                          Available for Booking
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] text-slate-400">
                          Disabled at this Branch
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Add-ons & Upsell Options */}
          {wizardStep === 6 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Upsell Add-ons & Revenue Attribution
                </h4>
                <p className="text-[11px] text-slate-500 mb-2">
                  Configure complementary upgrades (e.g. Hair Wash, Ampoule Boost, Hot Stone) tracked separately in POS & billing reports.
                </p>
              </div>

              {/* Add-on Creation Form */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 dark:border-amber-900 dark:bg-amber-950/20">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                  + Add New Upsell Add-on Option
                </span>
                <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <Input
                    placeholder="Add-on name (e.g. Scalp Scrub)"
                    value={newAddonName}
                    onChange={(e) => setNewAddonName(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Price in ₹"
                    value={newAddonPrice}
                    onChange={(e) => setNewAddonPrice(Number(e.target.value))}
                    className="h-8 text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Extra time (mins)"
                    value={newAddonDuration}
                    onChange={(e) => setNewAddonDuration(Number(e.target.value))}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    placeholder="Add-on benefit description (optional)..."
                    value={newAddonDesc}
                    onChange={(e) => setNewAddonDesc(e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddAddonToWizard}
                    className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                  >
                    Add Upsell
                  </Button>
                </div>
              </div>

              {/* Existing Add-ons List */}
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {formAddons.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                    No add-ons added yet. You can add one above.
                  </div>
                ) : (
                  formAddons.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-800"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {addon.name}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="font-semibold text-emerald-600">+₹{addon.price}</span>
                          <span>•</span>
                          <span>+{addon.durationMinutes} mins</span>
                          {addon.description && (
                            <>
                              <span>•</span>
                              <span className="italic">{addon.description}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveAddonFromWizard(addon.id)}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
            <div>
              {wizardStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setIsWizardOpen(false)}>
                Cancel
              </Button>
              {wizardStep < 6 ? (
                <Button
                  onClick={() => {
                    if (wizardStep === 1 && !formName.trim()) {
                      toast.error('Service Name Required', 'Please specify a service name.');
                      return;
                    }
                    setWizardStep(wizardStep + 1);
                  }}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSaveWizard}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Save & Publish Service
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* 8. Quick 360 View Modal */}
      {detailService && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-amber-600" />
              <span>{detailService.name}</span>
            </div>
          }
          description={`Category: ${detailService.categoryName} • Code: ${detailService.code || 'N/A'}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Customer vs Staff Tabs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Customer-Facing Description
                </span>
                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                  {detailService.customerDescription || 'No description provided.'}
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 dark:border-amber-900 dark:bg-amber-950/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Internal Staff Technical Prep & Notes
                </span>
                <p className="mt-1 text-xs font-mono text-slate-800 dark:text-slate-200">
                  {detailService.internalNotes || 'No technical notes recorded.'}
                </p>
              </div>
            </div>

            {/* Branch Pricing Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Multi-Branch Pricing Matrix (Base: ₹{detailService.basePrice})
              </h4>
              <div className="space-y-1.5 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                {branchesList.map((branch) => {
                  const match = detailService.branchPricings?.find((p) => p.branchId === branch.id);
                  const price = match ? match.price : detailService.basePrice;
                  const isOverridden = match && match.price !== detailService.basePrice;
                  const diff = price - detailService.basePrice;

                  return (
                    <div
                      key={branch.id}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {branch.name} ({branch.city})
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {isOverridden ? (
                          <Badge variant="warning" className="text-[9px]">
                            {diff > 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`} Override
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-slate-400">Base</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add-ons & Certified Staff */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Upsell Add-ons ({detailService.addons?.length || 0})
                </h4>
                <div className="space-y-1.5">
                  {detailService.addons && detailService.addons.length > 0 ? (
                    detailService.addons.map((add) => (
                      <div
                        key={add.id}
                        className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {add.name}
                        </span>
                        <span className="font-bold text-emerald-600">
                          +₹{add.price} ({add.durationMinutes || 15}m)
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No add-ons configured.</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Certified Stylists ({detailService.staffEligibilities?.length || 0})
                </h4>
                <div className="space-y-1.5">
                  {detailService.staffEligibilities && detailService.staffEligibilities.length > 0 ? (
                    detailService.staffEligibilities.map((st) => (
                      <div
                        key={st.staffId}
                        className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {st.staffName}
                        </span>
                        <Badge variant="success" className="text-[9px]">
                          {st.skillLevel || 'Certified'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">All stylists qualified.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 pt-3 dark:border-slate-800">
              <Button onClick={() => setIsDetailModalOpen(false)}>Close View</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 9. Add Custom Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Create Custom Service Category"
        description="Add a specialized category for unique salon, aesthetic or wellness services."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category Name *
            </label>
            <Input
              placeholder="e.g. Scalp Dermoscopy"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category Code
            </label>
            <Input
              placeholder="e.g. SCALP_DERM"
              value={newCategoryCode}
              onChange={(e) => setNewCategoryCode(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              placeholder="Describe what services fall under this category..."
              value={newCategoryDesc}
              onChange={(e) => setNewCategoryDesc(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setIsCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Create Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function ServicesPage() {
  return <ServicesView initialView="SERVICES" />;
}

