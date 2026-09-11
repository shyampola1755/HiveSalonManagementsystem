'use client';

import * as React from 'react';
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
  ShoppingBag,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Phone,
  User,
  Calendar,
  CreditCard,
  QrCode,
  Printer,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Receipt,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type {
  RetailOrder,
  OrderStatus,
  FulfillmentType,
  DeliveryProviderId,
  RetailOrderItem,
} from '@hive/types';

// Mock Initial Orders Data for Retail Omnichannel Sales
const INITIAL_ORDERS: RetailOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'HIVE-ORD-2026-00481',
    organizationId: 'org_hive_demo',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'priya.sharma@example.com',
    fulfillmentType: 'BRANCH_PICKUP',
    pickupBranchId: 'b1',
    pickupBranchName: 'Jubilee Hills Flagship Sanctuary',
    pickupBranchAddress: 'Plot 42, Road No. 36, Jubilee Hills, Hyderabad',
    pickupBranchPhone: '+91 40 2355 8899',
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
        description: 'Payment authorized via UPI + Wallet. Stock reserved at Jubilee Hills Branch.',
        updatedBy: 'Priya Sharma (Customer)',
      },
      {
        id: 'sh-2',
        status: 'CONFIRMED',
        timestamp: '2026-09-10T09:30:00Z',
        title: 'Order Confirmed by Branch',
        description: 'Jubilee Hills dispatch team acknowledged branch pickup preparation.',
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
        description: 'Customer notified with 4-digit Pickup OTP (7419). Ready for collection.',
        updatedBy: 'Sarah Jenkins (Branch Manager)',
      },
    ],
    notes: 'Customer will collect during scheduled haircut appointment on Sep 12.',
    createdAt: '2026-09-10T09:15:00Z',
    updatedAt: '2026-09-10T11:30:00Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'HIVE-ORD-2026-00482',
    organizationId: 'org_hive_demo',
    customerId: 'c2',
    customerName: 'Aarav Mehta',
    customerPhone: '+91 98450 11223',
    customerEmail: 'aarav.mehta@example.com',
    fulfillmentType: 'HOME_DELIVERY',
    shippingAddress: {
      fullName: 'Aarav Mehta',
      phone: '+91 98450 11223',
      addressLine1: 'Villa 14, Palm Meadows',
      addressLine2: 'Airport Road, Varthur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      landmark: 'Near Palm Meadows Clubhouse',
    },
    deliveryProvider: 'DUNZO',
    deliveryProviderName: 'Dunzo / Shadowfax Hyperlocal Express (60–90 Mins)',
    trackingNumber: 'DNZ-98234109',
    trackingUrl: 'https://track.dunzo.com/express/DNZ-98234109',
    estimatedDeliveryDate: '2026-09-10',
    dispatchedAt: '2026-09-10T12:00:00Z',
    deliveredAt: null,
    deliveryCheckpoints: [
      {
        timestamp: '2026-09-10T11:30:00Z',
        status: 'DISPATCHED',
        location: 'Hive Indiranagar Flagship Hub',
        description: 'Assigned to Dunzo Partner: Ramesh V. (+91 98765 11223).',
      },
      {
        timestamp: '2026-09-10T12:00:00Z',
        status: 'OUT_FOR_DELIVERY',
        location: 'Varthur Main Road (Live GPS)',
        description: 'Driver on bike en-route. Estimated delivery in 25 mins.',
      },
    ],
    items: [
      {
        id: 'item-3',
        orderId: 'ord-102',
        productId: 'prod-kerastase-chronologiste',
        productName: 'Kérastase Chronologiste Pré-Cleanse Régénérant',
        productSku: 'KRS-CHRN-200',
        productBrand: 'Kérastase Paris',
        productImageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
        volumeSize: '200 ml',
        quantity: 2,
        unitPrice: 3450.0,
        mrp: 3900.0,
        taxRate: 18.0,
        taxAmount: 1052.54,
        totalPrice: 6900.0,
      },
    ],
    subtotal: 5847.46,
    taxTotal: 1052.54,
    discountTotal: 0.0,
    deliveryFee: 199.0,
    grandTotal: 7099.0,
    finalPaidAmount: 7099.0,
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    transactionReference: 'UPI-RAZORPAY-882190',
    status: 'OUT_FOR_DELIVERY',
    statusHistory: [
      {
        id: 'sh-5',
        status: 'PLACED',
        timestamp: '2026-09-10T10:00:00Z',
        title: 'Order Placed Online',
        description: 'Instant Dunzo express requested.',
        updatedBy: 'Aarav Mehta',
      },
      {
        id: 'sh-6',
        status: 'CONFIRMED',
        timestamp: '2026-09-10T10:15:00Z',
        title: 'Confirmed by Dispatch Hub',
        description: 'Indiranagar branch approved order.',
        updatedBy: 'Kavita Nair',
      },
      {
        id: 'sh-7',
        status: 'PACKED',
        timestamp: '2026-09-10T11:00:00Z',
        title: 'Packed & Handover Ready',
        description: 'Tamper-evident luxury seal applied.',
        updatedBy: 'Rajesh K.',
      },
      {
        id: 'sh-8',
        status: 'OUT_FOR_DELIVERY',
        timestamp: '2026-09-10T11:30:00Z',
        title: 'Out for Delivery with Dunzo',
        description: 'Assigned tracking ID DNZ-98234109.',
        updatedBy: 'System Auto-Dispatch',
      },
    ],
    notes: 'Please leave with security if doorbell not answered.',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-10T11:30:00Z',
  },
  {
    id: 'ord-103',
    orderNumber: 'HIVE-ORD-2026-00483',
    organizationId: 'org_hive_demo',
    customerId: 'c3',
    customerName: 'Meera Kapoor',
    customerPhone: '+91 97112 33445',
    customerEmail: 'meera.kapoor@example.com',
    fulfillmentType: 'HOME_DELIVERY',
    shippingAddress: {
      fullName: 'Meera Kapoor',
      phone: '+91 97112 33445',
      addressLine1: 'B-402, Prestige Golfshire Towers',
      addressLine2: 'Nandi Hills Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '562110',
    },
    deliveryProvider: 'BLUEDART',
    deliveryProviderName: 'Blue Dart Apex Priority Air',
    trackingNumber: 'BLU849201948',
    trackingUrl: 'https://www.bluedart.com/tracking?trackid=BLU849201948',
    estimatedDeliveryDate: '2026-09-11',
    dispatchedAt: null,
    deliveredAt: null,
    items: [
      {
        id: 'item-4',
        orderId: 'ord-103',
        productId: 'prod-dyson-supersonic-pro',
        productName: 'Dyson Supersonic™ Professional Edition Hair Dryer',
        productSku: 'DYS-SPRS-PRO',
        productBrand: 'Dyson Professional',
        productImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        volumeSize: 'Complete Professional Tool Kit',
        quantity: 1,
        unitPrice: 36900.0,
        mrp: 39900.0,
        taxRate: 18.0,
        taxAmount: 5628.81,
        totalPrice: 36900.0,
      },
    ],
    subtotal: 31271.19,
    taxTotal: 5628.81,
    discountTotal: 1000.0,
    couponCode: 'FIRSTPRO1000',
    couponDiscount: 1000.0,
    deliveryFee: 249.0,
    grandTotal: 36149.0,
    finalPaidAmount: 36149.0,
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    transactionReference: 'CARD-AUTH-909812',
    status: 'PACKED',
    statusHistory: [
      {
        id: 'sh-9',
        status: 'PLACED',
        timestamp: '2026-09-10T11:00:00Z',
        title: 'Order Placed',
        description: 'Dyson Supersonic Pro Edition ordered via Card.',
        updatedBy: 'Meera Kapoor',
      },
      {
        id: 'sh-10',
        status: 'CONFIRMED',
        timestamp: '2026-09-10T11:15:00Z',
        title: 'Order Confirmed',
        description: 'Serial number verified against warranty database.',
        updatedBy: 'Sarah Jenkins',
      },
      {
        id: 'sh-11',
        status: 'PACKED',
        timestamp: '2026-09-10T12:30:00Z',
        title: 'Packed in High-Security Box',
        description: 'Insured package ready for Blue Dart air cargo pickup.',
        updatedBy: 'Rajesh K.',
      },
    ],
    notes: 'Fragile electrical appliance. High-value insurance transit.',
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-09-10T12:30:00Z',
  },
  {
    id: 'ord-104',
    orderNumber: 'HIVE-ORD-2026-00484',
    organizationId: 'org_hive_demo',
    customerId: 'c4',
    customerName: 'Rohan Varma',
    customerPhone: '+91 99887 66554',
    customerEmail: 'rohan.varma@example.com',
    fulfillmentType: 'BRANCH_PICKUP',
    pickupBranchId: 'b2',
    pickupBranchName: 'Banjara Hills Spa & Lounge',
    pickupBranchAddress: 'Road No. 12, Banjara Hills, Hyderabad',
    pickupBranchPhone: '+91 40 2333 4455',
    pickupDate: '2026-09-10',
    pickupSlot: '04:00 PM – 07:00 PM',
    pickupOtp: '3182',
    items: [
      {
        id: 'item-5',
        orderId: 'ord-104',
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
    deliveryFee: 0.0,
    grandTotal: 1950.0,
    finalPaidAmount: 1950.0,
    paymentStatus: 'PAID',
    paymentMethod: 'WALLET',
    transactionReference: 'WALLET-TXN-881290',
    status: 'PLACED',
    statusHistory: [
      {
        id: 'sh-12',
        status: 'PLACED',
        timestamp: '2026-09-10T12:45:00Z',
        title: 'Order Placed via Guest Wallet',
        description: 'Prepaid wallet debited ₹1,950. Stock reserved at Banjara Hills.',
        updatedBy: 'Rohan Varma',
      },
    ],
    createdAt: '2026-09-10T12:45:00Z',
    updatedAt: '2026-09-10T12:45:00Z',
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
    },
    deliveryProvider: 'DELHIVERY',
    deliveryProviderName: 'Delhivery National Express Surface / Air',
    trackingNumber: 'DLV8910294812',
    trackingUrl: 'https://www.delhivery.com/track/package/DLV8910294812',
    estimatedDeliveryDate: '2026-08-20',
    dispatchedAt: '2026-08-18T14:00:00Z',
    deliveredAt: '2026-08-20T16:30:00Z',
    items: [
      {
        id: 'item-6',
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
        id: 'sh-13',
        status: 'DELIVERED',
        timestamp: '2026-08-20T16:30:00Z',
        title: 'Order Delivered to Customer Doorstep',
        description: 'Delivered by Delhivery with OTP signature.',
        updatedBy: 'Delhivery Partner',
      },
    ],
    createdAt: '2026-08-17T18:20:00Z',
    updatedAt: '2026-08-20T16:30:00Z',
  },
];

