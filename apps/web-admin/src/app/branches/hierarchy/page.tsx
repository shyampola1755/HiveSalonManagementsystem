'use client';

import * as React from 'react';
import {
  PageHeader,
  HierarchyTree,
  Button,
  Badge,
  Modal,
  Input,
  Select,
  useToast,
  type HierarchyStateNode,
  type HierarchyBranchNode,
} from '@hive/ui';
import { MapPin, Plus, Building2, Globe, Sparkles } from 'lucide-react';

const initialHierarchyData: HierarchyStateNode[] = [
  {
    id: 'st_ts',
    name: 'Telangana',
    code: 'TS',
    status: 'ACTIVE',
    districts: [
      {
        id: 'dist_hyd',
        name: 'Hyderabad District',
        code: 'HYD-D',
        status: 'ACTIVE',
        cities: [
          {
            id: 'city_hyd',
            name: 'Hyderabad',
            code: 'HYD',
            status: 'ACTIVE',
            branches: [
              {
                id: 'b_jh_01',
                name: 'Jubilee Hills Flagship',
                code: 'JH-01',
                address: 'Road No. 36, Jubilee Hills, Hyderabad',
                phone: '+91 40 2355 7890',
                status: 'ACTIVE',
                isMain: true,
              },
              {
                id: 'b_bh_02',
                name: 'Banjara Hills Spa & Lounge',
                code: 'BH-02',
                address: 'Road No. 12, Banjara Hills, Hyderabad',
                phone: '+91 40 2334 5678',
                status: 'ACTIVE',
              },
              {
                id: 'b_hc_03',
                name: 'Hitech City Express',
                code: 'HC-03',
                address: 'Cyber Towers Quad, Hitech City, Hyderabad',
                phone: '+91 40 6789 0123',
                status: 'ACTIVE',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'st_ka',
    name: 'Karnataka',
    code: 'KA',
    status: 'ACTIVE',
    districts: [
      {
        id: 'dist_blr',
        name: 'Bengaluru Urban',
        code: 'BLR-U',
        status: 'ACTIVE',
        cities: [
          {
            id: 'city_blr',
            name: 'Bengaluru',
            code: 'BLR',
            status: 'ACTIVE',
            branches: [
              {
                id: 'b_in_01',
                name: 'Indiranagar Sanctuary',
                code: 'IN-01',
                address: '100ft Road, Indiranagar, Bengaluru',
                phone: '+91 80 4123 4567',
                status: 'ACTIVE',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'st_mh',
    name: 'Maharashtra',
    code: 'MH',
    status: 'ACTIVE',
    districts: [
      {
        id: 'dist_mum',
        name: 'Mumbai Suburban',
        code: 'MUM-S',
        status: 'ACTIVE',
        cities: [
          {
            id: 'city_mum',
            name: 'Mumbai',
            code: 'MUM',
            status: 'ACTIVE',
            branches: [
              {
                id: 'b_bk_01',
                name: 'Bandra West Aesthetics',
                code: 'BW-01',
                address: 'Hill Road, Bandra West, Mumbai',
                phone: '+91 22 2640 1234',
                status: 'ACTIVE',
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function GeographicalHierarchyPage() {
  const toast = useToast();
  const [treeData, setTreeData] = React.useState<HierarchyStateNode[]>(initialHierarchyData);

  // Modals for adding nodes
  const [isAddStateOpen, setIsAddStateOpen] = React.useState(false);
  const [newStateName, setNewStateName] = React.useState('');
  const [newStateCode, setNewStateCode] = React.useState('');

  const [isAddBranchOpen, setIsAddBranchOpen] = React.useState(false);
  const [newBranchName, setNewBranchName] = React.useState('');
  const [newBranchCode, setNewBranchCode] = React.useState('');
  const [newBranchAddress, setNewBranchAddress] = React.useState('');
  const [newBranchPhone, setNewBranchPhone] = React.useState('');

  const handleAddState = () => {
    if (!newStateName || !newStateCode) {
      toast.error('Validation Error', 'State Name and State Code are required.');
      return;
    }
    const created: HierarchyStateNode = {
      id: `st_${Date.now()}`,
      name: newStateName,
      code: newStateCode.toUpperCase(),
      status: 'ACTIVE',
      districts: [],
    };
    setTreeData([...treeData, created]);
    setIsAddStateOpen(false);
    setNewStateName('');
    setNewStateCode('');
    toast.success(`State ${created.name} added to geographical hierarchy!`);
  };

  const handleAddBranch = () => {
    if (!newBranchName || !newBranchCode) {
      toast.error('Validation Error', 'Branch Name and Code are required.');
      return;
    }
    const newBranch: HierarchyBranchNode = {
      id: `b_${Date.now()}`,
      name: newBranchName,
      code: newBranchCode.toUpperCase(),
      address: newBranchAddress || 'Commercial District',
      phone: newBranchPhone || '+91 99000 11223',
      status: 'ACTIVE',
    };

    // Add to first city of first district of Telangana for demo
    const updated = [...treeData];
    if (updated[0]?.districts[0]?.cities[0]) {
      updated[0].districts[0].cities[0].branches.push(newBranch);
      setTreeData(updated);
      setIsAddBranchOpen(false);
      setNewBranchName('');
      setNewBranchCode('');
      toast.success(`Branch ${newBranch.name} (${newBranch.code}) created successfully!`);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      <PageHeader
        title="Centralized Geographical Hierarchy"
        description="Multi-tier location architecture: Organization → State → District → City → Branch."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Branches', href: '/branches' },
          { label: 'Geographical Hierarchy', isCurrent: true },
        ]}
        badge={<Badge variant="default">Phase 2 Multi-Branch</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsAddStateOpen(true)}
            >
              Add State
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsAddBranchOpen(true)}
            >
              New Branch
            </Button>
          </div>
        }
      />

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">States Covered</span>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {treeData.length} States
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Districts</span>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {treeData.reduce((acc, st) => acc + st.districts.length, 0)} Districts
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Cities</span>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {treeData.reduce(
              (acc, st) =>
                acc + st.districts.reduce((cAcc, d) => cAcc + d.cities.length, 0),
              0
            )}{' '}
            Cities
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 p-3 bg-amber-50/50 dark:bg-amber-950/30 shadow-xs">
          <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold uppercase">
            Total Branches
          </span>
          <p className="text-base font-bold text-amber-900 dark:text-amber-200 mt-0.5">
            {treeData.reduce(
              (acc, st) =>
                acc +
                st.districts.reduce(
                  (cAcc, d) =>
                    cAcc + d.cities.reduce((bAcc, c) => bAcc + c.branches.length, 0),
                  0
                ),
              0
            )}{' '}
            Live Branches
          </p>
        </div>
      </div>

      {/* Visual Hierarchy Tree Explorer */}
      <HierarchyTree
        countryName="Hive Beauty Group — India (HQ)"
        states={treeData}
        onAddState={() => setIsAddStateOpen(true)}
        onAddDistrict={(stId) => toast.info(`Adding district to State (${stId})`)}
        onAddCity={(stId, distId) => toast.info(`Adding city to District (${distId})`)}
        onAddBranch={(cityId) => setIsAddBranchOpen(true)}
        onSelectBranch={(branch) => {
          toast.info(`Branch selected: ${branch.name} (${branch.code})`);
        }}
      />

      {/* Add State Modal */}
      <Modal
        isOpen={isAddStateOpen}
        onClose={() => setIsAddStateOpen(false)}
        title="Add New State / Region"
        description="Expand geographical operations to a new state."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddStateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddState}>
              Create State
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="State Name"
            placeholder="e.g. Tamil Nadu"
            value={newStateName}
            onChange={(e) => setNewStateName(e.target.value)}
            required
          />
          <Input
            label="State Code (ISO)"
            placeholder="e.g. TN"
            value={newStateCode}
            onChange={(e) => setNewStateCode(e.target.value)}
            required
          />
        </div>
      </Modal>

      {/* Add Branch Modal */}
      <Modal
        isOpen={isAddBranchOpen}
        onClose={() => setIsAddBranchOpen(false)}
        title="Create New Branch Location"
        description="Configure physical salon or spa salon premises."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddBranchOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddBranch}>
              Register Branch
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Branch Name"
            placeholder="e.g. Jubilee Hills Flagship"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            required
          />
          <Input
            label="Branch Code"
            placeholder="e.g. JH-01"
            value={newBranchCode}
            onChange={(e) => setNewBranchCode(e.target.value)}
            required
          />
          <Input
            label="Street Address"
            placeholder="Road No. 36, Jubilee Hills"
            value={newBranchAddress}
            onChange={(e) => setNewBranchAddress(e.target.value)}
            required
          />
          <Input
            label="Contact Phone"
            placeholder="+91 40 2355 7890"
            value={newBranchPhone}
            onChange={(e) => setNewBranchPhone(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
