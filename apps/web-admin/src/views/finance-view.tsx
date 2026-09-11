'use client';

import * as React from 'react';
import {
  PageHeader,
  Button,
  Badge,
  Modal,
  Input,
  Select,
  useToast,
} from '@hive/ui';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  FileText,
  Download,
  Building2,
  MapPin,
  Users,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Percent,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Wallet,
  Tag,
  PieChart,
  Scissors,
  Sparkles,
  Package,
  Award,
  ChevronRight,
  ChevronDown,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Briefcase,
  FileSpreadsheet,
  Globe,
  Sliders,
  Eye,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type {
  ExpenseCategory,
  ExpenseStatus,
  FinancialPeriodStatus,
  ReportType,
  ExportFormat,
  FinancialPaymentMethod,
  ExpenseDto,
  FinancialPeriodDto,
  FinancialSummaryDto,
  RevenueStreamBreakdownDto,
  ProfitAndLossStatementDto,
  BranchComparisonMetricDto,
  HierarchicalFinancialNodeDto,
  SalesReportRowDto,
  CustomerAnalyticsReportDto,
  AppointmentReportDto,
  StaffProductivityReportRowDto,
  InventoryFinanceReportDto,
  MembershipFinanceReportDto,
  MarketingRoiReportDto,
  CreateExpensePayload,
  SubmitExpensePayload,
  ApproveExpensePayload,
  RejectExpensePayload,
  PayExpensePayload,
  ReportFilterPayload,
  ExportReportPayload,
} from '@hive/types';

export interface FinanceViewProps {
  initialTab?:
    | 'DASHBOARD'
    | 'PNL'
    | 'EXPENSES'
    | 'HIERARCHY'
    | 'COMPARISON'
    | 'REPORTS'
    | 'EXPORTS'
    | 'PERIODS';
}

