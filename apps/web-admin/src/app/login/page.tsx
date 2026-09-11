'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Modal, useToast, Badge } from '@hive/ui';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Store,
  Building2,
  CheckCircle2,
  Sparkles,
  UserCheck,
  ChevronRight,
  Briefcase,
  MapPin,
} from 'lucide-react';
import {
  SYSTEM_ROLES,
  type SystemRole,
} from '@hive/config';
import {
  canAccessPortal,
  getDefaultPortal,
  type PortalType,
} from '@hive/auth';

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  roleTitle: string;
  branches: Array<{ id: string; name: string; code: string; city: string }>;
  defaultPortal: PortalType;
}

const DEMO_USERS: DemoUser[] = [
  {
    id: 'u-1',
    name: 'Sarah Jenkins',
    email: 'reception.hyd@hivesalon.in',
    role: SYSTEM_ROLES.FRONT_DESK,
    roleTitle: 'Front Desk Lead',
    branches: [
      { id: 'b1', name: 'Jubilee Hills Flagship', code: 'JH-01', city: 'Hyderabad' },
    ],
    defaultPortal: 'FRONT_DESK',
  },
  {
    id: 'u-2',
    name: 'Vikram Malhotra',
    email: 'manager.hyd@hivesalon.in',
    role: SYSTEM_ROLES.BRANCH_MANAGER,
    roleTitle: 'Branch General Manager',
    branches: [
      { id: 'b1', name: 'Jubilee Hills Flagship', code: 'JH-01', city: 'Hyderabad' },
      { id: 'b2', name: 'Banjara Hills Spa', code: 'BH-02', city: 'Hyderabad' },
    ],
    defaultPortal: 'BACK_OFFICE',
  },
  {
    id: 'u-3',
    name: 'Dr. Evelyn Montgomery',
    email: 'owner@hivesalon.in',
    role: SYSTEM_ROLES.ORGANIZATION_OWNER,
    roleTitle: 'Organization Owner & Director',
    branches: [
      { id: 'b1', name: 'Jubilee Hills Flagship', code: 'JH-01', city: 'Hyderabad' },
      { id: 'b2', name: 'Banjara Hills Spa', code: 'BH-02', city: 'Hyderabad' },
      { id: 'b3', name: 'Hitech City Express', code: 'HC-03', city: 'Hyderabad' },
      { id: 'b4', name: 'Indiranagar Sanctuary', code: 'IN-01', city: 'Bengaluru' },
    ],
    defaultPortal: 'BACK_OFFICE',
  },
  {
    id: 'u-4',
    name: 'Rajesh Kumar',
    email: 'finance@hivesalon.in',
    role: SYSTEM_ROLES.ACCOUNTANT,
    roleTitle: 'Chief Accountant & Comptroller',
    branches: [
      { id: 'b1', name: 'Jubilee Hills Flagship', code: 'JH-01', city: 'Hyderabad' },
      { id: 'b2', name: 'Banjara Hills Spa', code: 'BH-02', city: 'Hyderabad' },
      { id: 'b3', name: 'Hitech City Express', code: 'HC-03', city: 'Hyderabad' },
    ],
    defaultPortal: 'BACK_OFFICE',
  },
];

