'use client';

import * as React from 'react';
import {
  PageHeader,
  Button,
  Input,
  Select,
  DatePicker,
  Modal,
  Drawer,
  ConfirmDialog,
  DataTable,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Tabs,
  Tooltip,
  Search,
  FilterBar,
  EmptyState,
  LoadingState,
  ErrorState,
  StatCard,
  useToast,
  type ColumnDef,
} from '@hive/ui';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  AlertTriangle,
  Users,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
  Info,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: string;
  totalSpent: number;
  visits: number;
  status: 'ACTIVE' | 'INACTIVE' | 'VIP';
}

const mockCustomerData: CustomerRecord[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    phone: '+1 (555) 234-5678',
    email: 'eleanor.v@example.com',
    tier: 'Diamond Tier',
    totalSpent: 1420.5,
    visits: 8,
    status: 'VIP',
  },
  {
    id: '2',
    name: 'Marcus Brody',
    phone: '+1 (555) 987-6543',
    email: 'marcus.b@example.com',
    tier: 'Gold Tier',
    totalSpent: 480.0,
    visits: 4,
    status: 'ACTIVE',
  },
  {
    id: '3',
    name: 'Amara Williams',
    phone: '+1 (555) 456-7890',
    email: 'amara.w@example.com',
    tier: 'Silver Tier',
    totalSpent: 310.0,
    visits: 2,
    status: 'ACTIVE',
  },
  {
    id: '4',
    name: 'Julian Sterling',
    phone: '+1 (555) 321-6549',
    email: 'julian.s@example.com',
    tier: 'Standard',
    totalSpent: 85.0,
    visits: 1,
    status: 'INACTIVE',
  },
];