export function FinanceView({ initialTab = 'DASHBOARD' }: FinanceViewProps) {
  const toast = useToast();

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<
    | 'DASHBOARD'
    | 'PNL'
    | 'EXPENSES'
    | 'HIERARCHY'
    | 'COMPARISON'
    | 'REPORTS'
    | 'EXPORTS'
    | 'PERIODS'
  >(initialTab);

  // Global Scope Filters
  const [selectedBranchId, setSelectedBranchId] = React.useState<string>('ALL');
  const [selectedDateRange, setSelectedDateRange] = React.useState<string>('THIS_MONTH');

  // ---------------------------------------------------------------------------
  // 1. STATE & SEED DATA
  // ---------------------------------------------------------------------------

  // Expenses State
  const [expenses, setExpenses] = React.useState<ExpenseDto[]>([
    {
      id: 'exp-1',
      organizationId: 'org_hive_demo',
      branchId: 'b1',
      branchName: 'Jubilee Hills, Hyderabad',
      category: 'RENT',
      vendorName: 'Jubilee Prime Commercial Realty Ltd',
      invoiceNumber: 'INV-RENT-SEP-26',
      amount: 250000,
      taxAmount: 45000,
      totalAmount: 295000,
      expenseDate: '2026-09-01T10:00:00Z',
      dueDate: '2026-09-05T00:00:00Z',
      paidDate: '2026-09-03T14:30:00Z',
      paymentMethod: 'BANK_TRANSFER',
      description: 'Monthly commercial salon lease rent for Jubilee Hills unit (3,200 sq.ft)',
      receiptUrl: 'https://hive.salon/receipts/rent-sep.pdf',
      status: 'PAID',
      submittedById: 'u_mgr_1',
      submittedByName: 'Sarah Jenkins (Branch Manager)',
      approvedById: 'u_cfo_1',
      approvedByName: 'Rajesh Mehta (CFO)',
      approvedAt: '2026-09-02T11:00:00Z',
      paidReference: 'NEFT-HDFC-994821038',
      createdAt: '2026-09-01T10:00:00Z',
      updatedAt: '2026-09-03T14:30:00Z',
    },
    {
      id: 'exp-2',
      organizationId: 'org_hive_demo',
      branchId: 'b1',
      branchName: 'Jubilee Hills, Hyderabad',
      category: 'ELECTRICITY',
      vendorName: 'Telangana Southern Power Distribution Co (TSSPDCL)',
      invoiceNumber: 'TSSPDCL-0926-88',
      amount: 48500,
      taxAmount: 0,
      totalAmount: 48500,
      expenseDate: '2026-09-05T09:00:00Z',
      dueDate: '2026-09-15T00:00:00Z',
      paidDate: '2026-09-06T12:15:00Z',
      paymentMethod: 'UPI',
      description: 'High-tension 3-phase electricity consumption for salon styling floor & central AC',
      receiptUrl: 'https://hive.salon/receipts/eb-sep.pdf',
      status: 'PAID',
      submittedById: 'u_mgr_1',
      submittedByName: 'Sarah Jenkins (Branch Manager)',
      approvedById: 'u_cfo_1',
      approvedByName: 'Rajesh Mehta (CFO)',
      approvedAt: '2026-09-05T15:00:00Z',
      paidReference: 'UPI-TSSPDCL-910283',
      createdAt: '2026-09-05T09:00:00Z',
      updatedAt: '2026-09-06T12:15:00Z',
    },
    {
      id: 'exp-3',
      organizationId: 'org_hive_demo',
      branchId: 'b1',
      branchName: 'Jubilee Hills, Hyderabad',
      category: 'SUPPLIES',
      vendorName: "L'Oréal Professional & Kérastase India",
      invoiceNumber: 'LOP-IN-994812',
      amount: 185000,
      taxAmount: 33300,
      totalAmount: 218300,
      expenseDate: '2026-09-07T11:30:00Z',
      dueDate: '2026-09-25T00:00:00Z',
      status: 'APPROVED',
      submittedById: 'u_mgr_1',
      submittedByName: 'Sarah Jenkins (Branch Manager)',
      approvedById: 'u_cfo_1',
      approvedByName: 'Rajesh Mehta (CFO)',
      approvedAt: '2026-09-08T16:00:00Z',
      description: 'Monthly salon backbar consumption restock: Hair color tubes, developers, Olaplex kits',
      createdAt: '2026-09-07T11:30:00Z',
      updatedAt: '2026-09-08T16:00:00Z',
    },
    {
      id: 'exp-4',
      organizationId: 'org_hive_demo',
      branchId: 'b1',
      branchName: 'Jubilee Hills, Hyderabad',
      category: 'SALARY',
      vendorName: 'September 2026 Staff Payroll Disbursement',
      invoiceNumber: 'PAYROLL-SEP-2026',
      amount: 520000,
      taxAmount: 0,
      totalAmount: 520000,
      expenseDate: '2026-09-10T08:00:00Z',
      dueDate: '2026-09-10T00:00:00Z',
      status: 'SUBMITTED',
      submittedById: 'u_mgr_1',
      submittedByName: 'Sarah Jenkins (Branch Manager)',
      description: 'Gross base salaries & TDS provisions for 12 branch stylists, front desk & therapists',
      createdAt: '2026-09-10T08:00:00Z',
      updatedAt: '2026-09-10T08:00:00Z',
    },
    {
      id: 'exp-5',
      organizationId: 'org_hive_demo',
      branchId: 'b1',
      branchName: 'Jubilee Hills, Hyderabad',
      category: 'MARKETING',
      vendorName: 'Meta Platforms Inc & MSG91',
      invoiceNumber: 'META-ADS-SEP-09',
      amount: 35000,
      taxAmount: 6300,
      totalAmount: 41300,
      expenseDate: '2026-09-09T14:00:00Z',
      status: 'DRAFT',
      submittedByName: 'Front Desk Lead',
      description: 'Festive WhatsApp marketing broadcast & Instagram local geo-targeted promotions',
      createdAt: '2026-09-09T14:00:00Z',
      updatedAt: '2026-09-09T14:00:00Z',
    },
    {
      id: 'exp-6',
      organizationId: 'org_hive_demo',
      branchId: 'b2',
      branchName: 'Banjara Hills, Hyderabad',
      category: 'RENT',
      vendorName: 'Banjara Commercial Heights',
      invoiceNumber: 'BCH-RENT-0926',
      amount: 210000,
      taxAmount: 37800,
      totalAmount: 247800,
      expenseDate: '2026-09-01T10:00:00Z',
      paidDate: '2026-09-04T11:00:00Z',
      paymentMethod: 'BANK_TRANSFER',
      status: 'PAID',
      submittedByName: 'Vikram Malhotra (Manager)',
      approvedByName: 'Rajesh Mehta (CFO)',
      description: 'Monthly lease for Banjara Hills salon unit (2,600 sq.ft)',
      createdAt: '2026-09-01T10:00:00Z',
      updatedAt: '2026-09-04T11:00:00Z',
    },
    {
      id: 'exp-7',
      organizationId: 'org_hive_demo',
      branchId: 'b3',
      branchName: 'Bandra West, Mumbai',
      category: 'RENT',
      vendorName: 'Linking Road Commercials Pvt Ltd',
      invoiceNumber: 'LRC-RENT-SEP',
      amount: 380000,
      taxAmount: 68400,
      totalAmount: 448400,
      expenseDate: '2026-09-01T10:00:00Z',
      paidDate: '2026-09-03T16:00:00Z',
      paymentMethod: 'BANK_TRANSFER',
      status: 'PAID',
      submittedByName: 'Rhea Kapoor (Branch Manager)',
      approvedByName: 'Rajesh Mehta (CFO)',
      description: 'Monthly lease for Bandra West flagship luxury salon unit',
      createdAt: '2026-09-01T10:00:00Z',
      updatedAt: '2026-09-03T16:00:00Z',
    },
  ]);

  // Financial Periods
  const [financialPeriods, setFinancialPeriods] = React.useState<FinancialPeriodDto[]>([
    {
      id: 'period-aug-2026',
      organizationId: 'org_hive_demo',
      fiscalYear: 'FY 2026-27',
      month: 8,
      monthName: 'August 2026',
      quarter: 'Q2',
      status: 'LOCKED',
      totalRevenue: 2840000,
      totalExpenses: 1680000,
      netProfit: 1160000,
      lockedById: 'u_cfo_1',
      lockedByName: 'Rajesh Mehta (CFO)',
      lockedAt: '2026-09-05T18:00:00Z',
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-09-05T18:00:00Z',
    },
    {
      id: 'period-sep-2026',
      organizationId: 'org_hive_demo',
      fiscalYear: 'FY 2026-27',
      month: 9,
      monthName: 'September 2026',
      quarter: 'Q2',
      status: 'OPEN',
      totalRevenue: 3420000,
      totalExpenses: 1840000,
      netProfit: 1580000,
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-10T12:00:00Z',
    },
  ]);

  // Branch Comparisons
  const branchComparisons: BranchComparisonMetricDto[] = [
    {
      branchId: 'b1',
      branchName: 'Jubilee Hills Flagship',
      cityName: 'Hyderabad',
      stateName: 'Telangana',
      revenue: 1420000,
      revenueGrowthMoM: 21.5,
      totalCustomers: 412,
      newCustomers: 78,
      averageTicketSize: 3446,
      servicesCount: 620,
      retailUnitsSold: 142,
      membershipsSold: 28,
      activeStaffCount: 8,
      revenuePerStaff: 177500,
      expenses: 740000,
      netProfit: 680000,
      rank: 1,
    },
    {
      branchId: 'b3',
      branchName: 'Bandra West Flagship',
      cityName: 'Mumbai',
      stateName: 'Maharashtra',
      revenue: 1060000,
      revenueGrowthMoM: 16.8,
      totalCustomers: 284,
      newCustomers: 52,
      averageTicketSize: 3732,
      servicesCount: 410,
      retailUnitsSold: 98,
      membershipsSold: 19,
      activeStaffCount: 6,
      revenuePerStaff: 176666,
      expenses: 620000,
      netProfit: 440000,
      rank: 2,
    },
    {
      branchId: 'b2',
      branchName: 'Banjara Hills Unit',
      cityName: 'Hyderabad',
      stateName: 'Telangana',
      revenue: 940000,
      revenueGrowthMoM: 16.0,
      totalCustomers: 268,
      newCustomers: 44,
      averageTicketSize: 3507,
      servicesCount: 380,
      retailUnitsSold: 84,
      membershipsSold: 15,
      activeStaffCount: 6,
      revenuePerStaff: 156666,
      expenses: 480000,
      netProfit: 460000,
      rank: 3,
    },
  ];

  // Hierarchical Rollup Tree
  const hierarchyTree: HierarchicalFinancialNodeDto = {
    id: 'org_hive_demo',
    name: 'Hive Luxury Beauty Group (India)',
    code: 'ORG-HIVE',
    type: 'ORGANIZATION',
    revenue: 3420000,
    expenses: 1840000,
    netProfit: 1580000,
    collections: 3317400,
    growthRate: 18.4,
    children: [
      {
        id: 'state_tg',
        name: 'Telangana',
        code: 'TG',
        type: 'STATE',
        revenue: 2360000,
        expenses: 1220000,
        netProfit: 1140000,
        collections: 2289200,
        growthRate: 19.2,
        children: [
          {
            id: 'dist_hyd',
            name: 'Hyderabad District',
            code: 'HYD-DIST',
            type: 'DISTRICT',
            revenue: 2360000,
            expenses: 1220000,
            netProfit: 1140000,
            collections: 2289200,
            growthRate: 19.2,
            children: [
              {
                id: 'city_hyd',
                name: 'Hyderabad City',
                code: 'HYD-CITY',
                type: 'CITY',
                revenue: 2360000,
                expenses: 1220000,
                netProfit: 1140000,
                collections: 2289200,
                growthRate: 19.2,
                children: [
                  {
                    id: 'b1',
                    name: 'Jubilee Hills Flagship',
                    code: 'HYD-JUB-01',
                    type: 'BRANCH',
                    revenue: 1420000,
                    expenses: 740000,
                    netProfit: 680000,
                    collections: 1377400,
                    growthRate: 21.5,
                  },
                  {
                    id: 'b2',
                    name: 'Banjara Hills Unit',
                    code: 'HYD-BAN-02',
                    type: 'BRANCH',
                    revenue: 940000,
                    expenses: 480000,
                    netProfit: 460000,
                    collections: 911800,
                    growthRate: 16.0,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'state_mh',
        name: 'Maharashtra',
        code: 'MH',
        type: 'STATE',
        revenue: 1060000,
        expenses: 620000,
        netProfit: 440000,
        collections: 1028200,
        growthRate: 16.8,
        children: [
          {
            id: 'dist_mum',
            name: 'Mumbai Suburban District',
            code: 'MUM-SUB',
            type: 'DISTRICT',
            revenue: 1060000,
            expenses: 620000,
            netProfit: 440000,
            collections: 1028200,
            growthRate: 16.8,
            children: [
              {
                id: 'city_mum',
                name: 'Mumbai City',
                code: 'MUM-CITY',
                type: 'CITY',
                revenue: 1060000,
                expenses: 620000,
                netProfit: 440000,
                collections: 1028200,
                growthRate: 16.8,
                children: [
                  {
                    id: 'b3',
                    name: 'Bandra West Flagship',
                    code: 'MUM-BAN-01',
                    type: 'BRANCH',
                    revenue: 1060000,
                    expenses: 620000,
                    netProfit: 440000,
                    collections: 1028200,
                    growthRate: 16.8,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  // Selected Report in Reports Tab
  const [selectedReportSuite, setSelectedReportSuite] = React.useState<ReportType>('SALES');

  // Filter States for Expenses
  const [expenseCategoryFilter, setExpenseCategoryFilter] = React.useState<string>('ALL');
  const [expenseStatusFilter, setExpenseStatusFilter] = React.useState<string>('ALL');

  // ---------------------------------------------------------------------------
  // 2. MODALS & ACTION DIALOGS
  // ---------------------------------------------------------------------------
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = React.useState(false);
  const [newExpenseData, setNewExpenseData] = React.useState<CreateExpensePayload>({
    branchId: 'b1',
    category: 'SUPPLIES',
    vendorName: '',
    invoiceNumber: '',
    amount: 10000,
    taxAmount: 1800,
    totalAmount: 11800,
    expenseDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentMethod: 'UPI',
    description: '',
  });

  const [isApproveModalOpen, setIsApproveModalOpen] = React.useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = React.useState(false);
  const [selectedExpense, setSelectedExpense] = React.useState<ExpenseDto | null>(null);
  const [rejectReason, setRejectReason] = React.useState('');
  const [paymentDetails, setPaymentDetails] = React.useState({
    paymentMethod: 'BANK_TRANSFER' as FinancialPaymentMethod,
    paidReference: '',
  });

  const [isLockPeriodModalOpen, setIsLockPeriodModalOpen] = React.useState(false);
  const [selectedPeriodForLock, setSelectedPeriodForLock] = React.useState<FinancialPeriodDto | null>(null);

  // Hierarchy Node Expansion State
  const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({
    org_hive_demo: true,
    state_tg: true,
    dist_hyd: true,
    city_hyd: true,
    state_mh: true,
    dist_mum: true,
    city_mum: true,
  });

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // ---------------------------------------------------------------------------
  // 3. FINANCIAL CALCULATIONS & DERIVED DATA
  // ---------------------------------------------------------------------------
  const isSingleBranch = selectedBranchId !== 'ALL';
  const totalRevenue = isSingleBranch ? 1420000 : 3420000;
  const serviceRevenue = isSingleBranch ? 920000 : 2180000;
  const retailRevenue = isSingleBranch ? 220000 : 540000;
  const membershipRevenue = isSingleBranch ? 180000 : 420000;
  const packageRevenue = isSingleBranch ? 100000 : 280000;

  const cogsAmount = Math.round(totalRevenue * 0.16);
  const grossProfit = totalRevenue - cogsAmount;
  const grossMargin = Math.round((grossProfit / totalRevenue) * 100);

  const totalExpenses = isSingleBranch ? 740000 : 1840000;
  const netOperatingResult = totalRevenue - cogsAmount - totalExpenses;
  const ebitdaMargin = Math.round((netOperatingResult / totalRevenue) * 100);
  const totalCollections = Math.round(totalRevenue * 0.97);
  const totalOutstanding = totalRevenue - totalCollections;

  // ---------------------------------------------------------------------------
  // 4. ACTION HANDLERS
  // ---------------------------------------------------------------------------

  const handleCreateExpense = () => {
    if (!newExpenseData.vendorName || !newExpenseData.amount) {
      toast.warning('Please enter vendor name and valid amount.');
      return;
    }

    const created: ExpenseDto = {
      id: `exp-${Date.now()}`,
      organizationId: 'org_hive_demo',
      branchId: newExpenseData.branchId,
      branchName:
        newExpenseData.branchId === 'b1'
          ? 'Jubilee Hills, Hyderabad'
          : newExpenseData.branchId === 'b2'
          ? 'Banjara Hills, Hyderabad'
          : 'Bandra West, Mumbai',
      category: newExpenseData.category,
      vendorName: newExpenseData.vendorName,
      invoiceNumber: newExpenseData.invoiceNumber,
      amount: Number(newExpenseData.amount),
      taxAmount: Number(newExpenseData.taxAmount || 0),
      totalAmount: Number(newExpenseData.amount) + Number(newExpenseData.taxAmount || 0),
      expenseDate: newExpenseData.expenseDate || new Date().toISOString(),
      dueDate: newExpenseData.dueDate,
      paymentMethod: newExpenseData.paymentMethod,
      description: newExpenseData.description,
      status: 'DRAFT',
      submittedByName: 'Branch Staff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExpenses([created, ...expenses]);
    setIsNewExpenseModalOpen(false);
    toast.success(`Expense draft of ${formatCurrency(created.totalAmount)} created successfully.`);
  };

  const handleSubmitExpenseForApproval = (expenseId: string) => {
    setExpenses(
      expenses.map((e) =>
        e.id === expenseId
          ? {
              ...e,
              status: 'SUBMITTED',
              submittedByName: 'Sarah Jenkins (Branch Manager)',
              updatedAt: new Date().toISOString(),
            }
          : e
      )
    );
    toast.info('Expense submitted to CFO for approval.');
  };

  const handleApproveExpense = () => {
    if (!selectedExpense) return;
    setExpenses(
      expenses.map((e) =>
        e.id === selectedExpense.id
          ? {
              ...e,
              status: 'APPROVED',
              approvedByName: 'Rajesh Mehta (CFO)',
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : e
      )
    );
    setIsApproveModalOpen(false);
    toast.success(`Expense #${selectedExpense.id} approved for payment disbursement.`);
  };

  const handleRejectExpense = () => {
    if (!selectedExpense || !rejectReason) {
      toast.warning('Please provide a rejection reason.');
      return;
    }
    setExpenses(
      expenses.map((e) =>
        e.id === selectedExpense.id
          ? {
              ...e,
              status: 'REJECTED',
              rejectedReason: rejectReason,
              updatedAt: new Date().toISOString(),
            }
          : e
      )
    );
    setIsRejectModalOpen(false);
    setRejectReason('');
    toast.warning(`Expense #${selectedExpense.id} rejected.`);
  };

  const handleRecordPayment = () => {
    if (!selectedExpense) return;
    setExpenses(
      expenses.map((e) =>
        e.id === selectedExpense.id
          ? {
              ...e,
              status: 'PAID',
              paymentMethod: paymentDetails.paymentMethod,
              paidReference: paymentDetails.paidReference || `PAY-${Date.now().toString().slice(-6)}`,
              paidDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : e
      )
    );
    setIsPayModalOpen(false);
    toast.success(`Payment of ${formatCurrency(selectedExpense.totalAmount)} recorded as PAID.`);
  };

  const handleLockPeriod = () => {
    if (!selectedPeriodForLock) return;
    setFinancialPeriods(
      financialPeriods.map((p) =>
        p.id === selectedPeriodForLock.id
          ? {
              ...p,
              status: 'LOCKED',
              lockedByName: 'Rajesh Mehta (CFO)',
              lockedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    setIsLockPeriodModalOpen(false);
    toast.success(`Fiscal period ${selectedPeriodForLock.monthName} has been LOCKED & RECONCILED.`);
  };

  // Client-Side CSV Download Generator
  const handleDownloadCsv = (reportType: ReportType) => {
    let csvContent = '';
    const filename = `Hive_${reportType}_Report_${new Date().toISOString().split('T')[0]}.csv`;

    if (reportType === 'SALES') {
      csvContent =
        'Date,Invoice,Branch,Customer,Services,Retail,Membership,Discount,Tax,NetAmount,PaymentMethod,Status\n' +
        '2026-09-10,INV-2026-104,"Jubilee Hills, Hyderabad","Priya Sharma",3000,0,0,0,540,3540,UPI,PAID\n' +
        '2026-09-10,INV-2026-103,"Jubilee Hills, Hyderabad","Rahul Verma",1800,600,0,0,432,2832,CREDIT_CARD,PAID\n' +
        '2026-09-09,INV-2026-102,"Bandra West, Mumbai","Kavita Menon",4500,1200,0,500,936,6136,UPI,PAID\n' +
        '2026-09-09,INV-2026-101,"Banjara Hills, Hyderabad","Anita Desai",0,0,12000,0,2160,14160,CREDIT_CARD,PAID';
    } else if (reportType === 'FINANCE') {
      csvContent =
        'LineItem,AmountINR,Percentage\n' +
        `Service Revenue,${serviceRevenue},64%\n` +
        `Retail Revenue,${retailRevenue},16%\n` +
        `Membership Revenue,${membershipRevenue},12%\n` +
        `Package Revenue,${packageRevenue},8%\n` +
        `Total Revenue,${totalRevenue},100%\n` +
        `Cost of Goods Sold (COGS),${cogsAmount},16%\n` +
        `Gross Profit,${grossProfit},${grossMargin}%\n` +
        `Total Operating Expenses,${totalExpenses},54%\n` +
        `Net Operating Result (EBITDA),${netOperatingResult},${ebitdaMargin}%`;
    } else if (reportType === 'STAFF') {
      csvContent =
        'StaffName,Role,Branch,ServicesCompleted,ServiceRevenue,RetailSales,TotalRevenue,AvgTicket,TargetRevenue,AchievementPercent,CommissionEarned,Rating\n' +
        '"Ananya Sen","Master Hair Stylist","Jubilee Hills, Hyderabad",84,284000,48000,332000,3952,250000,132.8%,28220,4.9\n' +
        '"Vikram Malhotra","Senior Barber & Stylist","Jubilee Hills, Hyderabad",76,198000,32000,230000,3026,200000,115.0%,19550,4.7\n' +
        '"Meera Patel","Senior Aesthetician & Therapist","Jubilee Hills, Hyderabad",62,215000,22000,237000,3822,200000,118.5%,20145,4.8\n' +
        '"Kunal Joshi","Stylist & Hair Colorist","Banjara Hills, Hyderabad",58,164000,18000,182000,3137,180000,101.1%,15470,4.6';
    } else {
      csvContent = `Report,GeneratedDate,Scope\n${reportType},${new Date().toISOString()},"All Branches"`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Export generated: ${filename} downloaded.`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* --------------------------------------------------------------------- */}
      {/* TOP HEADER & GLOBAL CONTROLS                                          */}
      {/* --------------------------------------------------------------------- */}
      <PageHeader
        title="Finance, Expenses & Centralized Reporting"
        description="Phase 13: Consolidated Multi-Stream Revenue, 4-Stage Expense Governance, Dynamic P&L, Geographic Hierarchy Aggregation, and Operational Reports."
        badge={
          <Badge variant="default">
            Phase 13 Active
          </Badge>
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* Branch Filter */}
            <select
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
            >
              <option value="ALL">🏢 All Locations (Consolidated Org)</option>
              <option value="b1">📍 Jubilee Hills Flagship (Hyderabad)</option>
              <option value="b2">📍 Banjara Hills Unit (Hyderabad)</option>
              <option value="b3">📍 Bandra West Flagship (Mumbai)</option>
            </select>

            {/* Date Range Selector */}
            <select
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >
              <option value="THIS_MONTH">📅 This Month (Sep 2026)</option>
              <option value="LAST_MONTH">📅 Last Month (Aug 2026)</option>
              <option value="Q2_FY26">📅 Q2 FY 2026-27</option>
              <option value="YTD">📅 Year-to-Date (FY27)</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadCsv('FINANCE')}
            >
              <Download className="mr-1.5 h-4 w-4 text-slate-600" />
              1-Click P&L CSV
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setNewExpenseData({
                  branchId: selectedBranchId === 'ALL' ? 'b1' : selectedBranchId,
                  category: 'SUPPLIES',
                  vendorName: '',
                  invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
                  amount: 15000,
                  taxAmount: 2700,
                  totalAmount: 17700,
                  expenseDate: new Date().toISOString().split('T')[0],
                  dueDate: '',
                  paymentMethod: 'UPI',
                  description: '',
                });
                setIsNewExpenseModalOpen(true);
              }}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Record Expense
            </Button>
          </div>
        }
      />

      {/* --------------------------------------------------------------------- */}
      {/* 4 HIGH-LEVEL EXECUTIVE FINANCIAL KPIS                                 */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalRevenue)}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> +18.4%
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Gross sales across services, retail & passes
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Operating Expenses
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalExpenses)}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Opex Ratio: {Math.round((totalExpenses / totalRevenue) * 100)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Rent, Salaries, Electricity, Supplies & Marketing
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Net Operating Result (EBITDA)
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(netOperatingResult)}
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                {ebitdaMargin}% Margin
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Gross Margin: {grossMargin}% (COGS: 16%)
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Collections & Receivables
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalCollections)}
              </span>
              <span className="text-xs font-semibold text-amber-600">
                {formatCurrency(totalOutstanding)} Pending
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              97% Collection efficiency via UPI/Card
            </p>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 8 WORKFLOW TABS                                                       */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'DASHBOARD'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Executive Dashboard
        </button>

        <button
          onClick={() => setActiveTab('PNL')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'PNL'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <PieChart className="h-4 w-4" />
          Revenue Streams & P&L
        </button>

        <button
          onClick={() => setActiveTab('EXPENSES')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'EXPENSES'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Receipt className="h-4 w-4" />
          Expense Governance ({expenses.length})
        </button>

        <button
          onClick={() => setActiveTab('HIERARCHY')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'HIERARCHY'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="h-4 w-4" />
          Hierarchical Rollup Explorer
        </button>

        <button
          onClick={() => setActiveTab('COMPARISON')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'COMPARISON'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Branch Benchmarking Matrix (3)
        </button>

        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'REPORTS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          8 Operational Report Suites
        </button>

        <button
          onClick={() => setActiveTab('EXPORTS')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'EXPORTS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export Center & Downloads
        </button>

        <button
          onClick={() => setActiveTab('PERIODS')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'PERIODS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Lock className="h-4 w-4" />
          Fiscal Periods & Month-End ({financialPeriods.length})
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: EXECUTIVE DASHBOARD                                            */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Revenue Streams Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  Service Revenue
                </span>
                <Scissors className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(serviceRevenue)}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Hair, Styling & Spa</span>
                <span className="font-semibold text-indigo-600">64% of Total</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
                  Retail Product Sales
                </span>
                <Package className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(retailRevenue)}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Kérastase, Olaplex & Shampoos</span>
                <span className="font-semibold text-purple-600">16% of Total</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  Memberships & Subscriptions
                </span>
                <Award className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(membershipRevenue)}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Annual Passes & Prestige Clubs</span>
                <span className="font-semibold text-amber-600">12% of Total</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 dark:text-sky-300">
                  Multi-Session Packages
                </span>
                <Tag className="h-4 w-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(packageRevenue)}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>10-Haircut & Hydra-Facial Packs</span>
                <span className="font-semibold text-sky-600">8% of Total</span>
              </div>
            </div>
          </div>

          {/* Branch Revenue Leaderboard */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Location Revenue & Net Margin Leaderboard
                </h3>
                <p className="text-xs text-slate-500">
                  Consolidated financial performance ranked across operational salon units.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('COMPARISON')}
              >
                View Full Benchmarking Matrix
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {branchComparisons.map((b) => (
                <div
                  key={b.branchId}
                  className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      RANK #{b.rank}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" /> +{b.revenueGrowthMoM}% MoM
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{b.branchName}</h4>
                    <p className="text-xs text-slate-500">{b.cityName}, {b.stateName}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Revenue</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(b.revenue)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Net Profit</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(b.netProfit)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                    <div>Guests: <strong className="text-slate-800 dark:text-slate-200">{b.totalCustomers}</strong></div>
                    <div>Avg Ticket: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(b.averageTicketSize)}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: REVENUE STREAMS & P&L STATEMENT                                */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'PNL' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Consolidated Profit & Loss (P&L) Statement
              </h2>
              <p className="text-sm text-slate-500">
                Period: September 2026 (Month-to-Date) • Standard Indian GAAP & GST Accounting
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadCsv('FINANCE')}
            >
              <Download className="mr-1.5 h-4 w-4" />
              Export P&L Statement (CSV)
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            {/* Top Level Summary Table */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {/* Gross Revenue */}
              <div className="py-3 flex items-center justify-between font-bold text-base text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/40 px-4 rounded-xl">
                <span>1. GROSS REVENUE</span>
                <span>{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="py-2.5 px-6 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>• Salon Services (Hair, Facial, Styling, Spa)</span>
                <span>{formatCurrency(serviceRevenue)} (64%)</span>
              </div>
              <div className="py-2.5 px-6 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>• Retail Product Merchandise</span>
                <span>{formatCurrency(retailRevenue)} (16%)</span>
              </div>
              <div className="py-2.5 px-6 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>• Memberships & Annual Plans</span>
                <span>{formatCurrency(membershipRevenue)} (12%)</span>
              </div>
              <div className="py-2.5 px-6 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>• Multi-Session Service Packages</span>
                <span>{formatCurrency(packageRevenue)} (8%)</span>
              </div>

              {/* COGS */}
              <div className="py-3 flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 px-4">
                <span>2. COST OF GOODS SOLD (COGS — 16% backbar & retail inventory)</span>
                <span className="text-rose-600 font-mono">-{formatCurrency(cogsAmount)}</span>
              </div>

              {/* Gross Profit */}
              <div className="py-3 flex items-center justify-between font-bold text-slate-900 dark:text-white bg-indigo-50/40 dark:bg-indigo-950/20 px-4 rounded-xl">
                <span>3. GROSS PROFIT (Gross Margin: {grossMargin}%)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {formatCurrency(grossProfit)}
                </span>
              </div>

              {/* Operating Expenses */}
              <div className="py-3 flex items-center justify-between font-bold text-base text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/40 px-4 rounded-xl mt-4">
                <span>4. OPERATING EXPENSES (OPEX)</span>
                <span className="text-rose-600">-{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="py-2 px-6 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>• Staff Payroll & Base Salaries</span>
                <span>{formatCurrency(isSingleBranch ? 520000 : 1180000)}</span>
              </div>
              <div className="py-2 px-6 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>• Commercial Real Estate Lease / Rent</span>
                <span>{formatCurrency(isSingleBranch ? 295000 : 991200)}</span>
              </div>
              <div className="py-2 px-6 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>• Salon Backbar & Chemical Restock Supplies</span>
                <span>{formatCurrency(isSingleBranch ? 218300 : 442000)}</span>
              </div>
              <div className="py-2 px-6 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>• Electricity & Utility Power</span>
                <span>{formatCurrency(isSingleBranch ? 48500 : 124000)}</span>
              </div>
              <div className="py-2 px-6 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>• Marketing & Promotional Ad Spend</span>
                <span>{formatCurrency(isSingleBranch ? 41300 : 98000)}</span>
              </div>
              <div className="py-2 px-6 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>• Equipment Maintenance & Software Licenses</span>
                <span>{formatCurrency(isSingleBranch ? 45500 : 115000)}</span>
              </div>

              {/* Net Operating Result */}
              <div className="py-4 flex items-center justify-between font-bold text-lg text-slate-900 dark:text-white bg-emerald-50 dark:bg-emerald-950/40 px-4 rounded-xl border border-emerald-200 dark:border-emerald-800 mt-4">
                <div>
                  <span>5. NET OPERATING RESULT (EBITDA)</span>
                  <span className="block text-xs font-normal text-emerald-700 dark:text-emerald-400">
                    EBITDA Profit Margin: {ebitdaMargin}%
                  </span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 text-2xl">
                  {formatCurrency(netOperatingResult)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: EXPENSE GOVERNANCE & 4-STAGE APPROVAL WORKFLOW                  */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'EXPENSES' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                4-Stage Expense Approval Governance
              </h2>
              <p className="text-sm text-slate-500">
                Strict workflow: Draft → Submitted → Approved (CFO) → Paid. Zero rogue cash outflows.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={expenseCategoryFilter}
                onChange={(e) => setExpenseCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="RENT">Rent</option>
                <option value="ELECTRICITY">Electricity</option>
                <option value="SALARY">Salary</option>
                <option value="SUPPLIES">Supplies</option>
                <option value="MARKETING">Marketing</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="EQUIPMENT">Equipment</option>
                <option value="SOFTWARE">Software</option>
                <option value="OTHER">Other</option>
              </select>

              <select
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={expenseStatusFilter}
                onChange={(e) => setExpenseStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="APPROVED">Approved</option>
                <option value="PAID">Paid</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Vendor & Description</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Branch</th>
                    <th className="px-5 py-3.5">Amount (INR)</th>
                    <th className="px-5 py-3.5">Workflow Status</th>
                    <th className="px-5 py-3.5">Approval / Payment Info</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {expenses
                    .filter(
                      (e) =>
                        (selectedBranchId === 'ALL' || e.branchId === selectedBranchId) &&
                        (expenseCategoryFilter === 'ALL' || e.category === expenseCategoryFilter) &&
                        (expenseStatusFilter === 'ALL' || e.status === expenseStatusFilter)
                    )
                    .map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {exp.vendorName}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">{exp.description}</div>
                          {exp.invoiceNumber && (
                            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                              Inv: {exp.invoiceNumber}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="default">
                            {exp.category}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {exp.branchName}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                          {formatCurrency(exp.totalAmount)}
                          {exp.taxAmount > 0 && (
                            <span className="text-[10px] text-slate-400 font-normal block">
                              Tax: {formatCurrency(exp.taxAmount)}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            variant={
                              exp.status === 'PAID'
                                ? 'success'
                                : exp.status === 'APPROVED'
                                ? 'info'
                                : exp.status === 'SUBMITTED'
                                ? 'warning'
                                : exp.status === 'REJECTED'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {exp.status === 'PAID' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {exp.status === 'APPROVED' && <ShieldCheck className="h-3 w-3 mr-1" />}
                            {exp.status === 'SUBMITTED' && <Clock className="h-3 w-3 mr-1" />}
                            {exp.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">
                          {exp.status === 'PAID' && (
                            <div>
                              <span className="font-semibold text-emerald-600 block">
                                Method: {exp.paymentMethod}
                              </span>
                              <span className="font-mono text-[10px]">Ref: {exp.paidReference}</span>
                            </div>
                          )}
                          {exp.status === 'APPROVED' && (
                            <div>
                              <span className="font-semibold text-indigo-600 block">
                                Approved by: {exp.approvedByName}
                              </span>
                              <span className="text-[10px]">Ready for payment</span>
                            </div>
                          )}
                          {exp.status === 'SUBMITTED' && (
                            <div>
                              <span>Submitted by: {exp.submittedByName}</span>
                            </div>
                          )}
                          {exp.status === 'REJECTED' && (
                            <span className="text-rose-600">{exp.rejectedReason}</span>
                          )}
                          {exp.status === 'DRAFT' && (
                            <span className="italic text-slate-400">Unsubmitted Draft</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {exp.status === 'DRAFT' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleSubmitExpenseForApproval(exp.id)}
                              >
                                Submit
                              </Button>
                            )}
                            {exp.status === 'SUBMITTED' && (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedExpense(exp);
                                    setIsApproveModalOpen(true);
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedExpense(exp);
                                    setIsRejectModalOpen(true);
                                  }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {exp.status === 'APPROVED' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedExpense(exp);
                                  setPaymentDetails({
                                    paymentMethod: 'BANK_TRANSFER',
                                    paidReference: `NEFT-${Date.now().toString().slice(-6)}`,
                                  });
                                  setIsPayModalOpen(true);
                                }}
                              >
                                <CreditCard className="mr-1 h-3 w-3" />
                                Record Payment
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: HIERARCHICAL GEOGRAPHIC ROLLUP EXPLORER                        */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'HIERARCHY' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Multi-Tier Geographic Financial Rollup
            </h2>
            <p className="text-sm text-slate-500">
              Drill down the organizational tree from Organization → State → District → City → Individual Branch Units.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            {/* Root Org Node */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div
                className="p-4 bg-slate-100/70 dark:bg-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-100"
                onClick={() => toggleNodeExpansion('org_hive_demo')}
              >
                <div className="flex items-center gap-2">
                  {expandedNodes['org_hive_demo'] ? (
                    <ChevronDown className="h-5 w-5 text-slate-600" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-600" />
                  )}
                  <Globe className="h-5 w-5 text-indigo-600" />
                  <span className="font-bold text-base text-slate-900 dark:text-white">
                    {hierarchyTree.name}
                  </span>
                  <Badge variant="default">{hierarchyTree.type}</Badge>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>Revenue: <strong className="text-emerald-600 font-bold">{formatCurrency(hierarchyTree.revenue)}</strong></div>
                  <div>Expenses: <strong className="text-rose-600 font-semibold">{formatCurrency(hierarchyTree.expenses)}</strong></div>
                  <div>Net Profit: <strong className="text-indigo-600 font-bold">{formatCurrency(hierarchyTree.netProfit)}</strong></div>
                  <Badge variant="success">+{hierarchyTree.growthRate}% MoM</Badge>
                </div>
              </div>

              {/* State Level */}
              {expandedNodes['org_hive_demo'] && (
                <div className="p-4 pl-8 space-y-3 bg-white dark:bg-slate-900">
                  {hierarchyTree.children?.map((stateNode) => (
                    <div key={stateNode.id} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                      <div
                        className="p-3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-100/50"
                        onClick={() => toggleNodeExpansion(stateNode.id)}
                      >
                        <div className="flex items-center gap-2">
                          {expandedNodes[stateNode.id] ? (
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-500" />
                          )}
                          <MapPin className="h-4 w-4 text-sky-600" />
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            State: {stateNode.name}
                          </span>
                          <Badge variant="info">{stateNode.code}</Badge>
                        </div>
                        <div className="flex items-center gap-5 text-xs">
                          <div>Revenue: <strong className="text-slate-900 dark:text-white">{formatCurrency(stateNode.revenue)}</strong></div>
                          <div>Expenses: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(stateNode.expenses)}</strong></div>
                          <div>Profit: <strong className="text-emerald-600">{formatCurrency(stateNode.netProfit)}</strong></div>
                        </div>
                      </div>

                      {/* District & City Level */}
                      {expandedNodes[stateNode.id] && (
                        <div className="p-3 pl-8 space-y-2">
                          {stateNode.children?.[0]?.children?.[0]?.children?.map((branch) => (
                            <div
                              key={branch.id}
                              className="p-3 rounded-lg bg-slate-50/60 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-500" />
                                <span className="font-semibold text-xs text-slate-900 dark:text-white">
                                  {branch.name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">({branch.code})</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs font-mono">
                                <span>Rev: {formatCurrency(branch.revenue)}</span>
                                <span>Exp: {formatCurrency(branch.expenses)}</span>
                                <span className="font-bold text-emerald-600">Net: {formatCurrency(branch.netProfit)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: BRANCH COMPARISON & BENCHMARKING MATRIX                        */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'COMPARISON' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Multi-Branch Financial & Productivity Benchmarking
              </h2>
              <p className="text-sm text-slate-500">
                Side-by-side metric comparison across Revenue, Footfall, Average Ticket Size, and Revenue Per Stylist.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Rank & Location</th>
                    <th className="px-5 py-3.5">Monthly Revenue</th>
                    <th className="px-5 py-3.5">MoM Growth</th>
                    <th className="px-5 py-3.5">Total Guests</th>
                    <th className="px-5 py-3.5">Avg Ticket (₹)</th>
                    <th className="px-5 py-3.5">Services / Retail / Passes</th>
                    <th className="px-5 py-3.5">Revenue / Stylist</th>
                    <th className="px-5 py-3.5">Net Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {branchComparisons.map((b) => (
                    <tr key={b.branchId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            #{b.rank}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{b.branchName}</div>
                            <div className="text-xs text-slate-500">{b.cityName}, {b.stateName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(b.revenue)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="success">
                          +{b.revenueGrowthMoM}%
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{b.totalCustomers}</span>
                        <span className="text-slate-400 block">({b.newCustomers} new)</span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(b.averageTicketSize)}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">
                        {b.servicesCount} svcs • {b.retailUnitsSold} ret • {b.membershipsSold} mem
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(b.revenuePerStaff)}
                        <span className="text-slate-400 font-normal block">{b.activeStaffCount} Stylists</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-emerald-600 block">
                          {formatCurrency(b.netProfit)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {Math.round((b.netProfit / b.revenue) * 100)}% Net Margin
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 6: 8 OPERATIONAL REPORT SUITES                                    */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-6">
          {/* Report Suite Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { id: 'SALES', label: 'Sales Reports', icon: Receipt },
              { id: 'CUSTOMERS', label: 'Customers CRM', icon: Users },
              { id: 'APPOINTMENTS', label: 'Appointments', icon: Calendar },
              { id: 'STAFF', label: 'Staff & Stylists', icon: Scissors },
              { id: 'INVENTORY', label: 'Inventory & COGS', icon: Package },
              { id: 'FINANCE', label: 'P&L / Finance', icon: DollarSign },
              { id: 'MEMBERSHIP', label: 'Memberships', icon: Award },
              { id: 'MARKETING', label: 'Marketing ROI', icon: Sparkles },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedReportSuite(r.id as ReportType)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedReportSuite === r.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-300 font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[11px] leading-tight">{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Report Display Container */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {selectedReportSuite} Detailed Report Summary
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadCsv(selectedReportSuite)}
              >
                <Download className="mr-1.5 h-4 w-4" />
                Download {selectedReportSuite} CSV
              </Button>
            </div>

            {/* Sales Suite */}
            {selectedReportSuite === 'SALES' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Invoice</th>
                      <th className="px-4 py-2.5">Branch</th>
                      <th className="px-4 py-2.5">Customer</th>
                      <th className="px-4 py-2.5">Services</th>
                      <th className="px-4 py-2.5">Retail</th>
                      <th className="px-4 py-2.5">Tax (GST)</th>
                      <th className="px-4 py-2.5">Net Amount</th>
                      <th className="px-4 py-2.5">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <tr>
                      <td className="px-4 py-3">10-Sep-2026</td>
                      <td className="px-4 py-3 font-mono font-bold">INV-2026-104</td>
                      <td className="px-4 py-3">Jubilee Hills</td>
                      <td className="px-4 py-3 font-semibold">Priya Sharma</td>
                      <td className="px-4 py-3">₹3,000</td>
                      <td className="px-4 py-3">₹0</td>
                      <td className="px-4 py-3">₹540</td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">₹3,540</td>
                      <td className="px-4 py-3"><Badge variant="success">UPI</Badge></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">10-Sep-2026</td>
                      <td className="px-4 py-3 font-mono font-bold">INV-2026-103</td>
                      <td className="px-4 py-3">Jubilee Hills</td>
                      <td className="px-4 py-3 font-semibold">Rahul Verma</td>
                      <td className="px-4 py-3">₹1,800</td>
                      <td className="px-4 py-3">₹600</td>
                      <td className="px-4 py-3">₹432</td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">₹2,832</td>
                      <td className="px-4 py-3"><Badge variant="info">Card</Badge></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">09-Sep-2026</td>
                      <td className="px-4 py-3 font-mono font-bold">INV-2026-102</td>
                      <td className="px-4 py-3">Bandra West</td>
                      <td className="px-4 py-3 font-semibold">Kavita Menon</td>
                      <td className="px-4 py-3">₹4,500</td>
                      <td className="px-4 py-3">₹1,200</td>
                      <td className="px-4 py-3">₹936</td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">₹6,136</td>
                      <td className="px-4 py-3"><Badge variant="success">UPI</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Staff Suite */}
            {selectedReportSuite === 'STAFF' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5">Stylist</th>
                      <th className="px-4 py-2.5">Branch</th>
                      <th className="px-4 py-2.5">Services Done</th>
                      <th className="px-4 py-2.5">Total Revenue</th>
                      <th className="px-4 py-2.5">Avg Ticket</th>
                      <th className="px-4 py-2.5">Target Achievement</th>
                      <th className="px-4 py-2.5">Commission Earned</th>
                      <th className="px-4 py-2.5">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <tr>
                      <td className="px-4 py-3 font-bold">Ananya Sen</td>
                      <td className="px-4 py-3">Jubilee Hills</td>
                      <td className="px-4 py-3">84</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">₹3,32,000</td>
                      <td className="px-4 py-3">₹3,952</td>
                      <td className="px-4 py-3"><Badge variant="success">132.8%</Badge></td>
                      <td className="px-4 py-3 font-semibold">₹28,220</td>
                      <td className="px-4 py-3 text-amber-500 font-bold">4.9★</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold">Vikram Malhotra</td>
                      <td className="px-4 py-3">Jubilee Hills</td>
                      <td className="px-4 py-3">76</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">₹2,30,000</td>
                      <td className="px-4 py-3">₹3,026</td>
                      <td className="px-4 py-3"><Badge variant="success">115.0%</Badge></td>
                      <td className="px-4 py-3 font-semibold">₹19,550</td>
                      <td className="px-4 py-3 text-amber-500 font-bold">4.7★</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Customers Suite */}
            {selectedReportSuite === 'CUSTOMERS' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs text-slate-400">Total Customer Database</span>
                  <span className="text-2xl font-bold block text-slate-900 dark:text-white">709</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs text-slate-400">New Guests This Month</span>
                  <span className="text-2xl font-bold block text-emerald-600">174</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs text-slate-400">Average Lifetime Value (LTV)</span>
                  <span className="text-2xl font-bold block text-indigo-600">₹24,800</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs text-slate-400">Customer Churn Rate</span>
                  <span className="text-2xl font-bold block text-slate-700 dark:text-slate-300">4.2%</span>
                </div>
              </div>
            )}

            {/* Inventory Suite */}
            {selectedReportSuite === 'INVENTORY' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs text-slate-400">Total Stock Value (Cost Price)</span>
                  <span className="text-2xl font-bold block text-slate-900 dark:text-white">₹8,40,000</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs text-slate-400">COGS Consumed (Month)</span>
                  <span className="text-2xl font-bold block text-rose-600">₹5,47,200</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs text-slate-400">Shrinkage & Damage Loss</span>
                  <span className="text-2xl font-bold block text-slate-700 dark:text-slate-300">₹8,400</span>
                </div>
              </div>
            )}

            {/* Fallback for other suites */}
            {selectedReportSuite !== 'SALES' &&
              selectedReportSuite !== 'STAFF' &&
              selectedReportSuite !== 'CUSTOMERS' &&
              selectedReportSuite !== 'INVENTORY' && (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <FileText className="h-8 w-8 mx-auto text-slate-400" />
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedReportSuite} Report Suite Ready
                  </p>
                  <p className="text-xs max-w-md mx-auto">
                    Aggregating transactional records across {selectedBranchId === 'ALL' ? 'all 3 branches' : 'selected branch'}. Click Download CSV for immediate data extraction.
                  </p>
                </div>
              )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 7: EXPORT CENTER & RBAC DOWNLOADS                                 */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'EXPORTS' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Executive Data Export & Compliance Center
            </h2>
            <p className="text-sm text-slate-500">
              Download real structured CSV and Excel datasets. Access strictly governed by RBAC export permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { type: 'FINANCE', title: 'P&L Statement & Financials', desc: 'Income statement, EBITDA margin, and expense line items.' },
              { type: 'SALES', title: 'Complete Sales & GST Invoices', desc: 'Detailed invoice items, GST taxes, customer & payment modes.' },
              { type: 'STAFF', title: 'Staff Productivity & Commissions', desc: 'Stylist revenues, ticket averages, target % and commissions.' },
              { type: 'INVENTORY', title: 'Inventory Valuation & COGS', desc: 'Stock values, shrinkage logs, product movements.' },
              { type: 'CUSTOMERS', title: 'Customer Database & CRM', desc: 'Guest profiles, LTV, visit recency, and acquisition channels.' },
              { type: 'APPOINTMENTS', title: 'Appointment Diary Logs', desc: 'Booked, completed, cancelled, duration & chair utilization.' },
              { type: 'MEMBERSHIP', title: 'Memberships & Packages', desc: 'Active pass holders, wallet float liability, package balances.' },
              { type: 'MARKETING', title: 'Campaign ROI & Reviews', desc: 'Campaign spend, conversion ROI, CSAT review ratings.' },
            ].map((exp) => (
              <div
                key={exp.type}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => handleDownloadCsv(exp.type as ReportType)}
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download CSV
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 8: FISCAL PERIODS & MONTH-END CLOSE                               */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'PERIODS' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Fiscal Periods & Month-End Reconciliation
            </h2>
            <p className="text-sm text-slate-500">
              Locking fiscal periods freezes historical accounting records against accidental ledger modifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {financialPeriods.map((period) => (
              <div
                key={period.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {period.fiscalYear} • {period.quarter}
                    </span>
                    <Badge variant={period.status === 'LOCKED' ? 'success' : 'warning'}>
                      {period.status === 'LOCKED' ? (
                        <>
                          <Lock className="h-3 w-3 mr-1" />
                          LOCKED & RECONCILED
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3 w-3 mr-1" />
                          OPEN FOR POSTING
                        </>
                      )}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {period.monthName}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Revenue</span>
                      <strong className="text-slate-900 dark:text-white">{formatCurrency(period.totalRevenue)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Expenses</span>
                      <strong className="text-rose-600">{formatCurrency(period.totalExpenses)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Net Profit</span>
                      <strong className="text-emerald-600">{formatCurrency(period.netProfit)}</strong>
                    </div>
                  </div>

                  {period.status === 'LOCKED' && (
                    <div className="text-xs text-slate-500">
                      Locked by: <strong>{period.lockedByName}</strong> on{' '}
                      {new Date(period.lockedAt || '').toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                  {period.status === 'OPEN' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedPeriodForLock(period);
                        setIsLockPeriodModalOpen(true);
                      }}
                    >
                      <Lock className="mr-1.5 h-3.5 w-3.5" />
                      Lock Period (Month-End Close)
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4" /> Period Finalized
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 1: RECORD EXPENSE DRAFT                                         */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isNewExpenseModalOpen}
        onClose={() => setIsNewExpenseModalOpen(false)}
        title="Record Operating Expense Draft"
        description="Log new branch expenditure with vendor invoice details and category allocation."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Branch Location *
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={newExpenseData.branchId}
                onChange={(e) => setNewExpenseData({ ...newExpenseData, branchId: e.target.value })}
              >
                <option value="b1">Jubilee Hills Flagship (Hyderabad)</option>
                <option value="b2">Banjara Hills Unit (Hyderabad)</option>
                <option value="b3">Bandra West Flagship (Mumbai)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expense Category *
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={newExpenseData.category}
                onChange={(e) => setNewExpenseData({ ...newExpenseData, category: e.target.value as any })}
              >
                <option value="RENT">Rent / Commercial Lease</option>
                <option value="ELECTRICITY">Electricity & Utilities</option>
                <option value="SALARY">Salary & Staff Payroll</option>
                <option value="SUPPLIES">Supplies & Chemical Restock</option>
                <option value="MARKETING">Marketing & Promotion</option>
                <option value="MAINTENANCE">Maintenance & Repairs</option>
                <option value="EQUIPMENT">Equipment Purchase</option>
                <option value="SOFTWARE">Software Subscriptions</option>
                <option value="OTHER">Other Miscellaneous</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vendor / Payee Name *
              </label>
              <Input
                placeholder="e.g. L'Oréal Professional India"
                value={newExpenseData.vendorName}
                onChange={(e) => setNewExpenseData({ ...newExpenseData, vendorName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vendor Invoice / Bill No
              </label>
              <Input
                placeholder="INV-994821"
                value={newExpenseData.invoiceNumber || ''}
                onChange={(e) => setNewExpenseData({ ...newExpenseData, invoiceNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Base Amount (₹) *
              </label>
              <Input
                type="number"
                placeholder="10000"
                value={newExpenseData.amount.toString()}
                onChange={(e) => setNewExpenseData({ ...newExpenseData, amount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tax Amount (₹)
              </label>
              <Input
                type="number"
                placeholder="1800"
                value={newExpenseData.taxAmount?.toString() || '0'}
                onChange={(e) => setNewExpenseData({ ...newExpenseData, taxAmount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={newExpenseData.paymentMethod || 'UPI'}
                onChange={(e) => setNewExpenseData({ ...newExpenseData, paymentMethod: e.target.value as any })}
              >
                <option value="UPI">UPI (GooglePay/PhonePe)</option>
                <option value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</option>
                <option value="CREDIT_CARD">Corporate Credit Card</option>
                <option value="CASH">Cash Drawer</option>
                <option value="CHEQUE">Cheque</option>
                <option value="PETTY_CASH">Petty Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Business Justification
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-20"
              placeholder="Provide reason or itemization..."
              value={newExpenseData.description || ''}
              onChange={(e) => setNewExpenseData({ ...newExpenseData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsNewExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateExpense}>
              Save Expense Draft
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 2: APPROVE EXPENSE                                              */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title={`Approve Expense #${selectedExpense?.id}`}
        description={`Confirm expenditure of ${formatCurrency(selectedExpense?.totalAmount || 0)} for ${selectedExpense?.vendorName}`}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
            <div>Vendor: <strong>{selectedExpense?.vendorName}</strong></div>
            <div>Category: <strong>{selectedExpense?.category}</strong></div>
            <div>Branch: <strong>{selectedExpense?.branchName}</strong></div>
            <div>Submitted by: <strong>{selectedExpense?.submittedByName}</strong></div>
            <div>Description: <em>"{selectedExpense?.description}"</em></div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-800 dark:text-indigo-200">
            <ShieldCheck className="h-4 w-4 inline mr-1 text-indigo-600" />
            Approved expenses become eligible for immediate bank transfer / payment disbursement.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApproveExpense}>
              Confirm Approval
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 3: REJECT EXPENSE                                               */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title={`Reject Expense #${selectedExpense?.id}`}
        description="Provide a rejection justification for branch manager review."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Rejection Reason *
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-20"
              placeholder="e.g. Missing tax invoice receipt / Amount exceeds approved monthly budget limit..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRejectExpense}>
              Reject Expense
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 4: RECORD PAYMENT                                               */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title={`Record Payment for Expense #${selectedExpense?.id}`}
        description={`Record final disbursement of ${formatCurrency(selectedExpense?.totalAmount || 0)}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Disbursement Method *
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={paymentDetails.paymentMethod}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentMethod: e.target.value as any })}
              >
                <option value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</option>
                <option value="UPI">UPI (GooglePay/PhonePe)</option>
                <option value="CREDIT_CARD">Corporate Credit Card</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transaction / UTR Reference
              </label>
              <Input
                placeholder="UTR-HDFC-994821"
                value={paymentDetails.paidReference}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, paidReference: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRecordPayment}>
              Save Payment Record
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 5: LOCK FISCAL PERIOD                                           */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isLockPeriodModalOpen}
        onClose={() => setIsLockPeriodModalOpen(false)}
        title={`Lock Fiscal Period: ${selectedPeriodForLock?.monthName}`}
        description="Finalize and lock month-end accounts. All ledger postings for this period will be frozen."
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Pre-Locking Reconciliation Audit Checklist:
            </div>
            <div>✓ All branch invoices verified against bank deposits</div>
            <div>✓ Vendor expenses approved and paid</div>
            <div>✓ Stylist commissions and gross payroll reconciled</div>
            <div>✓ GST output tax liability computed</div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsLockPeriodModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleLockPeriod}>
              Lock & Freeze Period
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function FinancePage({ initialTab = 'DASHBOARD' }: FinanceViewProps = {}) {
  return <FinanceView initialTab={initialTab} />;
}

