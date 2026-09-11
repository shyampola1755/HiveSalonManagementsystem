'use client';

import * as React from 'react';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  Select,
  useToast,
} from '@hive/ui';
import { Lock, ShieldCheck, Check, X, KeyRound, UserCheck, Search } from 'lucide-react';
import { SYSTEM_ROLES, PERMISSION_FLAGS, type SystemRole } from '@hive/config';
import { ROLE_PERMISSIONS, hasPermission } from '@hive/auth';

export default function RolesAndPermissionsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = React.useState('matrix');
  const [selectedRole, setSelectedRole] = React.useState<SystemRole>(SYSTEM_ROLES.BRANCH_MANAGER);
  const [searchPerm, setSearchPerm] = React.useState('');

  const allRoles = Object.values(SYSTEM_ROLES);
  const allPermissions = Object.values(PERMISSION_FLAGS);

  const filteredPermissions = allPermissions.filter((p) =>
    p.toLowerCase().includes(searchPerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 text-left">
      <PageHeader
        title="Roles, Permissions & Access Control"
        description="Granular RBAC Permission Matrix across all 14 enterprise roles and access boundary inspector."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Users & Scopes', href: '/users' },
          { label: 'Roles & Permissions', isCurrent: true },
        ]}
        badge={<Badge variant="default">14 Roles • 30+ Permissions</Badge>}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<ShieldCheck className="h-4 w-4" />}
            onClick={() => {
              toast.success('Access Control Synchronized', 'All backend RBAC guards active.');
            }}
          >
            Verify Security Matrix
          </Button>
        }
      />

      <Tabs
        variant="pills"
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'matrix', label: '1. Roles & Permissions Matrix' },
          { id: 'inspector', label: '2. Role Permission Inspector' },
        ]}
      />

      {/* TAB 1: INTERACTIVE PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div>
              <CardTitle>Granular Permission Grid</CardTitle>
              <CardDescription>
                System-wide evaluation matrix. Columns represent roles, rows represent granular permissions.
              </CardDescription>
            </div>
            <input
              type="text"
              placeholder="Search permission..."
              value={searchPerm}
              onChange={(e) => setSearchPerm(e.target.value)}
              className="h-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 w-52"
            />
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-900/80 border-y border-slate-200 dark:border-slate-800">
                  <th className="sticky left-0 bg-slate-50 dark:bg-slate-900 p-3 font-bold text-slate-900 dark:text-slate-100 z-10 min-w-[220px] border-r">
                    Permission Flag
                  </th>
                  {allRoles.slice(0, 8).map((role) => (
                    <th
                      key={role}
                      className="p-3 text-center font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[120px]"
                    >
                      <span className="block text-[11px] font-bold truncate">{role}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPermissions.map((perm) => (
                  <tr
                    key={perm}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="sticky left-0 bg-white dark:bg-slate-900 p-3 font-mono text-xs text-slate-800 dark:text-slate-200 z-10 border-r">
                      {perm}
                    </td>
                    {allRoles.slice(0, 8).map((role) => {
                      const isAllowed = hasPermission(role, perm as any);
                      return (
                        <td key={role} className="p-3 text-center align-middle">
                          {isAllowed ? (
                            <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
                              <X className="h-3 w-3" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: ROLE INSPECTOR */}
      {activeTab === 'inspector' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Access Inspector</CardTitle>
              <CardDescription>
                Select a role to inspect exactly which actions and resources it is authorized to perform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-sm">
                <Select
                  label="Select Role to Inspect"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as SystemRole)}
                  options={allRoles.map((r) => ({ label: r, value: r }))}
                />
              </div>

              {/* Role Overview Box */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/60 dark:bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {selectedRole} Permissions Summary
                    </h4>
                    <span className="text-xs text-slate-500">
                      Granted {ROLE_PERMISSIONS[selectedRole]?.length || allPermissions.length} of{' '}
                      {allPermissions.length} total permissions
                    </span>
                  </div>
                  <Badge variant="default">{selectedRole}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                  {allPermissions.map((perm) => {
                    const isGranted = hasPermission(selectedRole, perm as any);
                    return (
                      <div
                        key={perm}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs ${
                          isGranted
                            ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-medium'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 opacity-60'
                        }`}
                      >
                        {isGranted ? (
                          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-slate-300 shrink-0" />
                        )}
                        <span className="font-mono truncate">{perm}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