export default function DesignSystemShowcasePage() {
  const toast = useToast();

  // Tab State
  const [activeTab, setActiveTab] = React.useState('buttons_inputs');

  // Interactive Form States
  const [inputValue, setInputValue] = React.useState('Hive Luxury Client');
  const [selectValue, setSelectValue] = React.useState('NYC-01');
  const [selectedDate, setSelectedDate] = React.useState('2026-09-10');
  const [searchVal, setSearchVal] = React.useState('');

  // Dialog States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  // Table State
  const [tableData, setTableData] = React.useState<CustomerRecord[]>(mockCustomerData);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState<string>('totalSpent');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  // Filter Bar State
  const [filters, setFilters] = React.useState([
    { id: 'f_vip', label: 'VIP Only', value: 'VIP', isActive: false },
    { id: 'f_active', label: 'Active Status', value: 'ACTIVE', isActive: false },
  ]);

  const handleFilterToggle = (id: string) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Filtered & Sorted Customer Data
  const displayedCustomers = React.useMemo(() => {
    let list = [...tableData];
    const activeFilters = filters.filter((f) => f.isActive).map((f) => f.value);

    if (activeFilters.length > 0) {
      list = list.filter((c) => activeFilters.includes(c.status));
    }

    if (searchVal.trim()) {
      const q = searchVal.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    list.sort((a: any, b: any) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [tableData, filters, searchVal, sortColumn, sortDirection]);

  // Table Columns Definition
  const columns: ColumnDef<CustomerRecord>[] = [
    {
      key: 'name',
      header: 'Customer Details',
      sortable: true,
      cell: (row) => (
        <div className="space-y-0.5">
          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{row.name}</span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (row) => <span className="font-mono text-xs">{row.phone}</span>,
    },
    {
      key: 'tier',
      header: 'Membership Tier',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'VIP' ? 'default' : row.status === 'ACTIVE' ? 'success' : 'secondary'
          }
          showDot
        >
          {row.tier}
        </Badge>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      sortable: true,
      cell: (row) => (
        <span className="font-semibold tabular-nums">{formatCurrency(row.totalSpent)}</span>
      ),
    },
    {
      key: 'visits',
      header: 'Visits',
      sortable: true,
      cell: (row) => <span className="tabular-nums">{row.visits}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => toast.info(`Viewing profile for ${row.name}`)}
          >
            <Edit2 className="h-3.5 w-3.5 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:text-rose-600"
            onClick={() => {
              setTableData((prev) => prev.filter((item) => item.id !== row.id));
              toast.warning(`Archived customer ${row.name}`);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Page Header */}
      <PageHeader
        title="Phase 0 Design System Explorer"
        description="Comprehensive testing environment for all 26+ UI components, validation states, toasts, and dialogs."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Design System Showcase', isCurrent: true },
        ]}
        badge={<Badge variant="default">Phase 0 Ready</Badge>}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Sparkles className="h-4 w-4" />}
            onClick={() => {
              toast.success('Design System Verified!', 'All tokens and primitives operational.');
            }}
          >
            Verify System
          </Button>
        }
      />

      {/* Tabs Navigation */}
      <Tabs
        variant="pills"
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'buttons_inputs', label: '1. Buttons & Form Controls' },
          { id: 'data_table', label: '2. DataTable & Filters' },
          { id: 'overlays', label: '3. Modals, Drawers & Dialogs' },
          { id: 'toasts_errors', label: '4. Toasts & Error Mappings' },
          { id: 'states', label: '5. Empty & Loading States' },
        ]}
      />

      {/* TAB 1: BUTTONS & FORM CONTROLS */}
      {activeTab === 'buttons_inputs' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants & Sizes</CardTitle>
              <CardDescription>
                Primary, secondary, outline, ghost, destructive, link, and loading states.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" onClick={() => toast.success('Primary action clicked')}>
                  Primary Button
                </Button>
                <Button variant="secondary" onClick={() => toast.info('Secondary clicked')}>
                  Secondary
                </Button>
                <Button variant="outline" onClick={() => toast.info('Outline clicked')}>
                  Outline
                </Button>
                <Button variant="ghost" onClick={() => toast.info('Ghost clicked')}>
                  Ghost
                </Button>
                <Button
                  variant="destructive"
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  onClick={() => toast.error('Destructive action triggered')}
                >
                  Destructive
                </Button>
                <Button variant="link">Link Style</Button>
                <Button variant="primary" isLoading>
                  Loading State
                </Button>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button size="sm">Small (sm)</Button>
                <Button size="md">Medium (md)</Button>
                <Button size="lg">Large (lg)</Button>
                <Tooltip content="Tooltip Icon Button" shortcut="Ctrl+B">
                  <Button size="icon" variant="outline">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </Button>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Controls & Inline Validation</CardTitle>
              <CardDescription>
                Inputs with prefixes, clear buttons, selects, datepickers, and helper texts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Customer Full Name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  showClearButton
                  onClear={() => setInputValue('')}
                  helperText="Supports instant one-click clear button"
                  required
                />

                <Input
                  label="Phone Number with Error"
                  value="123"
                  error="Phone number must contain at least 7 digits"
                  required
                />

                <Select
                  label="Branch Selector"
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                  options={[
                    { label: 'Downtown Flagship (NYC-01)', value: 'NYC-01' },
                    { label: 'West End Spa Retreat (WE-02)', value: 'WE-02' },
                    { label: 'Airport Express Lounge (AP-03)', value: 'AP-03' },
                  ]}
                  helperText="Multi-branch scope selection"
                />

                <DatePicker
                  label="Appointment Date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  helperText="ISO datepicker format"
                  required
                />

                <div className="sm:col-span-2">
                  <Search
                    placeholder="Debounced Search (300ms delay)..."
                    onChange={(q) => {
                      if (q) toast.info(`Search query debounced: "${q}"`);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: DATA TABLE & FILTERS */}
      {activeTab === 'data_table' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Filter Bar & Search */}
          <FilterBar
            filters={filters}
            onFilterToggle={handleFilterToggle}
            onClearAll={() =>
              setFilters((prev) => prev.map((f) => ({ ...f, isActive: false })))
            }
          >
            <Search
              placeholder="Search customers by name, phone or email..."
              value={searchVal}
              onChange={setSearchVal}
              className="w-72"
            />
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => {
                const newCust: CustomerRecord = {
                  id: String(Date.now()),
                  name: 'New Client Demo',
                  phone: '+1 (555) 777-8899',
                  email: 'demo.client@example.com',
                  tier: 'Gold Tier',
                  totalSpent: 220,
                  visits: 1,
                  status: 'ACTIVE',
                };
                setTableData([newCust, ...tableData]);
                toast.success('Added new customer to table');
              }}
            >
              Add Customer
            </Button>
          </FilterBar>

          {/* DataTable Component */}
          <DataTable
            columns={columns}
            data={displayedCustomers}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            pagination={{
              currentPage,
              totalPages: 1,
              totalItems: displayedCustomers.length,
              pageSize,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
            }}
            emptyTitle="No customers match your filters"
            emptyDescription="Try clearing your search query or reset filter pills to view all clients."
            emptyActionLabel="Reset Filters"
            onEmptyAction={() => {
              setSearchVal('');
              setFilters((prev) => prev.map((f) => ({ ...f, isActive: false })));
            }}
          />
        </div>
      )}

      {/* TAB 3: MODALS, DRAWERS & DIALOGS */}
      {activeTab === 'overlays' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Overlays & Drawers</CardTitle>
              <CardDescription>
                Accessible dialogs with keyboard Escape support, focus traps, and custom actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Open Standard Modal
                </Button>

                <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
                  Open Slide-Over Drawer
                </Button>

                <Button
                  variant="destructive"
                  leftIcon={<AlertTriangle className="h-4 w-4" />}
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Open Confirm Deletion Dialog
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Modal Instance */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Create New Service Category"
            description="Organize your salon treatment catalog into logical groups."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsModalOpen(false);
                    toast.success('Service Category created successfully!');
                  }}
                >
                  Save Category
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input label="Category Name" placeholder="e.g. Hair Coloring & Balayage" required />
              <Input
                label="Display Sort Order"
                type="number"
                defaultValue="1"
                helperText="Controls appearance in POS catalog"
              />
            </div>
          </Modal>

          {/* Drawer Instance */}
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            title="Customer 360° Quick Peek"
            description="Eleanor Vance • Diamond VIP Member"
            footer={
              <Button variant="primary" size="sm" onClick={() => setIsDrawerOpen(false)}>
                Done
              </Button>
            }
          >
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900">
                <h5 className="font-bold text-slate-900 dark:text-slate-100">Formula Notes</h5>
                <p className="mt-1 text-slate-500">
                  Wella Koleston 7/1 + 6% Welloxon. 35m processing. Prefers organic scalp oil.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900">
                <h5 className="font-bold text-slate-900 dark:text-slate-100">Upcoming Bookings</h5>
                <p className="mt-1 text-slate-500">Tomorrow @ 2:30 PM with Sophia Miller</p>
              </div>
            </div>
          </Drawer>

          {/* Confirm Dialog Instance */}
          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={async () => {
              toast.error('Item deleted permanently from branch database.');
            }}
            title="Delete Branch Location?"
            description="Are you sure you want to delete this branch? All past appointment records will be safely archived, but new bookings cannot be scheduled."
            confirmLabel="Yes, Delete Branch"
            variant="destructive"
          />
        </div>
      )}

      {/* TAB 4: TOASTS & ERROR MAPPINGS */}
      {activeTab === 'toasts_errors' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle>Human-Friendly Error Handling & Toasts</CardTitle>
              <CardDescription>
                Rule 11: Never expose stack traces. Always show clear, user-friendly explanations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.success('Appointment Confirmed', 'Booking confirmation SMS dispatched.')
                  }
                >
                  Trigger Success Toast
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    toast.info('Stock Level Updated', '12 units received at Downtown Flagship.')
                  }
                >
                  Trigger Info Toast
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    toast.warning(
                      'Low Stock Alert',
                      'Olaplex No. 3 is below the minimum threshold of 5 units.'
                    )
                  }
                >
                  Trigger Warning Toast
                </Button>

                <Button
                  variant="destructive"
                  onClick={() =>
                    toast.error(
                      'Branch Unavailable',
                      'We couldn’t save this customer because the selected branch is no longer available. Please choose another branch.'
                    )
                  }
                >
                  Simulate Human-Friendly Error
                </Button>
              </div>

              {/* Error comparison panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
                  <h5 className="font-bold text-rose-800 dark:text-rose-400">
                    ❌ What Hive Salon NEVER shows:
                  </h5>
                  <pre className="mt-2 text-[11px] font-mono bg-white dark:bg-slate-900 p-2 rounded border border-rose-200 dark:border-rose-900 overflow-x-auto">
                    PrismaClientKnownRequestError: Foreign key constraint failed on the field: `branchId` (code P2003)
                  </pre>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                  <h5 className="font-bold text-emerald-800 dark:text-emerald-400">
                    ✅ What Hive Salon displays:
                  </h5>
                  <p className="mt-2 text-xs leading-relaxed">
                    &ldquo;We couldn&rsquo;t save this customer because the selected branch is no
                    longer available. Please choose another active branch.&rdquo;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 5: EMPTY & LOADING STATES */}
      {activeTab === 'states' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle>Guided Empty States (Rule 5)</CardTitle>
              <CardDescription>
                Never show a blank table. Provide a welcoming illustration, explanation, and next step.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="No customers yet"
                description="Customers will appear here after you add your first client or complete your first appointment."
                primaryActionLabel="Add Customer"
                onPrimaryAction={() => toast.info('Add Customer dialog triggered')}
                secondaryActionLabel="Import from CSV"
                onSecondaryAction={() => toast.info('CSV import wizard triggered')}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Loading Skeleton State</CardTitle>
                <CardDescription>Smooth animated pulse loaders</CardDescription>
              </CardHeader>
              <CardContent>
                <LoadingState count={3} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Recovery State</CardTitle>
                <CardDescription>Clean error state with retry action</CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorState
                  title="Unable to connect to branch terminal"
                  message="The POS card reader is currently offline. Please ensure the reader is turned on and paired via Bluetooth."
                  onRetry={() => toast.success('Reconnected to card terminal successfully!')}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