export default function AdminOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = React.useState<RetailOrder[]>(INITIAL_ORDERS);
  const [selectedTab, setSelectedTab] = React.useState<string>('ALL');
  const [fulfillmentFilter, setFulfillmentFilter] = React.useState<string>('ALL');
  const [branchFilter, setBranchFilter] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Modals state
  const [selectedOrder, setSelectedOrder] = React.useState<RetailOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState<boolean>(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = React.useState<boolean>(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = React.useState<boolean>(false);
  const [isPackingSlipOpen, setIsPackingSlipOpen] = React.useState<boolean>(false);
  const [isStockAuditOpen, setIsStockAuditOpen] = React.useState<boolean>(false);

  // OTP Verification Form
  const [inputOtp, setInputOtp] = React.useState<string>('');

  // Dispatch Form
  const [selectedCarrier, setSelectedCarrier] = React.useState<DeliveryProviderId>('INTERNAL_FLEET');
  const [trackingNote, setTrackingNote] = React.useState<string>('Dispatched via salon concierge.');

  // Pipeline Status Tabs Configuration
  const orderTabs = [
    { id: 'ALL', label: 'All Orders', count: orders.length },
    { id: 'PLACED', label: 'Placed / New', count: orders.filter((o) => o.status === 'PLACED').length },
    { id: 'CONFIRMED', label: 'Confirmed', count: orders.filter((o) => o.status === 'CONFIRMED').length },
    { id: 'PACKED', label: 'Packed', count: orders.filter((o) => o.status === 'PACKED').length },
    { id: 'READY_FOR_PICKUP', label: 'Ready for Pickup', count: orders.filter((o) => o.status === 'READY_FOR_PICKUP').length },
    { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', count: orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length },
    { id: 'DELIVERED', label: 'Delivered / Collected', count: orders.filter((o) => o.status === 'DELIVERED').length },
    { id: 'CANCELLED', label: 'Cancelled / Returned', count: orders.filter((o) => o.status === 'CANCELLED' || o.status === 'RETURNED').length },
  ];

  // Filtered Orders
  const filteredOrders = React.useMemo(() => {
    return orders.filter((ord) => {
      // Tab filter
      if (selectedTab === 'CANCELLED') {
        if (ord.status !== 'CANCELLED' && ord.status !== 'RETURNED') return false;
      } else if (selectedTab !== 'ALL' && ord.status !== selectedTab) {
        return false;
      }

      // Fulfillment filter
      if (fulfillmentFilter !== 'ALL' && ord.fulfillmentType !== fulfillmentFilter) {
        return false;
      }

      // Branch filter
      if (branchFilter !== 'ALL' && ord.pickupBranchId !== branchFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = ord.orderNumber.toLowerCase().includes(q);
        const matchCustomer = ord.customerName.toLowerCase().includes(q);
        const matchPhone = ord.customerPhone.includes(q);
        const matchProduct = ord.items.some((i) => i.productName.toLowerCase().includes(q) || i.productSku.toLowerCase().includes(q));
        if (!matchNumber && !matchCustomer && !matchPhone && !matchProduct) return false;
      }

      return true;
    });
  }, [orders, selectedTab, fulfillmentFilter, branchFilter, searchQuery]);

  // Handler: Advance Order Status
  const handleTransitionStatus = (orderId: string, nextStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const now = new Date().toISOString();
        const historyItem = {
          id: `sh_${Date.now()}`,
          status: nextStatus,
          timestamp: now,
          title: `Status Changed: ${nextStatus.replace(/_/g, ' ')}`,
          description: note || `Order transitioned to ${nextStatus.replace(/_/g, ' ')} by Sarah Jenkins (Manager).`,
          updatedBy: 'Sarah Jenkins (Branch Manager)',
        };

        return {
          ...ord,
          status: nextStatus,
          readyForPickupAt: nextStatus === 'READY_FOR_PICKUP' ? now : ord.readyForPickupAt,
          dispatchedAt: nextStatus === 'OUT_FOR_DELIVERY' ? now : ord.dispatchedAt,
          deliveredAt: nextStatus === 'DELIVERED' ? now : ord.deliveredAt,
          collectedAt: nextStatus === 'DELIVERED' && ord.fulfillmentType === 'BRANCH_PICKUP' ? now : ord.collectedAt,
          statusHistory: [historyItem, ...ord.statusHistory],
          updatedAt: now,
        };
      })
    );

    toast.success('Order Status Updated', `Order ${orderId} moved to ${nextStatus.replace(/_/g, ' ')}.`);
  };

  // Handler: Verify In-Branch Pickup OTP
  const handleVerifyOtp = () => {
    if (!selectedOrder) return;

    if (inputOtp.trim() !== selectedOrder.pickupOtp) {
      toast.error('Invalid Pickup OTP', 'The 4-digit verification code does not match. Please request customer to check guest portal.');
      return;
    }

    handleTransitionStatus(
      selectedOrder.id,
      'DELIVERED',
      `4-Digit OTP (${inputOtp}) verified at reception desk. Package handed over to ${selectedOrder.customerName}.`
    );

    setIsOtpModalOpen(false);
    setInputOtp('');
    toast.success('Pickup Verified & Complete! 🎉', `Order #${selectedOrder.orderNumber} handed over to ${selectedOrder.customerName}.`);
  };

  // Handler: Dispatch with Delivery Carrier
  const handleDispatchCarrier = () => {
    if (!selectedOrder) return;

    const carrierNames: Record<DeliveryProviderId, string> = {
      INTERNAL_FLEET: 'Hive Salon Concierge Express',
      DUNZO: 'Dunzo / Shadowfax Hyperlocal (60–90 Mins)',
      DELHIVERY: 'Delhivery National Express',
      BLUEDART: 'Blue Dart Apex Priority Air',
      SHADOWFAX: 'Shadowfax Quick Commerce',
    };

    const trackingPrefixes: Record<DeliveryProviderId, string> = {
      INTERNAL_FLEET: 'HIVE-CNC-',
      DUNZO: 'DNZ-',
      DELHIVERY: 'DLV',
      BLUEDART: 'BLU',
      SHADOWFAX: 'SFX-',
    };

    const newTracking = `${trackingPrefixes[selectedCarrier]}${Math.floor(10000000 + Math.random() * 90000000)}`;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== selectedOrder.id) return ord;
        const now = new Date().toISOString();
        return {
          ...ord,
          status: 'OUT_FOR_DELIVERY',
          deliveryProvider: selectedCarrier,
          deliveryProviderName: carrierNames[selectedCarrier],
          trackingNumber: newTracking,
          trackingUrl: `https://track.hivesalon.com/${selectedCarrier.toLowerCase()}/${newTracking}`,
          dispatchedAt: now,
          statusHistory: [
            {
              id: `sh_${Date.now()}`,
              status: 'OUT_FOR_DELIVERY',
              timestamp: now,
              title: `Dispatched with ${carrierNames[selectedCarrier]}`,
              description: `Tracking number generated: ${newTracking}. Package collected from branch dispatch bay.`,
              updatedBy: 'Sarah Jenkins (Manager)',
            },
            ...ord.statusHistory,
          ],
        };
      })
    );

    setIsDispatchModalOpen(false);
    toast.success('Shipment Dispatched! 🚚', `Order #${selectedOrder.orderNumber} assigned to ${carrierNames[selectedCarrier]} (AWB: ${newTracking}).`);
  };

  // Status Badge Colors & Labels
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return <Badge variant="warning">PLACED (NEW)</Badge>;
      case 'CONFIRMED':
        return <Badge variant="default">CONFIRMED</Badge>;
      case 'PACKED':
        return <Badge variant="default">PACKED</Badge>;
      case 'READY_FOR_PICKUP':
        return <Badge variant="warning">READY FOR PICKUP</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge variant="info">OUT FOR DELIVERY</Badge>;
      case 'DELIVERED':
        return <Badge variant="success">DELIVERED</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">CANCELLED</Badge>;
      case 'RETURNED':
        return <Badge variant="destructive">RETURNED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP HEADER & DASHBOARD SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
              PHASE 15 — RETAIL E-COMMERCE & OMNICHANNEL
            </span>
            <span className="text-xs text-slate-400 font-mono">Strict Never-Oversell Sync</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Retail Orders & Omnichannel Sales Hub</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Centralized fulfillment command center for online storefront orders, in-salon branch pickups with 4-digit OTP verification, multi-carrier delivery dispatches, and real-time inventory synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
            onClick={() => setIsStockAuditOpen(true)}
          >
            Inventory Sync Audit
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => toast.success('Orders Synced', 'Real-time order pipeline refreshed.')}
          >
            Sync Orders
          </Button>
        </div>
      </div>

      {/* 2. AT-A-GLANCE KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total Retail Orders"
          value={orders.length.toString()}
          icon={<ShoppingBag className="w-4 h-4 text-amber-500" />}
          subtitle="+24% vs last week"
        />
        <StatCard
          title="Today Retail Revenue"
          value={formatCurrency(
            orders
              .filter((o) => o.status !== 'CANCELLED' && o.status !== 'RETURNED')
              .reduce((acc, curr) => acc + curr.grandTotal, 0)
          )}
          icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
          subtitle="₹48,250 target"
        />
        <StatCard
          title="Pending Packing"
          value={orders.filter((o) => o.status === 'PLACED' || o.status === 'CONFIRMED').length.toString()}
          icon={<Package className="w-4 h-4 text-amber-500" />}
          subtitle="Action required"
        />
        <StatCard
          title="Ready for Pickup"
          value={orders.filter((o) => o.status === 'READY_FOR_PICKUP').length.toString()}
          icon={<MapPin className="w-4 h-4 text-sky-500" />}
          subtitle="At Reception Bay"
        />
        <StatCard
          title="Out for Delivery"
          value={orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length.toString()}
          icon={<Truck className="w-4 h-4 text-indigo-500" />}
          subtitle="Live GPS tracking"
        />
        <StatCard
          title="Fulfilled Today"
          value={orders.filter((o) => o.status === 'DELIVERED').length.toString()}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          subtitle="100% On-Time"
        />
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order #, customer, phone, SKU..."
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Quick Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Select
                value={fulfillmentFilter}
                onChange={(e) => setFulfillmentFilter(e.target.value)}
                className="h-9 text-xs w-44"
                options={[
                  { label: 'All Fulfillment Types', value: 'ALL' },
                  { label: 'In-Store Branch Pickup', value: 'BRANCH_PICKUP' },
                  { label: 'Doorstep Home Delivery', value: 'HOME_DELIVERY' },
                ]}
              />

              <Select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="h-9 text-xs w-44"
                options={[
                  { label: 'All Salon Branches', value: 'ALL' },
                  { label: 'Jubilee Hills Flagship', value: 'b1' },
                  { label: 'Banjara Hills Spa', value: 'b2' },
                  { label: 'Hitech City Express', value: 'b3' },
                  { label: 'Indiranagar Sanctuary', value: 'b4' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. ORDER LIFECYCLE TABS */}
      <Tabs
        tabs={orderTabs}
        activeTab={selectedTab}
        onChange={setSelectedTab}
        variant="pills"
        className="overflow-x-auto pb-1"
      />

      {/* 5. ORDERS LIST & PIPELINE CARDS */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
              <h3 className="text-base font-bold text-slate-200">No Orders Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                There are no retail orders matching the selected filter criteria. Try resetting the filters or searching for another term.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSelectedTab('ALL');
                  setFulfillmentFilter('ALL');
                  setBranchFilter('ALL');
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((ord) => (
            <Card key={ord.id} className="overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all shadow-xs">
              <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                {/* Order Top Bar: Number, Customer & Badges */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                      {ord.orderNumber}
                    </span>
                    {renderStatusBadge(ord.status)}
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

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      {ord.customerName}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {ord.customerPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(ord.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Financial Summary Pill */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Grand Total</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCurrency(ord.grandTotal)}
                    </span>
                  </div>
                  <div className="text-right pl-3 border-l border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Paid Via</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {ord.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Body: Items & Fulfillment Destination */}
              <CardContent className="p-4 sm:p-5">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Product Items List */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Ordered Items ({ord.items.length})
                    </span>
                    <div className="space-y-2">
                      {ord.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.productImageUrl}
                              alt={item.productName}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div>
                              <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block line-clamp-1">
                                {item.productName}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                {item.productBrand} • SKU: {item.productSku} • Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums shrink-0">
                            {formatCurrency(item.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Fulfillment & Destination Details */}
                  <div className="lg:col-span-5 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Fulfillment & Tracking
                      </span>

                      {ord.fulfillmentType === 'BRANCH_PICKUP' ? (
                        <div className="space-y-1.5 text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            {ord.pickupBranchName}
                          </p>
                          <p className="text-slate-400 text-[11px] pl-5">
                            Slot: {ord.pickupDate} ({ord.pickupSlot})
                          </p>
                          {ord.pickupOtp && (
                            <div className="mt-2 inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-xl font-mono text-xs font-bold">
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Pickup OTP: {ord.pickupOtp}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1.5 text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-indigo-500" />
                            {ord.deliveryProviderName || 'Carrier Pending'}
                          </p>
                          <p className="text-slate-400 text-[11px] pl-5">
                            {ord.shippingAddress?.addressLine1}, {ord.shippingAddress?.city} - {ord.shippingAddress?.pincode}
                          </p>
                          {ord.trackingNumber && (
                            <p className="text-[11px] font-mono pl-5 text-indigo-600 dark:text-indigo-400 font-bold">
                              AWB / Tracking: {ord.trackingNumber}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons for this Order */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 mt-3">
                      {ord.status === 'PLACED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                          onClick={() => handleTransitionStatus(ord.id, 'CONFIRMED')}
                        >
                          Confirm Order
                        </Button>
                      )}

                      {ord.status === 'CONFIRMED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Package className="w-3.5 h-3.5" />}
                          onClick={() => handleTransitionStatus(ord.id, 'PACKED')}
                        >
                          Pack & Ready
                        </Button>
                      )}

                      {ord.status === 'PACKED' && ord.fulfillmentType === 'BRANCH_PICKUP' && (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<MapPin className="w-3.5 h-3.5" />}
                          onClick={() => handleTransitionStatus(ord.id, 'READY_FOR_PICKUP')}
                        >
                          Notify Ready for Pickup
                        </Button>
                      )}

                      {ord.status === 'PACKED' && ord.fulfillmentType === 'HOME_DELIVERY' && (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Truck className="w-3.5 h-3.5" />}
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsDispatchModalOpen(true);
                          }}
                        >
                          Dispatch with Carrier
                        </Button>
                      )}

                      {ord.status === 'READY_FOR_PICKUP' && (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsOtpModalOpen(true);
                          }}
                        >
                          Verify OTP & Handover
                        </Button>
                      )}

                      {ord.status === 'OUT_FOR_DELIVERY' && (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          onClick={() => handleTransitionStatus(ord.id, 'DELIVERED', 'Delivered to customer doorstep.')}
                        >
                          Mark Delivered
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setSelectedOrder(ord);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        Details & Timeline
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Printer className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setSelectedOrder(ord);
                          setIsPackingSlipOpen(true);
                        }}
                      >
                        Slip
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* =========================================================================
          MODAL 1: ORDER DETAILS & COMPREHENSIVE TIMELINE
      ========================================================================== */}
      {isDetailsModalOpen && selectedOrder && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={`Order Details: ${selectedOrder.orderNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-6 text-left">
            {/* Top Overview */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Customer</span>
                <h3 className="text-base font-bold text-white">{selectedOrder.customerName}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedOrder.customerPhone} • {selectedOrder.customerEmail}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Status</span>
                {renderStatusBadge(selectedOrder.status)}
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ordered Items</h4>
              <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-950 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.productImageUrl} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="font-semibold text-slate-200 block">{item.productName}</span>
                        <span className="text-[10px] text-slate-400">{item.productBrand} • SKU: {item.productSku} • Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-100 tabular-nums">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal (Excl. GST)</span>
                <span className="tabular-nums font-mono">{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>18% GST (CGST + SGST)</span>
                <span className="tabular-nums font-mono">{formatCurrency(selectedOrder.taxTotal)}</span>
              </div>
              {selectedOrder.deliveryFee > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Delivery & Courier Fee</span>
                  <span className="tabular-nums font-mono">{formatCurrency(selectedOrder.deliveryFee)}</span>
                </div>
              )}
              {selectedOrder.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Promotional & Loyalty Discount</span>
                  <span className="tabular-nums font-mono">-{formatCurrency(selectedOrder.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="tabular-nums font-mono text-amber-400">{formatCurrency(selectedOrder.grandTotal)}</span>
              </div>
            </div>

            {/* Full Status Audit Trail History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Order Lifecycle Timeline</h4>
              <div className="space-y-3 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {selectedOrder.statusHistory.map((h, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-slate-900" />
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{h.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(h.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{h.description}</p>
                      {h.updatedBy && <span className="text-[10px] text-amber-400 block font-semibold">By: {h.updatedBy}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================================================
          MODAL 2: IN-BRANCH PICKUP OTP VERIFICATION
      ========================================================================== */}
      {isOtpModalOpen && selectedOrder && (
        <Modal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          title="Verify Branch Pickup OTP"
          maxWidth="md"
        >
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-2 shadow-lg">
              <QrCode className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Guest Handover Verification</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the 4-digit Pickup OTP displayed on {selectedOrder.customerName}’s guest portal or smartphone receipt.
              </p>
            </div>

            <div className="py-2">
              <input
                type="text"
                maxLength={4}
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-48 mx-auto bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-2xl px-4 py-3 text-center text-2xl font-mono tracking-widest text-amber-300 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 block mt-2">Demo OTP for testing: {selectedOrder.pickupOtp}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsOtpModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleVerifyOtp}>
                Verify OTP & Handover
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================================================
          MODAL 3: CARRIER DISPATCH
      ========================================================================== */}
      {isDispatchModalOpen && selectedOrder && (
        <Modal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          title="Dispatch with Delivery Carrier"
          maxWidth="md"
        >
          <div className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Select Delivery Provider</label>
              <Select
                value={selectedCarrier}
                onChange={(e) => setSelectedCarrier(e.target.value as DeliveryProviderId)}
                className="w-full text-xs"
                options={[
                  { label: 'Hive Salon Concierge (Express Local Fleet)', value: 'INTERNAL_FLEET' },
                  { label: 'Dunzo / Shadowfax Hyperlocal (60–90 Mins)', value: 'DUNZO' },
                  { label: 'Delhivery National Express (2–3 Days)', value: 'DELHIVERY' },
                  { label: 'Blue Dart Apex Priority Air (Next Day)', value: 'BLUEDART' },
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Dispatch & Gate Pass Notes</label>
              <Input
                value={trackingNote}
                onChange={(e) => setTrackingNote(e.target.value)}
                placeholder="Gate pass reference / rider badge number"
                className="text-xs"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 block font-semibold">Delivery Address</span>
              <p className="text-slate-200">
                {selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.phone})<br />
                {selectedOrder.shippingAddress?.addressLine1}, {selectedOrder.shippingAddress?.city} - {selectedOrder.shippingAddress?.pincode}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDispatchModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleDispatchCarrier}>
                Generate AWB & Dispatch
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================================================
          MODAL 4: PRINTABLE LUXURY PACKING SLIP & SHIPPING LABEL
      ========================================================================== */}
      {isPackingSlipOpen && selectedOrder && (
        <Modal
          isOpen={isPackingSlipOpen}
          onClose={() => setIsPackingSlipOpen(false)}
          title={`Packing Slip: ${selectedOrder.orderNumber}`}
          maxWidth="lg"
        >
          <div className="bg-white text-slate-950 p-6 rounded-2xl font-sans text-xs space-y-5 border border-slate-300">
            {/* Slip Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">HIVE SALON & SPA</h2>
                <p className="text-[11px] text-slate-600">Official Retail Dispatch & Packing Slip</p>
                <p className="text-[10px] text-slate-500 font-mono">GSTIN: 36AAAAH9982K1Z5</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold block">{selectedOrder.orderNumber}</span>
                <span className="text-[10px] text-slate-500">Date: {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            {/* Ship To & Fulfillment Type */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Customer Information</span>
                <span className="font-bold text-slate-900 block">{selectedOrder.customerName}</span>
                <span className="text-slate-600 block">{selectedOrder.customerPhone}</span>
                <span className="text-slate-600 block">{selectedOrder.customerEmail}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Fulfillment Method</span>
                <span className="font-bold text-amber-700 block">
                  {selectedOrder.fulfillmentType === 'BRANCH_PICKUP' ? 'Branch In-Store Pickup' : 'Home Courier Delivery'}
                </span>
                <span className="text-slate-600 block text-[11px]">
                  {selectedOrder.fulfillmentType === 'BRANCH_PICKUP'
                    ? `${selectedOrder.pickupBranchName} (Slot: ${selectedOrder.pickupSlot})`
                    : `${selectedOrder.shippingAddress?.addressLine1}, ${selectedOrder.shippingAddress?.city} - ${selectedOrder.shippingAddress?.pincode}`}
                </span>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-[10px] text-slate-500 uppercase tracking-wider">
                    <th className="py-2">Item Description</th>
                    <th className="py-2">SKU</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-[11px]">
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 font-semibold text-slate-900">{item.productName} ({item.volumeSize})</td>
                      <td className="py-2 font-mono text-slate-600">{item.productSku}</td>
                      <td className="py-2 text-center font-bold">{item.quantity}</td>
                      <td className="py-2 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-2 text-right font-bold font-mono">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div className="flex justify-end pt-2 border-t">
              <div className="w-64 space-y-1 text-right">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-mono">{formatCurrency(selectedOrder.taxTotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t">
                  <span>Grand Total</span>
                  <span className="font-mono">{formatCurrency(selectedOrder.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="pt-3 border-t text-center text-[10px] text-slate-500">
              Thank you for purchasing premium salon retail from Hive Salon. Sealed with 100% authenticity guarantee.
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
                Print Packing Slip
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================================================
          MODAL 5: REAL-TIME INVENTORY SYNCHRONIZATION AUDIT
      ========================================================================== */}
      {isStockAuditOpen && (
        <Modal
          isOpen={isStockAuditOpen}
          onClose={() => setIsStockAuditOpen(false)}
          title="Inventory Synchronization & Never-Oversell Audit"
          maxWidth="lg"
        >
          <div className="space-y-4 text-left">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Strict Never-Oversell Guarantee Active</span>
                <span>
                  Physical branch stocks are atomically reserved upon checkout. Any attempt to cart or checkout quantities higher than available branch stock is automatically rejected.
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 overflow-hidden text-xs">
              {[
                { name: 'Olaplex No. 3 Hair Perfector', sku: 'OLP-BOND-003', indiranagar: 14, koramangala: 9, jubilee: 5, total: 28 },
                { name: 'Moroccanoil Original Treatment Oil', sku: 'MRC-OIL-100', indiranagar: 9, koramangala: 5, jubilee: 4, total: 18 },
                { name: 'Kérastase Chronologiste Scrub', sku: 'KRS-CHRN-200', indiranagar: 7, koramangala: 4, jubilee: 1, total: 12 },
                { name: 'Dyson Supersonic Pro Hair Dryer', sku: 'DYS-SPRS-PRO', indiranagar: 2, koramangala: 2, jubilee: 1, total: 5 },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
                      Indiranagar: <strong className="text-amber-400">{item.indiranagar}</strong>
                    </span>
                    <span className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
                      Koramangala: <strong className="text-amber-400">{item.koramangala}</strong>
                    </span>
                    <span className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
                      Jubilee: <strong className="text-amber-400">{item.jubilee}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setIsStockAuditOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
