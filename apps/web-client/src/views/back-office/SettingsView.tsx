import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, ShieldCheck, Database, Building2, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">System Architecture & Tenant Settings</h2>
            <p className="text-xs text-slate-500">Multi-tenant configuration, RBAC permissions, and MongoDB system status</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tenant Details */}
        <div className="glass-card p-6 border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" /> Enterprise Organization
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Organization Name:</span>
              <span className="font-bold text-slate-900">{user?.organization?.name || 'Hive Luxury Salon & Spa'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Org Code:</span>
              <span className="font-bold font-mono text-brand-600">{user?.organization?.code || 'HIVE'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Currency:</span>
              <span className="font-bold text-slate-900">{user?.organization?.currency || 'INR (₹)'}</span>
            </div>
          </div>
        </div>

        {/* Stack Status */}
        <div className="glass-card p-6 border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" /> MERN Stack Environment
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Database Engine:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> MongoDB / Mongoose ODM
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Backend API:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Express.js + Node.js (Port 5000)
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Frontend Client:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> React 18 + Vite (Port 3000)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
