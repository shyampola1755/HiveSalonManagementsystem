'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  PageHeader,
  DataTable,
  Button,
  Badge,
  Modal,
  Input,
  Select,
  Search,
  useToast,
  type ColumnDef,
} from '@hive/ui';
import { Building2, Plus, MapPin, Edit2, Trash2, Layers } from 'lucide-react';
import type { Branch } from '@hive/types';

const initialBranches: Branch[] = [
  {
    id: 'b_jh_01',
    organizationId: 'org_hive_luxury',
    name: 'Jubilee Hills Flagship',
    code: 'JH-01',
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    phone: '+91 40 2355 7890',
    email: 'jubilee@hivesalon.in',
    status: 'ACTIVE',
    isActive: true,
    isMainBranch: true,
    openingDate: '2024-01-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b_bh_02',
    organizationId: 'org_hive_luxury',
    name: 'Banjara Hills Spa & Lounge',
    code: 'BH-02',
    address: 'Road No. 12, Banjara Hills, Hyderabad',
    phone: '+91 40 2334 5678',
    email: 'banjara@hivesalon.in',
    status: 'ACTIVE',
    isActive: true,
    isMainBranch: false,
    openingDate: '2024-06-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b_hc_03',
    organizationId: 'org_hive_luxury',
    name: 'Hitech City Express',
    code: 'HC-03',
    address: 'Cyber Towers Quad, Hitech City, Hyderabad',
    phone: '+91 40 6789 0123',
    email: 'hitech@hivesalon.in',
    status: 'ACTIVE',
    isActive: true,
    isMainBranch: false,
    openingDate: '2025-02-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b_in_01',
    organizationId: 'org_hive_luxury',
    name: 'Indiranagar Sanctuary',
    code: 'IN-01',
    address: '100ft Road, Indiranagar, Bengaluru',
    phone: '+91 80 4123 4567',
    email: 'indiranagar@hivesalon.in',
    status: 'ACTIVE',
    isActive: true,
    isMainBranch: false,
    openingDate: '2025-08-20',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function BranchesPage() {
  const toast = useToast();
  const [branches, setBranches] = React.useState<Branch[]>(initialBranches);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const [newBranch, setNewBranch] = React.useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    city: 'Hyderabad',
    state: 'Telangana',
    status: 'ACTIVE' as const,
  });

  const handleCreateBranch = () => {
    if (!newBranch.name || !newBranch.code || !newBranch.address) {
      toast.error('Validation Error', 'Branch Name, Code, and Address are required.');
      return;
    }
    const created: Branch = {
      id: `b_${Date.now()}`,
      organizationId: 'org_hive_luxury',
      name: newBranch.name,
      code: newBranch.code.toUpperCase(),
      address: newBranch.address,
      phone: newBranch.phone || '+91 99000 00000',
      email: newBranch.email || null,
      status: newBranch.status,
      isActive: true,
      isMainBranch: false,
      openingDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBranches([created, ...branches]);
    setIsCreateModalOpen(false);
    setNewBranch({
      name: '',
      code: '',
      address: '',
      phone: '',
      email: '',
      city: 'Hyderabad',
      state: 'Telangana',
      status: 'ACTIVE',
    });
    toast.success(`Branch ${created.name} (${created.code}) created successfully!`);
  };

  const columns: ColumnDef<Branch>[] = [
    {
      key: 'name',
      header: 'Branch Name & Details',
      cell: (row) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs">{row.name}</span>
            {row.isMainBranch && (
              <Badge variant="default" className="text-[9px] px-1 py-0">
                HQ
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-slate-500">{row.address}</p>
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Branch Code',
      cell: (row) => <Badge variant="secondary">{row.code}</Badge>,
    },
    {
      key: 'phone',
      header: 'Contact Info',
      cell: (row) => (
        <div>
          <span className="font-mono text-xs">{row.phone}</span>
          {row.email && <p className="text-[11px] text-slate-400">{row.email}</p>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'warning'} showDot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'openingDate',
      header: 'Opening Date',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-500">
          {row.openingDate || '2024-01-01'}
        </span>
      ),
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
            onClick={() => toast.info(`Editing branch ${row.name}`)}
          >
            <Edit2 className="h-3.5 w-3.5 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:text-rose-600"
            onClick={() => {
              setBranches(branches.filter((b) => b.id !== row.id));
              toast.warning(`Archived branch ${row.name}`);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const filtered = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 text-left">
      <PageHeader
        title="Physical Branches Directory"
        description="Manage multi-branch salon locations, operating hours, tax rules, and local contact numbers."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Branches Directory', isCurrent: true },
        ]}
        badge={<Badge variant="default">{branches.length} Active</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/branches/hierarchy">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Layers className="h-4 w-4 text-amber-600" />}
              >
                Geographical Tree
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              New Branch
            </Button>
          </div>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <Search
          placeholder="Search by branch name, code, or address..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-80"
        />
        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800 dark:text-slate-200">{filtered.length}</strong> branches
        </span>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No branches match your query"
        emptyDescription="Create a new physical location or check your filters."
        emptyActionLabel="Create New Branch"
        onEmptyAction={() => setIsCreateModalOpen(true)}
      />

      {/* Create Branch Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Physical Branch"
        description="Enter location details, contact info, and initial status."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateBranch}>
              Register Branch
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <Input
            label="Branch Name"
            placeholder="e.g. Jubilee Hills Flagship"
            value={newBranch.name}
            onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
            required
          />
          <Input
            label="Branch Code"
            placeholder="e.g. JH-01"
            value={newBranch.code}
            onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
            required
          />
          <div className="sm:col-span-2">
            <Input
              label="Street Address"
              placeholder="Road No. 36, Jubilee Hills"
              value={newBranch.address}
              onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
              required
            />
          </div>
          <Input
            label="Contact Phone"
            placeholder="+91 40 2355 7890"
            value={newBranch.phone}
            onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
            required
          />
          <Input
            label="Official Email"
            type="email"
            placeholder="jubilee@hivesalon.in"
            value={newBranch.email}
            onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
          />
          <Select
            label="Branch Status"
            value={newBranch.status}
            onChange={(e) => setNewBranch({ ...newBranch, status: e.target.value as any })}
            options={[
              { label: 'Active & Operating', value: 'ACTIVE' },
              { label: 'Inactive / Temporarily Closed', value: 'INACTIVE' },
              { label: 'Under Renovation', value: 'UNDER_RENOVATION' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
