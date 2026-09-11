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
import { Users, Plus, ShieldCheck, KeyRound, Lock, Edit2, Trash2 } from 'lucide-react';
import { SYSTEM_ROLES } from '@hive/config';
import type { User, UserScope } from '@hive/types';

const initialUsers: User[] = [
  {
    id: 'usr_owner',
    organizationId: 'org_hive_luxury',
    fullName: 'Vikramaditya Roy',
    email: 'owner@hivesalon.in',
    phone: '+91 9876543210',
    role: 'ORGANIZATION_OWNER',
    isActive: true,
    assignedBranchIds: ['b_jh_01', 'b_bh_02', 'b_hc_03', 'b_in_01'],
    scopes: [
      {
        id: 'sc_1',
        organizationId: 'org_hive_luxury',
        userId: 'usr_owner',
        scopeType: 'ORGANIZATION',
        targetId: 'org_hive_luxury',
        targetName: 'Hive Beauty Group (All Branches)',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_mgr_hyd',
    organizationId: 'org_hive_luxury',
    fullName: 'Sarah Jenkins',
    email: 'sarah.jenkins@hivesalon.in',
    phone: '+91 9123456780',
    role: 'BRANCH_MANAGER',
    isActive: true,
    assignedBranchIds: ['b_jh_01'],
    scopes: [
      {
        id: 'sc_2',
        organizationId: 'org_hive_luxury',
        userId: 'usr_mgr_hyd',
        scopeType: 'BRANCH',
        targetId: 'b_jh_01',
        targetName: 'Jubilee Hills Flagship (JH-01)',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_reg_mgr',
    organizationId: 'org_hive_luxury',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.d@hivesalon.in',
    phone: '+91 98220 12345',
    role: 'REGIONAL_MANAGER',
    isActive: true,
    assignedBranchIds: ['b_jh_01', 'b_bh_02', 'b_hc_03'],
    scopes: [
      {
        id: 'sc_3',
        organizationId: 'org_hive_luxury',
        userId: 'usr_reg_mgr',
        scopeType: 'STATE',
        targetId: 'st_ts',
        targetName: 'Telangana State (All 3 Branches)',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_stylist_1',
    organizationId: 'org_hive_luxury',
    fullName: 'Sophia Miller',
    email: 'sophia.miller@hivesalon.in',
    phone: '+91 9988776655',
    role: 'STYLIST',
    isActive: true,
    assignedBranchIds: ['b_jh_01'],
    scopes: [
      {
        id: 'sc_4',
        organizationId: 'org_hive_luxury',
        userId: 'usr_stylist_1',
        scopeType: 'BRANCH',
        targetId: 'b_jh_01',
        targetName: 'Jubilee Hills Flagship',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);

  const [newUser, setNewUser] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'FRONT_DESK',
    scopeType: 'BRANCH' as const,
    targetName: 'Jubilee Hills Flagship (JH-01)',
  });

  const handleCreateUser = () => {
    if (!newUser.fullName || !newUser.email) {
      toast.error('Validation Error', 'Full Name and Email Address are required.');
      return;
    }
    const created: User = {
      id: `usr_${Date.now()}`,
      organizationId: 'org_hive_luxury',
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone || '+91 99000 00000',
      role: newUser.role,
      isActive: true,
      assignedBranchIds: ['b_jh_01'],
      scopes: [
        {
          id: `sc_${Date.now()}`,
          organizationId: 'org_hive_luxury',
          userId: `usr_${Date.now()}`,
          scopeType: newUser.scopeType,
          targetId: 'b_jh_01',
          targetName: newUser.targetName,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUsers([created, ...users]);
    setIsAddUserOpen(false);
    setNewUser({
      fullName: '',
      email: '',
      phone: '',
      role: 'FRONT_DESK',
      scopeType: 'BRANCH',
      targetName: 'Jubilee Hills Flagship (JH-01)',
    });
    toast.success(`User ${created.fullName} created with ${created.role} role!`);
  };

  const columns: ColumnDef<User>[] = [
    {
      key: 'fullName',
      header: 'User Details',
      cell: (row) => (
        <div className="space-y-0.5">
          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{row.fullName}</span>
          <p className="text-[11px] text-slate-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      cell: (row) => (
        <Badge
          variant={
            row.role === 'ORGANIZATION_OWNER'
              ? 'default'
              : row.role === 'BRANCH_MANAGER' || row.role === 'REGIONAL_MANAGER'
              ? 'info'
              : 'secondary'
          }
        >
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'scopes',
      header: 'Access & Scope Boundary',
      cell: (row) => (
        <div>
          {row.scopes && row.scopes.length > 0 ? (
            row.scopes.map((s) => (
              <div key={s.id} className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  [{s.scopeType}]
                </span>
                <span className="text-slate-500 truncate max-w-[200px]">{s.targetName}</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-slate-400">Default Branch</span>
          )}
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Mobile Phone',
      cell: (row) => <span className="font-mono text-xs">{row.phone || 'N/A'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.isActive ? 'success' : 'destructive'} showDot>
          {row.isActive ? 'Active' : 'Disabled'}
        </Badge>
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
            onClick={() => toast.info(`Managing permissions for ${row.fullName}`)}
          >
            <KeyRound className="h-3.5 w-3.5 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => toast.info(`Editing user ${row.fullName}`)}
          >
            <Edit2 className="h-3.5 w-3.5 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:text-rose-600"
            onClick={() => {
              setUsers(users.filter((u) => u.id !== row.id));
              toast.warning(`Archived user account ${row.fullName}`);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 text-left">
      <PageHeader
        title="Users & Access Scopes"
        description="Enterprise User Directory, Role Assignments, and Geographical Scope Boundaries."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Users & Scopes', isCurrent: true },
        ]}
        badge={<Badge variant="default">{users.length} Team Members</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/roles">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Lock className="h-4 w-4 text-amber-600" />}
              >
                Roles Matrix
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsAddUserOpen(true)}
            >
              Add User
            </Button>
          </div>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <Search
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-80"
        />
        <span className="text-xs text-slate-500 font-medium">
          Total: <strong className="text-slate-800 dark:text-slate-200">{filtered.length}</strong> active users
        </span>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No users match your query"
        emptyDescription="Create a new team account or adjust your search filter."
      />

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New User & Assign Access Scope"
        description="Create credentials and define their role and geographical authorization boundary."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateUser}>
              Create User Account
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <Input
            label="Full Name"
            placeholder="e.g. Sarah Jenkins"
            value={newUser.fullName}
            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            required
          />
          <Input
            label="Official Email"
            type="email"
            placeholder="e.g. sarah.j@hivesalon.in"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <Input
            label="Mobile Number (for SMS & Login)"
            placeholder="+91 98765 43210"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            required
          />
          <Select
            label="Assigned System Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            options={Object.values(SYSTEM_ROLES).map((r) => ({ label: r, value: r }))}
          />
          <Select
            label="Geographical Scope Boundary"
            value={newUser.scopeType}
            onChange={(e) => setNewUser({ ...newUser, scopeType: e.target.value as any })}
            options={[
              { label: 'Branch Scope (Assigned physical location)', value: 'BRANCH' },
              { label: 'City Scope (All branches in city)', value: 'CITY' },
              { label: 'District Scope (All branches in district)', value: 'DISTRICT' },
              { label: 'State Scope (All branches in state)', value: 'STATE' },
              { label: 'Organization-Wide (Universal Access)', value: 'ORGANIZATION' },
            ]}
          />
          <Input
            label="Scope Target Location"
            value={newUser.targetName}
            onChange={(e) => setNewUser({ ...newUser, targetName: e.target.value })}
            helperText="e.g. Jubilee Hills Flagship or Telangana State"
          />
        </div>
      </Modal>
    </div>
  );
}
