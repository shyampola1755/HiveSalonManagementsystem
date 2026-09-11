'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Input,
  Select,
  Tabs,
  Modal,
  StatCard,
  useToast,
} from '@hive/ui';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wallet,
  Award,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  Package,
  Star,
  MessageSquare,
  Scissors,
  Droplets,
  ShieldCheck,
  Plus,
  Send,
  Receipt,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Flame,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type {
  Customer360,
  ColorFormula,
  PatchTest,
  CustomerNoteItem,
  WalletTransaction,
  CustomerTimelineItem,
} from '@hive/types';

export default function Customer360Page() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const customerId = (params?.id as string) || 'c1';

  const [activeTab, setActiveTab] = React.useState('overview');
  const [isTopupModalOpen, setIsTopupModalOpen] = React.useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = React.useState(false);
  const [isPatchTestModalOpen, setIsPatchTestModalOpen] = React.useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = React.useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState<any>(null);

  // Top-up Form State
  const [topupForm, setTopupForm] = React.useState({
    amount: '3000',
    paymentMethod: 'UPI',
    bonusCashback: '150',
  });

  // Color Formula Form State
  const [formulaForm, setFormulaForm] = React.useState({
    formulaName: '',
    brand: "L'Oréal Professionnel Dia Richesse",
    formulaMix: '',
    developerVolume: '9 Vol (2.7%)',
    developerRatio: '1:1.5',
    processingTimeMinutes: 25,
    targetHairTone: '',
    stylistNotes: '',
  });

  // Patch Test Form State
  const [patchTestForm, setPatchTestForm] = React.useState({
    testType: 'HAIR_COLOR_DYE',
    chemicalOrBrandName: "L'Oréal Majirel PPD Allergen Check",
    result: 'PASSED',
    notes: 'No adverse reaction after 48h observation.',
  });

  // Note Form State
  const [noteForm, setNoteForm] = React.useState({
    note: '',
    isPrivate: false,
    category: 'GENERAL',
  });

  // Customer 360 State (Initialized with comprehensive seed)
  const [customer, setCustomer] = React.useState<Customer360>({
    id: 'c1',
    organizationId: 'org_hive_demo',
    fullName: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@example.com',
    gender: 'FEMALE',
    birthDate: '1992-06-15',
    address: 'Plot 42, Road No. 36, Jubilee Hills, Hyderabad',
    notes: 'Prefers mild organic shampoos. Always books weekend morning slots.',
    customerSource: 'INSTAGRAM',
    referredByCustomerId: null,
    tags: ['VIP', 'Returning', 'High Value'],
    loyaltyPoints: 850,
    walletBalance: 4200.0,
    totalSpent: 48500.0,
    totalVisits: 14,
    lastVisitAt: '2026-09-02',
    nextAppointmentAt: '2026-09-12 02:30 PM',
    preferredBranchId: 'b1',
    preferredBranchName: 'Jubilee Hills Flagship',
    preferredStylistId: 's1',
    preferredStylistName: 'Ananya Reddy',
    membershipStatus: 'ACTIVE',
    activeMembershipTier: 'Diamond Elite',
    activeMembershipExpiry: '2027-03-31',

    hairProfile: {
      texture: 'FINE',
      porosity: 'NORMAL',
      scalpType: 'SENSITIVE',
      density: 'HIGH',
      curlPattern: 'WAVY_2A_2C',
      hairLength: 'MID_BACK',
      chemicalHistory: [
        'Balayage Lightening (L\'Oréal Blonde Studio, June 2026)',
        'Olaplex No. 1 & 2 Treatment (August 2026)',
      ],
    },

    skinProfile: {
      skinType: 'COMBINATION',
      undertone: 'WARM',
      allergies: ['Ammonia (Mild scalp irritation)', 'Strong synthetic perfumes'],
      sensitivities: ['High Heat blow-dryers near scalp'],
      skinConcerns: ['Dehydration after travel', 'Occasional t-zone shine'],
    },

    preferences: {
      beverages: ['Warm Green Tea (No sugar)', 'San Pellegrino'],
      quietAppointment: false,
      pressurePreference: 'FIRM',
      musicPreference: 'Ambient Lounge / Lo-Fi',
      scalpSensitivity: 'HIGH',
      customNotes: 'Always provide silk cape if available.',
    },

    colorFormulas: [
      {
        id: 'cf-1',
        customerId: 'c1',
        formulaName: 'Sun-Kissed Caramel Balayage Gloss',
        brand: "L'Oréal Professionnel Dia Richesse",
        formulaMix: '7.13 (35g) + 8.3 (15g) + 9.01 (10g) + Diactivateur 9 Vol (90g)',
        developerVolume: '9 Vol (2.7%)',
        developerRatio: '1:1.5',
        processingTimeMinutes: 25,
        targetHairTone: 'Caramel Toffee Glow (Level 8)',
        stylistNotes: 'Applied at shampoo basin on damp hair for 20m. Neutralized brassy tones.',
        appliedAt: '2026-08-15T10:45:00Z',
        createdAt: '2026-08-15T10:45:00Z',
      },
      {
        id: 'cf-2',
        customerId: 'c1',
        formulaName: 'Root Shadow & Neutralizing Gloss',
        brand: 'Wella Professionals Illumina Color',
        formulaMix: '6/16 (20g) + 7/81 (20g) + Pastel Developer (80g)',
        developerVolume: '6 Vol (1.9%)',
        developerRatio: '1:2',
        processingTimeMinutes: 20,
        targetHairTone: 'Cool Ashy Blonde Transition',
        stylistNotes: 'Maintained natural depth at root 2 inches.',
        appliedAt: '2026-06-10T14:15:00Z',
        createdAt: '2026-06-10T14:15:00Z',
      },
    ],

    patchTests: [
      {
        id: 'pt-1',
        customerId: 'c1',
        testType: 'HAIR_COLOR_DYE',
        chemicalOrBrandName: "L'Oréal Majirel PPD 48h Patch Test",
        testedAt: '2026-08-12T11:00:00Z',
        result: 'PASSED',
        validUntil: '2027-02-12T00:00:00Z',
        technicianUserId: 's1',
        notes: 'Applied behind left ear. Zero redness, swelling or itchiness reported after 48 hours.',
        createdAt: '2026-08-12T11:00:00Z',
      },
      {
        id: 'pt-2',
        customerId: 'c1',
        testType: 'CHEMICAL_PEEL',
        chemicalOrBrandName: 'DermaQuest Glycolic 30% Acid Sensitivity Check',
        testedAt: '2026-05-20T16:00:00Z',
        result: 'PASSED',
        validUntil: '2026-11-20T00:00:00Z',
        technicianUserId: 's2',
        notes: 'Forearm patch clear after 24 hours.',
        createdAt: '2026-05-20T16:00:00Z',
      },
    ],

    staffNotes: [
      {
        id: 'cn-1',
        customerId: 'c1',
        note: "Client is preparing for sister's wedding in November. Wants to maintain length while brightening face-framing pieces.",
        isPrivate: false,
        category: 'TECH_FORMULA',
        authorUserId: 's1',
        authorName: 'Ananya Reddy (Senior Stylist)',
        createdAt: '2026-08-15T12:00:00Z',
      },
      {
        id: 'cn-2',
        customerId: 'c1',
        note: 'VIP Tier guest. Manager discount approved at 15% for retail Olaplex purchases.',
        isPrivate: true,
        category: 'GENERAL',
        authorUserId: 'u1',
        authorName: 'Sarah Jenkins (Branch Manager)',
        createdAt: '2026-07-01T09:30:00Z',
      },
    ],

    walletTransactions: [
      {
        id: 'wt-1',
        customerId: 'c1',
        amount: 5000.0,
        type: 'CREDIT',
        reason: 'Festive Wallet Recharge via UPI',
        balanceAfter: 5000.0,
        createdAt: '2026-08-10T15:20:00Z',
      },
      {
        id: 'wt-2',
        customerId: 'c1',
        amount: 800.0,
        type: 'DEBIT',
        reason: 'Partial settlement on Invoice #HIVE-HYD-0391',
        balanceAfter: 4200.0,
        referenceInvoiceId: 'HIVE-HYD-0391',
        createdAt: '2026-08-15T12:30:00Z',
      },
    ],

    omnichannelMetrics: {
      salonServiceSpend: 48500.0,
      posRetailSpend: 4850.0,
      onlineEcommerceSpend: 7899.0,
      totalOrdersCount: 2,
    },

    timelineEvents: [
      {
        id: 'te-0',
        customerId: 'c1',
        channel: 'ONLINE_ORDER',
        eventType: 'ONLINE_ORDER_READY_PICKUP',
        title: 'Online Store Order #HIVE-ORD-2026-00481 Ready for Pickup',
        description: 'Branch in-store pickup ready at Jubilee Hills front desk (Olaplex No. 3 + Moroccanoil 100ml) • 4-Digit Pickup OTP: 7419.',
        referenceId: 'HIVE-ORD-2026-00481',
        occurredAt: '2026-09-10T11:30:00Z',
      },
      {
        id: 'te-1',
        customerId: 'c1',
        channel: 'SALON_SERVICE',
        eventType: 'APPOINTMENT_BOOKED',
        title: 'Upcoming Appointment Scheduled',
        description: 'Booked Balayage Refresh & Moroccan Blowdry with Ananya Reddy on Sep 12 at 02:30 PM.',
        referenceId: 'APT-20260912-001',
        occurredAt: '2026-09-08T10:15:00Z',
      },
      {
        id: 'te-1b',
        customerId: 'c1',
        channel: 'ONLINE_ORDER',
        eventType: 'ONLINE_ORDER_DELIVERED',
        title: 'Online Store Order #HIVE-ORD-2026-00392 Delivered',
        description: 'Doorstep delivery completed by Delhivery National Express (L’Oréal Absolut Repair Quinoa Mask 250ml) • ₹2,049.00.',
        referenceId: 'HIVE-ORD-2026-00392',
        occurredAt: '2026-08-20T16:30:00Z',
      },
      {
        id: 'te-2',
        customerId: 'c1',
        channel: 'SALON_SERVICE',
        eventType: 'REVIEW_SUBMITTED',
        title: '5-Star Review Received',
        description: '"Ananya is a color genius! My balayage has never looked shinier and healthier."',
        metadata: { rating: 5, csat: 100 },
        occurredAt: '2026-08-16T18:00:00Z',
      },
      {
        id: 'te-3',
        customerId: 'c1',
        channel: 'POS_PURCHASE',
        eventType: 'INVOICE_GENERATED',
        title: 'POS In-Salon Purchase & Bill — ₹4,850.00',
        description: 'Invoice #HIVE-HYD-0391: Balayage Gloss & Moroccan Blowdry + Olaplex No. 4 Shampoo counter retail bottle paid via Wallet + UPI.',
        referenceId: 'HIVE-HYD-0391',
        occurredAt: '2026-08-15T12:30:00Z',
      },
      {
        id: 'te-4',
        customerId: 'c1',
        channel: 'SALON_SERVICE',
        eventType: 'FORMULA_APPLIED',
        title: 'Color Formula Logged',
        description: "Sun-Kissed Caramel Balayage Gloss (L'Oréal Dia Richesse 7.13 + 8.3).",
        occurredAt: '2026-08-15T10:45:00Z',
      },
      {
        id: 'te-5',
        customerId: 'c1',
        channel: 'SALON_SERVICE',
        eventType: 'MEMBERSHIP_PURCHASED',
        title: 'Diamond Elite Membership Activated',
        description: 'Purchased 1-year Diamond tier membership with 15% service perks & priority booking.',
        occurredAt: '2026-04-01T11:00:00Z',
      },
    ],

    onlineOrders: [
      {
        id: 'ord-101',
        orderNumber: 'HIVE-ORD-2026-00481',
        status: 'READY_FOR_PICKUP',
        fulfillmentType: 'BRANCH_PICKUP',
        pickupBranchName: 'Jubilee Hills Flagship Sanctuary',
        pickupDate: '2026-09-12',
        pickupSlot: '11:00 AM – 02:00 PM',
        pickupOtp: '7419',
        items: [
          { productName: 'Olaplex No. 3 Hair Perfector', brand: 'Olaplex Professional', qty: 1, price: 2950.0 },
          { productName: 'Moroccanoil Original Treatment Oil', brand: 'Moroccanoil', qty: 1, price: 3600.0 },
        ],
        subtotal: 5550.85,
        tax: 999.15,
        grandTotal: 5850.0,
        paymentMethod: 'UPI + Wallet',
        date: '2026-09-10',
      },
      {
        id: 'ord-100',
        orderNumber: 'HIVE-ORD-2026-00392',
        status: 'DELIVERED',
        fulfillmentType: 'HOME_DELIVERY',
        carrierName: 'Delhivery National Express',
        trackingNumber: 'DLV8910294812',
        items: [
          { productName: "L'Oréal Professionnel Absolut Repair Quinoa Mask", brand: "L'Oréal", qty: 1, price: 1950.0 },
        ],
        subtotal: 1652.55,
        tax: 297.45,
        deliveryFee: 99.0,
        grandTotal: 2049.0,
        paymentMethod: 'CARD',
        date: '2026-08-17',
      },
    ],

    packages: [
      {
        id: 'pkg-1',
        customerId: 'c1',
        packageName: 'Hydra-Infusion Facial & Glow Pack (6 Sessions)',
        totalSessions: 6,
        usedSessions: 4,
        totalPrice: 18000.0,
        status: 'ACTIVE',
        expiresAt: '2026-12-31',
        createdAt: '2026-03-15T10:00:00Z',
      },
    ],

    reviews: [
      {
        id: 'rev-1',
        customerId: 'c1',
        rating: 5,
        comment: 'Ananya is phenomenal. The hospitality at Jubilee Hills is unmatched.',
        stylistName: 'Ananya Reddy',
        serviceName: 'Balayage & Gloss',
        csatScore: 100,
        createdAt: '2026-08-16T18:00:00Z',
      },
    ],

    appointments: [
      {
        id: 'apt-1',
        date: '2026-09-12',
        time: '02:30 PM',
        service: 'Balayage & Moroccan Blowdry',
        stylist: 'Ananya Reddy',
        branch: 'Jubilee Hills Flagship',
        status: 'CONFIRMED',
        price: 4500.0,
      },
      {
        id: 'apt-2',
        date: '2026-08-15',
        time: '10:00 AM',
        service: 'Balayage Gloss & Hair Spa',
        stylist: 'Ananya Reddy',
        branch: 'Jubilee Hills Flagship',
        status: 'COMPLETED',
        price: 4850.0,
      },
      {
        id: 'apt-3',
        date: '2026-07-20',
        time: '04:00 PM',
        service: 'Hydra-Infusion Facial (Session 4)',
        stylist: 'Kavita Nair',
        branch: 'Jubilee Hills Flagship',
        status: 'COMPLETED',
        price: 3000.0,
      },
    ],

    invoices: [
      {
        id: 'inv-391',
        invoiceNumber: 'HIVE-HYD-0391',
        date: '2026-08-15',
        items: 'Balayage Gloss & Moroccan Blowdry + Olaplex Retail',
        subtotal: 4110.17,
        gst: 739.83,
        total: 4850.0,
        status: 'PAID',
        paymentMethod: 'UPI + Wallet',
      },
      {
        id: 'inv-284',
        invoiceNumber: 'HIVE-HYD-0284',
        date: '2026-07-20',
        items: 'Hydra-Infusion Facial (Session 4 Redemption)',
        subtotal: 0.0,
        gst: 0.0,
        total: 0.0,
        status: 'PAID',
        paymentMethod: 'Prepaid Package',
      },
    ],

    servicesSummary: [
      { serviceName: 'Balayage & Highlighting', category: 'Hair Artistry', timesBooked: 6, lastDate: '2026-08-15' },
      { serviceName: 'Moroccan Blowdry Finish', category: 'Hair Styling', timesBooked: 8, lastDate: '2026-08-15' },
      { serviceName: 'Hydra-Infusion Facial', category: 'Aesthetics & Skin', timesBooked: 4, lastDate: '2026-07-20' },
    ],

    marketingLogs: [
      { id: 'm-1', channel: 'WHATSAPP', campaignName: 'Exclusive Festive Hair Spa Offer', sentAt: '2026-08-01T10:00:00Z', status: 'CLICKED' },
      { id: 'm-2', channel: 'SMS', campaignName: 'Appointment Reminder for Sep 12', sentAt: '2026-09-08T10:15:00Z', status: 'DELIVERED' },
    ],

    createdAt: '2025-11-10T14:30:00Z',
    updatedAt: '2026-09-08T10:15:00Z',
  });

  // Timeline Channel Filter State
  const [timelineChannelFilter, setTimelineChannelFilter] = React.useState<
    'ALL' | 'SALON_SERVICE' | 'POS_PURCHASE' | 'ONLINE_ORDER'
  >('ALL');

  // 13 Tabs configuration (Including Phase 15 Online Retail Orders)
  const profileTabs = [
    { id: 'overview', label: 'Overview & Omnichannel Timeline', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { id: 'ecommerce', label: 'Online Store Orders', count: customer.onlineOrders?.length || 2, icon: <ShoppingBag className="h-3.5 w-3.5" /> },
    { id: 'salon_profile', label: 'Salon Profile & Formulas', icon: <Scissors className="h-3.5 w-3.5" /> },
    { id: 'appointments', label: 'Appointments', count: customer.appointments.length, icon: <Calendar className="h-3.5 w-3.5" /> },
    { id: 'services', label: 'Services History', icon: <Droplets className="h-3.5 w-3.5" /> },
    { id: 'invoices', label: 'Invoices & Receipts', count: customer.invoices.length, icon: <Receipt className="h-3.5 w-3.5" /> },
    { id: 'payments', label: 'Payments Ledger', icon: <CreditCard className="h-3.5 w-3.5" /> },
    { id: 'memberships', label: 'Memberships', icon: <Award className="h-3.5 w-3.5" /> },
    { id: 'packages', label: 'Prepaid Packages', count: customer.packages.length, icon: <Package className="h-3.5 w-3.5" /> },
    { id: 'wallet', label: 'Prepaid Wallet', icon: <Wallet className="h-3.5 w-3.5" /> },
    { id: 'loyalty', label: 'Loyalty Rewards', icon: <Flame className="h-3.5 w-3.5" /> },
    { id: 'reviews', label: 'Reviews & CSAT', count: customer.reviews.length, icon: <Star className="h-3.5 w-3.5" /> },
    { id: 'marketing', label: 'Marketing Logs', count: customer.marketingLogs?.length || 0, icon: <Send className="h-3.5 w-3.5" /> },
  ];

  // Handler: Top-up Wallet
  const handleTopupWallet = () => {
    const amount = Number(topupForm.amount);
    const newBalance = customer.walletBalance + amount;
    const newTx: WalletTransaction = {
      id: `wt_${Date.now()}`,
      customerId: customer.id,
      amount,
      type: 'CREDIT',
      reason: `Prepaid Recharge via ${topupForm.paymentMethod}`,
      balanceAfter: newBalance,
      createdAt: new Date().toISOString(),
    };

    setCustomer({
      ...customer,
      walletBalance: newBalance,
      walletTransactions: [newTx, ...customer.walletTransactions],
      timelineEvents: [
        {
          id: `te_${Date.now()}`,
          customerId: customer.id,
          eventType: 'PAYMENT_RECEIVED',
          title: `Wallet Recharged — ${formatCurrency(amount)}`,
          description: `Prepaid credit added via ${topupForm.paymentMethod}. New balance: ${formatCurrency(newBalance)}.`,
          occurredAt: new Date().toISOString(),
        },
        ...customer.timelineEvents,
      ],
    });

    setIsTopupModalOpen(false);
    toast.success('Wallet Recharged Successfully', `${formatCurrency(amount)} added to ${customer.fullName}'s wallet.`);
  };

  // Handler: Add Color Formula
  const handleAddFormula = () => {
    if (!formulaForm.formulaMix) {
      toast.error('Validation Error', 'Please specify the formula shade mix ratio.');
      return;
    }
    const newFormula: ColorFormula = {
      id: `cf_${Date.now()}`,
      customerId: customer.id,
      formulaName: formulaForm.formulaName || 'Custom Technical Formula',
      brand: formulaForm.brand,
      formulaMix: formulaForm.formulaMix,
      developerVolume: formulaForm.developerVolume,
      developerRatio: formulaForm.developerRatio,
      processingTimeMinutes: Number(formulaForm.processingTimeMinutes),
      targetHairTone: formulaForm.targetHairTone || null,
      stylistNotes: formulaForm.stylistNotes || null,
      technicianUserId: 'stylist_curr',
      appliedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setCustomer({
      ...customer,
      colorFormulas: [newFormula, ...customer.colorFormulas],
      timelineEvents: [
        {
          id: `te_${Date.now()}`,
          customerId: customer.id,
          eventType: 'FORMULA_APPLIED',
          title: `Color Formula Logged: ${newFormula.formulaName}`,
          description: `${newFormula.brand} (${newFormula.formulaMix}) with ${newFormula.developerVolume}.`,
          occurredAt: new Date().toISOString(),
        },
        ...customer.timelineEvents,
      ],
    });

    setIsFormulaModalOpen(false);
    setFormulaForm({
      formulaName: '',
      brand: "L'Oréal Professionnel Dia Richesse",
      formulaMix: '',
      developerVolume: '9 Vol (2.7%)',
      developerRatio: '1:1.5',
      processingTimeMinutes: 25,
      targetHairTone: '',
      stylistNotes: '',
    });
    toast.success('Formula Saved', `Color formula recorded for ${customer.fullName}`);
  };

  // Handler: Record Patch Test
  const handleRecordPatchTest = () => {
    const newTest: PatchTest = {
      id: `pt_${Date.now()}`,
      customerId: customer.id,
      testType: patchTestForm.testType as any,
      chemicalOrBrandName: patchTestForm.chemicalOrBrandName,
      testedAt: new Date().toISOString(),
      result: patchTestForm.result as any,
      validUntil: new Date(Date.now() + 180 * 86400000).toISOString(),
      technicianUserId: 'tech_curr',
      notes: patchTestForm.notes,
      createdAt: new Date().toISOString(),
    };

    setCustomer({
      ...customer,
      patchTests: [newTest, ...customer.patchTests],
      timelineEvents: [
        {
          id: `te_${Date.now()}`,
          customerId: customer.id,
          eventType: 'PATCH_TEST_RECORDED',
          title: `Patch Test: ${newTest.chemicalOrBrandName}`,
          description: `Result: ${newTest.result} • Valid for 6 months until ${new Date(newTest.validUntil!).toLocaleDateString('en-IN')}.`,
          occurredAt: new Date().toISOString(),
        },
        ...customer.timelineEvents,
      ],
    });

    setIsPatchTestModalOpen(false);
    toast.success('Patch Test Recorded', `${newTest.chemicalOrBrandName} test result saved.`);
  };

  // Handler: Add Staff Note
  const handleAddNote = () => {
    if (!noteForm.note.trim()) return;
    const newNote: CustomerNoteItem = {
      id: `cn_${Date.now()}`,
      customerId: customer.id,
      note: noteForm.note,
      isPrivate: noteForm.isPrivate,
      category: noteForm.category as any,
      authorName: 'Sarah Jenkins (Manager)',
      createdAt: new Date().toISOString(),
    };

    setCustomer({
      ...customer,
      staffNotes: [newNote, ...customer.staffNotes],
    });

    setIsNoteModalOpen(false);
    setNoteForm({ note: '', isPrivate: false, category: 'GENERAL' });
    toast.success('Note Added', 'Internal staff note saved.');
  };

  return (
    <div className="space-y-6 pb-20 text-left">
      {/* 1. NAVIGATION BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/customers" className="flex items-center gap-1 hover:text-amber-600 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Customers Directory
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-900 dark:text-slate-100">{customer.fullName}</span>
      </div>

      {/* 2. CUSTOMER 360 HEADER & AT-A-GLANCE SUMMARY */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Profile Identity */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold text-2xl shadow-md">
              {customer.fullName.split(' ').map((n) => n[0]).join('')}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {customer.fullName}
                </h1>
                {customer.tags.map((tag, idx) => (
                  <Badge key={idx} variant={tag === 'VIP' ? 'warning' : 'default'}>
                    {tag}
                  </Badge>
                ))}
                {customer.activeMembershipTier && (
                  <span className="rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    {customer.activeMembershipTier}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono font-semibold text-slate-700 dark:text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-amber-600" />
                  {customer.phone}
                </span>
                {customer.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {customer.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {customer.preferredBranchName}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Calendar className="h-3.5 w-3.5" />}
              onClick={() => {
                toast.info(`Appointment scheduling opened for ${customer.fullName}`);
                router.push('/appointments');
              }}
            >
              Book Appointment
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Wallet className="h-3.5 w-3.5 text-emerald-600" />}
              onClick={() => setIsTopupModalOpen(true)}
            >
              Top-up Wallet
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Scissors className="h-3.5 w-3.5 text-amber-600" />}
              onClick={() => setIsFormulaModalOpen(true)}
            >
              Log Formula
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ShieldCheck className="h-3.5 w-3.5 text-sky-600" />}
              onClick={() => setIsPatchTestModalOpen(true)}
            >
              Record Patch Test
            </Button>
          </div>
        </div>

        {/* At-a-Glance Stat Chips (INR ₹) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Lifetime Spend
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5 block">
              {formatCurrency(customer.totalSpent)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
              Prepaid Wallet
            </span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 tabular-nums mt-0.5 block">
              {formatCurrency(customer.walletBalance)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
              Loyalty Points
            </span>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300 tabular-nums mt-0.5 block">
              {customer.loyaltyPoints} pts
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Visits
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5 block">
              {customer.totalVisits} Visits
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Last Visit
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {customer.lastVisitAt ? new Date(customer.lastVisitAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'None'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
            <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wider block">
              Next Appointment
            </span>
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 mt-0.5 block truncate">
              {customer.nextAppointmentAt || 'None Scheduled'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. 12 INTERACTIVE TABS */}
      <Tabs
        tabs={profileTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="overflow-x-auto pb-1"
      />

      {/* =========================================================================
          TAB 1: OVERVIEW & CHRONOLOGICAL TIMELINE
      ========================================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Key Highlights & Allergy Alerts */}
          <div className="lg:col-span-5 space-y-4">
            {/* Allergy & Safety Alert Card */}
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                <AlertTriangle className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Client Safety & Sensitivity Alerts</h4>
              </div>
              <ul className="text-xs text-rose-900 dark:text-rose-200 space-y-1 list-disc pl-4">
                <li><strong>Allergy:</strong> Ammonia (Avoid permanent high-lift dyes without patch test)</li>
                <li><strong>Scalp Sensitivity:</strong> High sensitivity to direct heat blow-drying</li>
                <li><strong>Patch Test:</strong> Passed L&apos;Oréal Majirel PPD test (Valid until Feb 2027)</li>
              </ul>
            </div>

            {/* Client Profile Details Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Client Information</CardTitle>
                <CardDescription>Core demographic and service preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block">Preferred Stylist</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{customer.preferredStylistName || 'None assigned'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Preferred Branch</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{customer.preferredBranchName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block">Source</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{customer.customerSource}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date of Birth</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{customer.birthDate || 'Not provided'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block">Address</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{customer.address || 'No physical address stored'}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block">Client Notes</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">{customer.notes || 'No general notes.'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Staff Notes Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm">Internal Staff Notes</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsNoteModalOpen(true)} leftIcon={<Plus className="h-3 w-3" />}>
                  Add Note
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {customer.staffNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{note.authorName}</span>
                      {note.isPrivate && <Badge variant="secondary">Private</Badge>}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{note.note}</p>
                    <span className="text-[10px] text-slate-400 block">{new Date(note.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Chronological Customer Timeline */}
          <div className="lg:col-span-7 space-y-4">
            {/* Omnichannel Filter Header */}
            <Card>
              <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm">Unified Omnichannel Customer History</CardTitle>
                  <CardDescription>Audited sequence combining Salon Services, POS In-Store Bills, and Online Orders</CardDescription>
                </div>

                {/* Channel Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'SALON_SERVICE', label: '💈 Services' },
                    { id: 'POS_PURCHASE', label: '🧾 POS Bills' },
                    { id: 'ONLINE_ORDER', label: '🛍️ Online Store' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setTimelineChannelFilter(f.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        timelineChannelFilter === f.id
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-2">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {customer.timelineEvents
                    .filter((evt) => {
                      if (timelineChannelFilter === 'ALL') return true;
                      return evt.channel === timelineChannelFilter;
                    })
                    .map((evt) => {
                      const channelBadge =
                        evt.channel === 'SALON_SERVICE' ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                            💈 Salon Service
                          </span>
                        ) : evt.channel === 'POS_PURCHASE' ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            🧾 POS Purchase
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
                            🛍️ Online Store
                          </span>
                        );

                      return (
                        <div key={evt.id} className="relative group text-left">
                          <div className="absolute -left-[27px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-amber-500 shadow-xs">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                          </div>
                          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1.5 hover:border-amber-500/40 transition-colors">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{evt.title}</h4>
                                {channelBadge}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(evt.occurredAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{evt.description}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: ONLINE STORE RETAIL ORDERS & PURCHASES (PHASE 15)
      ========================================================================== */}
      {activeTab === 'ecommerce' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  Online Storefront Purchases & Delivery Lifecycle
                </CardTitle>
                <CardDescription>
                  Retail orders placed via customer portal, branch in-store pickups, and courier deliveries
                </CardDescription>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total E-Com Spend</span>
                <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                  {formatCurrency(customer.omnichannelMetrics?.onlineEcommerceSpend || 7899.0)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {customer.onlineOrders?.map((ord: any) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-3"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                          {ord.orderNumber}
                        </span>
                        <Badge variant={ord.status === 'DELIVERED' ? 'success' : 'warning'}>
                          {ord.status.replace(/_/g, ' ')}
                        </Badge>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            ord.fulfillmentType === 'BRANCH_PICKUP'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                              : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30'
                          }`}
                        >
                          {ord.fulfillmentType === 'BRANCH_PICKUP' ? '🏪 IN-STORE PICKUP' : '🚚 HOME DELIVERY'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Date: {ord.date} • Paid via {ord.paymentMethod}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                        {formatCurrency(ord.grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5">
                    {ord.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {item.qty}x {item.productName} ({item.brand})
                        </span>
                        <span className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                          {formatCurrency(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Fulfillment Details */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    {ord.fulfillmentType === 'BRANCH_PICKUP' ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>
                          Pickup at <strong>{ord.pickupBranchName}</strong> (Slot: {ord.pickupSlot})
                        </span>
                        {ord.pickupOtp && (
                          <span className="font-mono bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
                            OTP: {ord.pickupOtp}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-indigo-500" />
                        <span>
                          Carrier: <strong>{ord.carrierName}</strong> • AWB: <code>{ord.trackingNumber}</code>
                        </span>
                      </div>
                    )}

                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      100% Guaranteed Authenticity
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SALON TECHNICAL PROFILE & FORMULAS (HAIR, SKIN, PATCH TESTS)
      ========================================================================== */}
      {activeTab === 'salon_profile' && (
        <div className="space-y-6">
          {/* Hair & Skin Technical Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hair Profile Card */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Scissors className="h-4 w-4 text-amber-600" />
                    Hair Technical Profile
                  </CardTitle>
                  <CardDescription>Texture, porosity, curl pattern & density</CardDescription>
                </div>
                <Badge variant="default">Verified</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block">Texture</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{customer.hairProfile?.texture || 'Fine'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block">Porosity</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{customer.hairProfile?.porosity || 'Normal'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block">Scalp Type</span>
                    <span className="font-bold text-amber-600">{customer.hairProfile?.scalpType || 'Sensitive'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block">Curl Pattern</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{customer.hairProfile?.curlPattern?.replace(/_/g, ' ') || 'Wavy (2A/2C)'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Chemical & Treatment History:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.hairProfile?.chemicalHistory?.map((h, i) => (
                      <span key={i} className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skin Profile Card */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Droplets className="h-4 w-4 text-sky-600" />
                    Skin & Aesthetic Profile
                  </CardTitle>
                  <CardDescription>Skin type, undertones, and sensitivities</CardDescription>
                </div>
                <Badge variant="info">Spa & Aesthetic</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block">Skin Type</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{customer.skinProfile?.skinType || 'Combination'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block">Undertone</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{customer.skinProfile?.undertone || 'Warm'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block mb-1">
                    Known Allergies & Sensitivities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.skinProfile?.allergies?.map((a, i) => (
                      <span key={i} className="text-[11px] bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 px-2 py-0.5 rounded font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Skin Concerns:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.skinProfile?.skinConcerns?.map((c, i) => (
                      <span key={i} className="text-[11px] bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Color Formulas Records */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Hair Color Formulation History</CardTitle>
                <CardDescription>Exact shade mixes, developer volumes, processing times, and technician notes</CardDescription>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={() => setIsFormulaModalOpen(true)}
              >
                Log New Formula
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              {customer.colorFormulas.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{f.formulaName}</span>
                      <Badge variant="warning">{f.brand}</Badge>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Applied: {new Date(f.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Formula Recipe Mix</span>
                      <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-xs">{f.formulaMix}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Developer & Ratio</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{f.developerVolume} (Ratio {f.developerRatio})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Processing Duration</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{f.processingTimeMinutes} Minutes</span>
                    </div>
                  </div>

                  {f.stylistNotes && (
                    <p className="text-slate-600 dark:text-slate-400 text-xs">
                      <strong>Stylist Notes:</strong> {f.stylistNotes}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chemical Patch Tests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Chemical Allergy & Patch Tests</CardTitle>
                <CardDescription>Regulatory safety checks with validity periods</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={() => setIsPatchTestModalOpen(true)}
              >
                Record Patch Test
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              {customer.patchTests.map((pt) => (
                <div
                  key={pt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{pt.chemicalOrBrandName}</span>
                      <Badge variant={pt.result === 'PASSED' ? 'success' : 'destructive'} showDot>
                        {pt.result}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tested: {new Date(pt.testedAt).toLocaleDateString('en-IN')} • Valid Until:{' '}
                      <strong className="text-slate-700 dark:text-slate-300">
                        {pt.validUntil ? new Date(pt.validUntil).toLocaleDateString('en-IN') : 'N/A'}
                      </strong>
                    </p>
                    {pt.notes && <p className="text-[11px] text-slate-400">{pt.notes}</p>}
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded">
                      Safety Certified
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 3: APPOINTMENTS
      ========================================================================== */}
      {activeTab === 'appointments' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Appointments History & Upcoming</CardTitle>
              <CardDescription>Complete calendar bookings with status and assigned stylists</CardDescription>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => router.push('/appointments')}
            >
              New Booking
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-14 flex-col items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 font-bold">
                    <span>{apt.time}</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{apt.service}</span>
                      <Badge variant={apt.status === 'COMPLETED' ? 'success' : 'warning'} showDot>
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Date: {apt.date} • Stylist: <strong>{apt.stylist}</strong> • {apt.branch}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatCurrency(apt.price)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info(`Rebooking ${apt.service}...`)}
                  >
                    Rebook
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 4: SERVICES HISTORY
      ========================================================================== */}
      {activeTab === 'services' && (
        <Card>
          <CardHeader>
            <CardTitle>Services & Treatments Breakdown</CardTitle>
            <CardDescription>Most frequently booked treatments and last service dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.servicesSummary?.map((svc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{svc.serviceName}</span>
                  <p className="text-[11px] text-slate-500">
                    Category: {svc.category} • Last service: {new Date(svc.lastDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">{svc.timesBooked} times booked</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 5: INVOICES & TAX RECEIPTS
      ========================================================================== */}
      {activeTab === 'invoices' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Invoices & Tax Receipts</CardTitle>
              <CardDescription>Itemized billing records with 18% GST calculation</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/pos')}>
              Open POS
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{inv.invoiceNumber}</span>
                    <Badge variant="success">{inv.status}</Badge>
                    <span className="text-[11px] text-slate-400 font-mono">({inv.date})</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{inv.items}</p>
                  <p className="text-[10px] text-slate-400">
                    Payment Method: {inv.paymentMethod} • GST (18%): {formatCurrency(inv.gst)}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatCurrency(inv.total)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedInvoice(inv);
                      setIsReceiptModalOpen(true);
                    }}
                  >
                    View Receipt
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 6: PAYMENTS LEDGER
      ========================================================================== */}
      {activeTab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>Payments & Transactions Ledger</CardTitle>
            <CardDescription>Payment settlements via UPI, Cards, Cash, and Wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.walletTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{tx.reason}</span>
                    <Badge variant={tx.type === 'CREDIT' ? 'success' : 'destructive'}>{tx.type}</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Date: {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold text-sm tabular-nums ${
                      tx.type === 'CREDIT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Balance: {formatCurrency(tx.balanceAfter)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 7: MEMBERSHIPS
      ========================================================================== */}
      {activeTab === 'memberships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-amber-300 dark:border-amber-800 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  Diamond Elite Membership
                </CardTitle>
                <CardDescription>VIP Annual Tier Privilege Program</CardDescription>
              </div>
              <Badge variant="warning">Active Tier</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-900/60 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">Membership Perks & Privileges:</span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc pl-4">
                  <li><strong>15% Discount</strong> on all hair and aesthetic services</li>
                  <li><strong>10% Cashback</strong> on retail product purchases</li>
                  <li>Priority appointment slot reservations</li>
                  <li>Complimentary birthday luxury blowdry treatment</li>
                </ul>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-slate-500">Valid Until:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">March 31, 2027</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-amber-200/40 dark:border-amber-900/40 pt-3">
              <Button variant="outline" size="sm" onClick={() => toast.info('Membership renewal initialized.')}>
                Extend / Renew Tier
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 8: PREPAID PACKAGES
      ========================================================================== */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          {customer.packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base">{pkg.packageName}</CardTitle>
                  <CardDescription>Prepaid bundled treatment sessions</CardDescription>
                </div>
                <Badge variant="success">{pkg.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sessions Used:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {pkg.usedSessions} of {pkg.totalSessions} Sessions
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${(pkg.usedSessions / pkg.totalSessions) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Expires: {pkg.expiresAt || 'No expiration'}</span>
                  <span>Package Value: {formatCurrency(pkg.totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* =========================================================================
          TAB 9: PREPAID WALLET
      ========================================================================== */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20">
            <CardHeader>
              <CardTitle className="text-sm">Current Wallet Balance</CardTitle>
              <CardDescription>Prepaid cash credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums block">
                {formatCurrency(customer.walletBalance)}
              </span>
              <p className="text-xs text-slate-500">
                Usable for any salon service, package, or retail beauty purchase.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setIsTopupModalOpen(true)}
              >
                + Top-up Wallet
              </Button>
            </CardFooter>
          </Card>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Wallet Transaction History</CardTitle>
                <CardDescription>Credits, debits, and promotional cashback logs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {customer.walletTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{tx.reason}</span>
                      <span className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <span className="font-bold text-xs tabular-nums text-emerald-600">
                      {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 10: LOYALTY REWARDS
      ========================================================================== */}
      {activeTab === 'loyalty' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-amber-200 dark:border-amber-900/60 bg-amber-50/20">
            <CardHeader>
              <CardTitle className="text-sm">Loyalty Points Balance</CardTitle>
              <CardDescription>Reward points earned from visits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <span className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 tabular-nums block">
                {customer.loyaltyPoints} pts
              </span>
              <p className="text-xs text-slate-500">
                Redeemable value: <strong>{formatCurrency(customer.loyaltyPoints * 0.5)}</strong> (₹0.50 per point).
              </p>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tier Progression Milestone</CardTitle>
                <CardDescription>Progress towards next VIP privilege milestone</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Diamond Elite (Current)</span>
                  <span className="text-amber-600">Black Diamond VIP (1,200 pts)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 w-[70.8%]" />
                </div>
                <span className="text-[11px] text-slate-400 block text-right">
                  350 more points to unlock Black Diamond Lifetime status
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 11: REVIEWS & CSAT
      ========================================================================== */}
      {activeTab === 'reviews' && (
        <Card>
          <CardHeader>
            <CardTitle>Client Reviews & CSAT Feedback</CardTitle>
            <CardDescription>Verified ratings and post-treatment testimonials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic text-sm">&ldquo;{rev.comment}&rdquo;</p>
                <p className="text-[11px] text-slate-400">
                  Service: <strong>{rev.serviceName}</strong> • Stylist: <strong>{rev.stylistName}</strong>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 12: MARKETING & COMMUNICATION
      ========================================================================== */}
      {activeTab === 'marketing' && (
        <Card>
          <CardHeader>
            <CardTitle>Marketing & Notification Logs</CardTitle>
            <CardDescription>Automated WhatsApp & SMS appointment reminders, promotional campaigns, and birthday greetings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.marketingLogs?.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge variant={m.channel === 'WHATSAPP' ? 'success' : 'default'}>{m.channel}</Badge>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{m.campaignName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Sent: {new Date(m.sentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <Badge variant={m.status === 'CLICKED' ? 'success' : 'info'}>{m.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          MODAL: TOP-UP WALLET
      ========================================================================== */}
      <Modal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
        title="Top-up Prepaid Wallet"
        description={`Credit funds to ${customer.fullName}'s prepaid salon account.`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsTopupModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleTopupWallet}>
              Confirm Recharge ({formatCurrency(Number(topupForm.amount))})
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <Input
            label="Recharge Amount (INR ₹)"
            type="number"
            value={topupForm.amount}
            onChange={(e) => setTopupForm({ ...topupForm, amount: e.target.value })}
            helperText="Minimum recharge ₹100.00"
            required
          />
          <Select
            label="Payment Mode"
            value={topupForm.paymentMethod}
            onChange={(e) => setTopupForm({ ...topupForm, paymentMethod: e.target.value })}
            options={[
              { label: 'UPI / QR Code', value: 'UPI' },
              { label: 'Credit / Debit Card', value: 'CARD' },
              { label: 'Cash at Reception', value: 'CASH' },
            ]}
            required
          />
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300">
            <strong>Festive Privilege:</strong> 5% Bonus cashback ({formatCurrency(Number(topupForm.amount) * 0.05)}) will be credited automatically.
          </div>
        </div>
      </Modal>

      {/* =========================================================================
          MODAL: LOG COLOR FORMULA
      ========================================================================== */}
      <Modal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        title="Log Hair Color Formulation"
        description="Record exact shade mix ratio, developer volume, and processing time."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsFormulaModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddFormula}>
              Save Formulation
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Formula Name / Target Style"
              placeholder="e.g. Warm Honey Balayage Gloss"
              value={formulaForm.formulaName}
              onChange={(e) => setFormulaForm({ ...formulaForm, formulaName: e.target.value })}
              required
            />
            <Select
              label="Color Product Line"
              value={formulaForm.brand}
              onChange={(e) => setFormulaForm({ ...formulaForm, brand: e.target.value })}
              options={[
                { label: "L'Oréal Professionnel Dia Richesse", value: "L'Oréal Professionnel Dia Richesse" },
                { label: "L'Oréal Professionnel Majirel", value: "L'Oréal Professionnel Majirel" },
                { label: 'Wella Professionals Illumina Color', value: 'Wella Professionals Illumina Color' },
                { label: 'Schwarzkopf Igora Royal', value: 'Schwarzkopf Igora Royal' },
              ]}
              required
            />
          </div>

          <Input
            label="Shade Mix Ratio"
            placeholder="e.g. 7.13 (30g) + 8.3 (15g) + Clear (10g)"
            value={formulaForm.formulaMix}
            onChange={(e) => setFormulaForm({ ...formulaForm, formulaMix: e.target.value })}
            helperText="Include shade codes and gram weights"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Developer Volume"
              value={formulaForm.developerVolume}
              onChange={(e) => setFormulaForm({ ...formulaForm, developerVolume: e.target.value })}
              options={[
                { label: '6 Vol (1.9%)', value: '6 Vol (1.9%)' },
                { label: '9 Vol (2.7%)', value: '9 Vol (2.7%)' },
                { label: '20 Vol (6%)', value: '20 Vol (6%)' },
                { label: '30 Vol (9%)', value: '30 Vol (9%)' },
              ]}
              required
            />
            <Input
              label="Developer Ratio"
              placeholder="1:1.5"
              value={formulaForm.developerRatio}
              onChange={(e) => setFormulaForm({ ...formulaForm, developerRatio: e.target.value })}
            />
            <Input
              label="Processing Time (Minutes)"
              type="number"
              value={String(formulaForm.processingTimeMinutes)}
              onChange={(e) => setFormulaForm({ ...formulaForm, processingTimeMinutes: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Stylist Application Notes"
            placeholder="e.g. Applied at basin on towel-dried hair. Emulsified for last 5 minutes."
            value={formulaForm.stylistNotes}
            onChange={(e) => setFormulaForm({ ...formulaForm, stylistNotes: e.target.value })}
          />
        </div>
      </Modal>

      {/* =========================================================================
          MODAL: RECORD PATCH TEST
      ========================================================================== */}
      <Modal
        isOpen={isPatchTestModalOpen}
        onClose={() => setIsPatchTestModalOpen(false)}
        title="Record Chemical Patch Test"
        description="Verify allergy compliance before chemical treatments."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsPatchTestModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleRecordPatchTest}>
              Save Test Result
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <Select
            label="Treatment Chemical Type"
            value={patchTestForm.testType}
            onChange={(e) => setPatchTestForm({ ...patchTestForm, testType: e.target.value })}
            options={[
              { label: 'Hair Color & Dye (PPD Allergen Check)', value: 'HAIR_COLOR_DYE' },
              { label: 'Bleach & Lightener', value: 'BLEACH' },
              { label: 'Keratin / Smoothing Complex', value: 'KERATIN' },
              { label: 'Chemical Peel & Facial Acid', value: 'CHEMICAL_PEEL' },
              { label: 'Lash Extension Glue', value: 'LASH_GLUE' },
            ]}
            required
          />
          <Input
            label="Product Tested"
            value={patchTestForm.chemicalOrBrandName}
            onChange={(e) => setPatchTestForm({ ...patchTestForm, chemicalOrBrandName: e.target.value })}
            required
          />
          <Select
            label="Test Result (After 24h/48h)"
            value={patchTestForm.result}
            onChange={(e) => setPatchTestForm({ ...patchTestForm, result: e.target.value })}
            options={[
              { label: 'PASSED (Zero reaction, safe to treat)', value: 'PASSED' },
              { label: 'FAILED (Redness / swelling detected, do NOT treat)', value: 'FAILED' },
              { label: 'PENDING (Under observation)', value: 'PENDING' },
            ]}
            required
          />
          <Input
            label="Technician Observation Notes"
            value={patchTestForm.notes}
            onChange={(e) => setPatchTestForm({ ...patchTestForm, notes: e.target.value })}
          />
        </div>
      </Modal>

      {/* =========================================================================
          MODAL: ADD INTERNAL NOTE
      ========================================================================== */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Staff Note"
        description="Internal notes visible across authorized reception and stylists."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddNote}>
              Add Note
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <Select
            label="Note Category"
            value={noteForm.category}
            onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
            options={[
              { label: 'General Reception', value: 'GENERAL' },
              { label: 'Technical Formula & Hair', value: 'TECH_FORMULA' },
              { label: 'Behavioral & Preferences', value: 'BEHAVIORAL' },
              { label: 'Medical & Allergies', value: 'MEDICAL' },
            ]}
          />
          <Input
            label="Note Description"
            placeholder="Type confidential note..."
            value={noteForm.note}
            onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })}
            required
          />
        </div>
      </Modal>

      {/* =========================================================================
          MODAL: THERMAL INVOICE RECEIPT PREVIEW
      ========================================================================== */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Thermal Tax Receipt Preview"
        description="Format printed on POS thermal printers & sent via WhatsApp."
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsReceiptModalOpen(false)}>
            Close Receipt
          </Button>
        }
      >
        {selectedInvoice && (
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs space-y-3 text-left">
            <div className="text-center border-b border-dashed border-slate-300 pb-2">
              <div className="font-bold text-sm">HIVE LUXURY SALON & SPA</div>
              <div className="text-[10px] text-slate-500">Jubilee Hills Flagship • GSTIN: 36AAAAA0000A1Z5</div>
            </div>

            <div className="flex justify-between text-[11px]">
              <span>Invoice: {selectedInvoice.invoiceNumber}</span>
              <span>Date: {selectedInvoice.date}</span>
            </div>
            <div className="text-[11px]">Customer: {customer.fullName} ({customer.phone})</div>

            <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Items</span>
                <span>Amount</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>{selectedInvoice.items}</span>
                <span>{formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%):</span>
                <span>{formatCurrency(selectedInvoice.gst / 2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%):</span>
                <span>{formatCurrency(selectedInvoice.gst / 2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-300">
                <span>Total Paid:</span>
                <span>{formatCurrency(selectedInvoice.total)}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-dashed border-slate-300">
              Thank you for visiting Hive Salon! • Powered by Hive ERP
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
