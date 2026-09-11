'use client';

import * as React from 'react';
import { PageHeader, DataTable, Badge, Button, useToast, type ColumnDef } from '@hive/ui';
import { ShieldCheck, Eye, Search, Filter } from 'lucide-react';
import { formatDateTime } from '@hive/utilities';

interface AuditRow {
  id: string;
  userEmail: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'STATUS_CHANGE';
  entity: string;
  entityId: string;
  branch: string;
  timestamp: string;
  diffSummary: string;
}

const mockAuditLogs: AuditRow[] = [
  {
    id: 'aud_1',
    userEmail: 'sarah.jenkins@hivesalon.com',
    userRole: 'BRANCH_MANAGER',
    action: 'CREATE',
    entity: 'APPOINTMENT',
    entityId: 'apt_8891',
    branch: 'Downtown Flagship',
    timestamp: new Date().toISOString(),
    diffSummary: 'Created booking for Eleanor Vance (Balayage & Blowdry)',
  },
  {
    id: 'aud_2',
    userEmail: 'david.chen@hivesalon.com',
    userRole: 'RECEPTIONIST',
    action: 'STATUS_CHANGE',
    entity: 'INVOICE',
    entityId: 'inv_1024',
    branch: 'Downtown Flagship',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    diffSummary: 'Status changed from PENDING to PAID (₹1,950.00 via Card)',
  },
  {
    id: 'aud_3',
    userEmail: 'admin@hivesalon.com',
    userRole: 'ORGANIZATION_OWNER',
    action: 'UPDATE',
    entity: 'SERVICE',
    entityId: 'svc_042',
    branch: 'All Branches',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    diffSummary: 'Updated BasePrice of Signature Blowdry from ₹600.00 to ₹650.00',
  },
];

export default function AuditPage() {
  const toast = useToast();

  const columns: ColumnDef<AuditRow>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      cell: (row) => (
        <span className="font-mono text-[11px] text-slate-500">
          {formatDateTime(row.timestamp)}
        </span>
      ),
    },
    {
      key: 'userEmail',
      header: 'User & Role',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs">{row.userEmail}</span>
          <p className="text-[10px] text-slate-500 uppercase font-semibold">{row.userRole}</p>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      cell: (row) => (
        <Badge
          variant={
            row.action === 'CREATE'
              ? 'success'
              : row.action === 'DELETE'
              ? 'destructive'
              : 'default'
          }
        >
          {row.action}
        </Badge>
      ),
    },
    {
      key: 'entity',
      header: 'Entity / Target',
      cell: (row) => (
        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
          {row.entity} ({row.entityId})
        </span>
      ),
    },
    {
      key: 'diffSummary',
      header: 'Audit Diff Summary',
      cell: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed block max-w-md truncate">
          {row.diffSummary}
        </span>
      ),
    },
    {
      key: 'branch',
      header: 'Branch Scope',
      cell: (row) => <Badge variant="secondary">{row.branch}</Badge>,
    },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      <PageHeader
        title="Immutable Audit Trail"
        description="Comprehensive audit logs tracking sensitive actions, price updates, user logins, and role mutations."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Audit Trail', isCurrent: true },
        ]}
        badge={<Badge variant="default">Append-Only</Badge>}
      />

      <DataTable
        columns={columns}
        data={mockAuditLogs}
        emptyTitle="No audit logs recorded"
        emptyDescription="System modifications will automatically appear here."
      />
    </div>
  );
}