export default function PrimaryLoginPage() {
  const router = useRouter();
  const toast = useToast();

  // Selected Portal Choice
  const [selectedPortal, setSelectedPortal] = React.useState<PortalType>('FRONT_DESK');
  const [activeStep, setActiveStep] = React.useState<'PORTAL_SELECT' | 'CREDENTIALS' | 'BRANCH_SELECT'>('PORTAL_SELECT');

  // Credentials State
  const [identifier, setIdentifier] = React.useState('reception.hyd@hivesalon.in');
  const [password, setPassword] = React.useState('password123');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  // Resolved User & Branch Context
  const [authenticatedUser, setAuthenticatedUser] = React.useState<DemoUser | null>(null);
  const [selectedBranchId, setSelectedBranchId] = React.useState<string>('b1');

  // Forgot Password Modal
  const [isForgotOpen, setIsForgotOpen] = React.useState(false);
  const [forgotIdentifier, setForgotIdentifier] = React.useState('');
  const [forgotStep, setForgotStep] = React.useState<'IDENTIFIER' | 'OTP' | 'NEW_PASSWORD'>('IDENTIFIER');
  const [otpCode, setOtpCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSelectPortalOption = (portal: PortalType) => {
    setSelectedPortal(portal);
    setErrorMsg('');
    // Auto-populate appropriate default demo credentials for the chosen portal
    if (portal === 'FRONT_DESK') {
      setIdentifier('reception.hyd@hivesalon.in');
    } else {
      setIdentifier('owner@hivesalon.in');
    }
    setActiveStep('CREDENTIALS');
  };

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your registered email address or mobile number.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must contain at least 8 characters.');
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Resolve demo user matching identifier
      const matchedUser = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === identifier.toLowerCase().trim()
      ) || DEMO_USERS[0];

      // Validate portal authorization
      const isAuthorized = canAccessPortal(matchedUser.role, selectedPortal);
      if (!isAuthorized) {
        setErrorMsg(
          `Your user account (${matchedUser.name} - ${matchedUser.roleTitle}) is not authorized to sign into ${
            selectedPortal === 'FRONT_DESK' ? 'Front Desk' : 'Back Office'
          }. Please choose the other portal or sign in with administrative credentials.`
        );
        toast.error('Access Denied', 'Unauthorized portal selection for this account role.');
        return;
      }

      setAuthenticatedUser(matchedUser);

      // Branch selection logic
      if (matchedUser.branches.length > 1) {
        // Multiple branches available: prompt branch selection
        setSelectedBranchId(matchedUser.branches[0].id);
        setActiveStep('BRANCH_SELECT');
      } else {
        // Single branch: auto-select and proceed
        completeLogin(matchedUser, matchedUser.branches[0].id, selectedPortal);
      }
    } catch {
      setErrorMsg('An unexpected error occurred during authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const completeLogin = (user: DemoUser, branchId: string, portal: PortalType) => {
    const chosenBranch = user.branches.find((b) => b.id === branchId) || user.branches[0];

    // Store active session in localStorage for local state continuity
    if (typeof window !== 'undefined') {
      const sessionData = {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        roleTitle: user.roleTitle,
        organizationId: 'org-001',
        organizationName: 'Hive Beauty Group',
        activeBranchId: chosenBranch.id,
        activeBranchName: chosenBranch.name,
        activeBranchCode: chosenBranch.code,
        activePortal: portal,
        allowedPortals: user.role === SYSTEM_ROLES.ORGANIZATION_OWNER || user.role === SYSTEM_ROLES.BRANCH_MANAGER
          ? ['FRONT_DESK', 'BACK_OFFICE']
          : [portal],
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('hive_session', JSON.stringify(sessionData));
    }

    toast.success(
      `Welcome back, ${user.name}!`,
      `Opening ${portal === 'FRONT_DESK' ? 'Front Desk Operations' : 'Back Office Administration'}...`
    );

    // Strict portal-aware routing
    if (portal === 'FRONT_DESK') {
      router.push('/front-desk/dashboard');
    } else {
      router.push('/back-office/dashboard');
    }
  };

  const handleQuickRoleFill = (user: DemoUser) => {
    setIdentifier(user.email);
    setPassword('password123');
    toast.info(`Loaded credentials for ${user.name} (${user.roleTitle})`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 text-slate-100 font-sans select-none">
      <div className="w-full max-w-4xl space-y-6 sm:space-y-8 text-center">
        {/* =====================================================================
            TOP BRAND HEADER
        ====================================================================== */}
        <div className="space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-slate-950 font-black text-3xl shadow-xl shadow-amber-500/20 border border-amber-400/40">
            H
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Welcome to Hive Salon
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Centralized Multi-Branch Salon, Spa & Wellness ERP
          </p>
        </div>

        {/* =====================================================================
            STEP 1: PRIMARY TWO-PORTAL CHOICE CARDS
        ====================================================================== */}
        {activeStep === 'PORTAL_SELECT' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-xs uppercase tracking-widest font-bold text-amber-400/90">
              Select your workspace destination
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto text-left">
              {/* Option 1: FRONT DESK */}
              <button
                type="button"
                onClick={() => handleSelectPortalOption('FRONT_DESK')}
                className="group relative p-6 sm:p-8 rounded-3xl border-2 border-slate-800 bg-slate-900/90 hover:bg-slate-850 hover:border-amber-500/80 transition-all duration-200 shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between space-y-6 text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      <Store className="w-7 h-7" />
                    </div>
                    <Badge variant="warning" className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
                      Daily Operations
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      FRONT DESK
                    </h2>
                    <p className="text-xs font-semibold text-amber-400/90 mt-0.5">
                      Run today's salon operations.
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Appointments, customers, check-ins and billing
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    Continue to Front Desk →
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Option 2: BACK OFFICE */}
              <button
                type="button"
                onClick={() => handleSelectPortalOption('BACK_OFFICE')}
                className="group relative p-6 sm:p-8 rounded-3xl border-2 border-slate-800 bg-slate-900/90 hover:bg-slate-850 hover:border-sky-500/80 transition-all duration-200 shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between space-y-6 text-left focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <Badge variant="info" className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
                      Management & Admin
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                      BACK OFFICE
                    </h2>
                    <p className="text-xs font-semibold text-sky-400/90 mt-0.5">
                      Manage and grow your salon business.
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Manage your salon, staff, inventory, finance and reports
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    Continue to Back Office →
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-sky-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 2: CREDENTIALS INPUT FORM
        ====================================================================== */}
        {activeStep === 'CREDENTIALS' && (
          <div className="max-w-md mx-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Active Portal Ribbon */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    selectedPortal === 'FRONT_DESK'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-sky-500/20 text-sky-400'
                  }`}
                >
                  {selectedPortal === 'FRONT_DESK' ? <Store className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {selectedPortal === 'FRONT_DESK' ? 'Front Desk Portal' : 'Back Office Administration'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {selectedPortal === 'FRONT_DESK' ? "Today's Salon Operations" : 'Management & Reports'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep('PORTAL_SELECT')}
                className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Change Portal
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl border border-rose-500/40 bg-rose-950/60 text-rose-300 text-xs leading-relaxed animate-in fade-in">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Email Address or Mobile Number"
                placeholder="e.g. reception@hivesalon.in or owner@hivesalon.in"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password (e.g. password123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 pr-10 py-1 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
                  />
                  <span>Remember this device</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotIdentifier(identifier);
                    setIsForgotOpen(true);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                className={`w-full h-11 font-bold text-sm mt-3 ${
                  selectedPortal === 'BACK_OFFICE' ? 'bg-sky-600 hover:bg-sky-500 text-white' : ''
                }`}
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {selectedPortal === 'FRONT_DESK' ? 'Continue to Front Desk' : 'Continue to Back Office'}
              </Button>
            </form>

            {/* Quick Demo Role Selector */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                ⚡ Quick Demo Credentials
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickRoleFill(user)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      identifier.toLowerCase() === user.email.toLowerCase()
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="font-bold block text-white text-[11px]">{user.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{user.roleTitle}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 3: MULTI-BRANCH SELECTOR MODAL / SCREEN
        ====================================================================== */}
        {activeStep === 'BRANCH_SELECT' && authenticatedUser && (
          <div className="max-w-md mx-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Select Active Salon Branch</h3>
              <p className="text-xs text-slate-400">
                You have authorized access to {authenticatedUser.branches.length} locations. Select where you want to operate today.
              </p>
            </div>

            <div className="space-y-2">
              {authenticatedUser.branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedBranchId === branch.id
                      ? 'border-amber-500 bg-amber-500/10 text-white shadow-md'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        selectedBranchId === branch.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {branch.code.split('-')[0]}
                    </div>
                    <div>
                      <span className="font-bold text-xs block text-white">{branch.name}</span>
                      <span className="text-[10px] text-slate-400">{branch.city} • Code: {branch.code}</span>
                    </div>
                  </div>
                  {selectedBranchId === branch.id && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              className="w-full h-11 font-bold text-sm"
              onClick={() => completeLogin(authenticatedUser, selectedBranchId, selectedPortal)}
            >
              Confirm Branch & Enter {selectedPortal === 'FRONT_DESK' ? 'Front Desk' : 'Back Office'}
            </Button>
          </div>
        )}

        {/* =====================================================================
            SECURITY & COMPLIANCE BADGE
        ====================================================================== */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Role-Governed Geographic Scopes • AES-256 Bit Invariant Protection</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        title="Reset Password"
        description="Verify your identity using a 6-digit OTP code."
        maxWidth="md"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" onClick={() => setIsForgotOpen(false)}>
              Cancel
            </Button>
            {forgotStep === 'IDENTIFIER' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (!forgotIdentifier) return;
                  toast.success('OTP Sent', 'Demo verification code: 123456');
                  setForgotStep('OTP');
                }}
              >
                Send 6-Digit OTP
              </Button>
            )}
            {forgotStep === 'OTP' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (otpCode.length !== 6) return;
                  setForgotStep('NEW_PASSWORD');
                }}
              >
                Verify Code
              </Button>
            )}
            {forgotStep === 'NEW_PASSWORD' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (newPassword.length < 8 || newPassword !== confirmPassword) return;
                  setIsForgotOpen(false);
                  setForgotStep('IDENTIFIER');
                  toast.success('Password Reset', 'You can now sign in with your new password.');
                }}
              >
                Save New Password
              </Button>
            )}
          </div>
        }
      >
        <div className="space-y-4 text-left">
          {forgotStep === 'IDENTIFIER' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                Enter your registered email address or mobile number. We will send a 6-digit verification code.
              </p>
              <Input
                label="Email or Mobile"
                value={forgotIdentifier}
                onChange={(e) => setForgotIdentifier(e.target.value)}
                placeholder="e.g. reception@hivesalon.in"
                required
              />
            </div>
          )}

          {forgotStep === 'OTP' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Enter the 6-digit verification code sent to{' '}
                <strong className="text-slate-200">{forgotIdentifier}</strong> (Demo code: <strong>123456</strong>):
              </p>
              <Input
                label="6-Digit Verification Code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>
          )}

          {forgotStep === 'NEW_PASSWORD' && (
            <div className="space-y-3">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
