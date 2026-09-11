'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  CreditCard,
  Wallet,
  Gift,
  QrCode,
  Laptop,
  ArrowRight,
} from 'lucide-react';
import CustomerPortalPage from '../../../../customer-portal/src/app/page';

export default function AdminPortalPreviewPage() {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'full'>('mobile');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
              PHASE 14 — GUEST PORTAL & ONLINE BOOKING
            </span>
            <span className="text-xs text-slate-400 font-mono">Port: 3002</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Customer Portal & Self-Service Experience</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Mobile-first guest experience for 1-click booking, conflict-free live slots, OTP auth, rescheduling, cancellation policies, wallet recharge, and rewards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                deviceMode === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile View (390px)</span>
            </button>
            <button
              onClick={() => setDeviceMode('full')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                deviceMode === 'full' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
          </div>

          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-2xl text-xs font-bold transition shadow-sm"
          >
            <span>Open Standalone Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Portal Simulator Container */}
      <div className="flex justify-center">
        {deviceMode === 'mobile' ? (
          <div className="w-full max-w-[430px] rounded-[48px] bg-slate-900 p-3 border-[6px] border-slate-800 shadow-2xl ring-4 ring-amber-500/20 relative">
            {/* Mobile speaker notch */}
            <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Viewport frame */}
            <div className="rounded-[36px] overflow-hidden border border-slate-800 h-[820px] overflow-y-auto no-scrollbar bg-slate-950">
              <CustomerPortalPage />
            </div>

            {/* Mobile bottom home indicator */}
            <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
          </div>
        ) : (
          <div className="w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <CustomerPortalPage />
          </div>
        )}
      </div>
    </div>
  );
}
