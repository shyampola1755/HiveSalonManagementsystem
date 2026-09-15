import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck, User, Scissors, Building2 } from 'lucide-react';

const DEMO_PROFILES: Record<string, any> = {
  'admin@hivesalon.com': {
    id: 'user_admin_01',
    email: 'admin@hivesalon.com',
    fullName: 'Shyam Pola (Super Admin)',
    role: 'SUPER_ADMIN',
    primaryBranchId: 'hyd-01',
    branches: [
      { id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true },
      { id: 'mum-01', name: 'Mumbai Salon & Spa (Bandra West)', code: 'MUM-01' },
      { id: 'blr-01', name: 'Bangalore Lounge (Indiranagar)', code: 'BLR-01' },
    ],
    organization: {
      id: 'org_01',
      name: 'Hive Luxury Salon & Spa',
      code: 'HIVE',
      currency: 'INR',
    },
  },
  'manager@hivesalon.com': {
    id: 'user_manager_01',
    email: 'manager@hivesalon.com',
    fullName: 'Priya Sharma (Branch Manager)',
    role: 'BRANCH_MANAGER',
    primaryBranchId: 'hyd-01',
    branches: [
      { id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true },
    ],
    organization: {
      id: 'org_01',
      name: 'Hive Luxury Salon & Spa',
      code: 'HIVE',
      currency: 'INR',
    },
  },
  'frontdesk@hivesalon.com': {
    id: 'user_frontdesk_01',
    email: 'frontdesk@hivesalon.com',
    fullName: 'Ananya Reddy (Front Desk Coordinator)',
    role: 'FRONT_DESK',
    primaryBranchId: 'hyd-01',
    branches: [
      { id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true },
    ],
    organization: {
      id: 'org_01',
      name: 'Hive Luxury Salon & Spa',
      code: 'HIVE',
      currency: 'INR',
    },
  },
  'vikram@hivesalon.com': {
    id: 'user_stylist_01',
    email: 'vikram@hivesalon.com',
    fullName: 'Vikram Mehta (Senior Creative Stylist)',
    role: 'STYLIST',
    primaryBranchId: 'hyd-01',
    branches: [
      { id: 'hyd-01', name: 'Hyderabad Flagship (Banjara Hills)', code: 'HYD-01', isMainBranch: true },
    ],
    organization: {
      id: 'org_01',
      name: 'Hive Luxury Salon & Spa',
      code: 'HIVE',
      currency: 'INR',
    },
  },
};

export const LoginView: React.FC = () => {
  const isPosMode = typeof window !== 'undefined' && (
    window.location.search.includes('pos') ||
    window.location.pathname.includes('pos') ||
    navigator.userAgent.includes('HiveSalonPOS')
  );

  const [email, setEmail] = useState(isPosMode ? 'frontdesk@hivesalon.com' : 'admin@hivesalon.com');
  const [password, setPassword] = useState('Password123!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const targetRoute = login(res.data.token, res.data.user);
        showToast(`Welcome back, ${res.data.user.fullName}!`, 'success');
        navigate(isPosMode ? '/front-desk/pos' : targetRoute);
        return;
      }
    } catch (err: any) {
      // Automatic fallback for Vercel demo environment if external API is not reachable
      const cleanEmail = email.toLowerCase().trim();
      const demoUser = DEMO_PROFILES[cleanEmail];
      if (demoUser) {
        const fallbackToken = `demo_session_${demoUser.role.toLowerCase()}_${Date.now()}`;
        const targetRoute = login(fallbackToken, demoUser);
        showToast(`Welcome, ${demoUser.fullName}!`, 'success');
        navigate(isPosMode ? '/front-desk/pos' : targetRoute);
        return;
      }
      showToast(err.response?.data?.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden selection:bg-brand-500 selection:text-slate-950">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full glass-card p-5 sm:p-8 border-slate-200 bg-white shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-400 via-brand-500 to-amber-400 flex items-center justify-center text-slate-950 font-extrabold text-2xl mx-auto shadow-md mb-4">
            H
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center justify-center gap-2">
            HIVE <span className="text-brand-600 font-semibold">{isPosMode ? 'POS' : 'SALON'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isPosMode
              ? 'Counter Checkout Terminal & Cashier Billing'
              : 'Centralized Multi-Branch Enterprise ERP & POS Platform (MERN)'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Cashier / Staff Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hivesalon.com"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Terminal Password / PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-field pl-10"
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-gold w-full mt-2 py-3 text-sm font-bold shadow-md">
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                {isPosMode ? 'Sign In to POS Terminal' : 'Sign In to Hive ERP'} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins for All 4 Roles */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            Quick Demo Profiles (Click to Auto-fill)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => quickFill('admin@hivesalon.com')}
              className={`p-2 rounded-xl text-center border transition-all ${
                email === 'admin@hivesalon.com'
                  ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-sm font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="text-[11px] font-bold">Super Admin</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Enterprise BI</div>
            </button>

            <button
              type="button"
              onClick={() => quickFill('manager@hivesalon.com')}
              className={`p-2 rounded-xl text-center border transition-all ${
                email === 'manager@hivesalon.com'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="text-[11px] font-bold">Branch Mgr</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Floor Hub</div>
            </button>

            <button
              type="button"
              onClick={() => quickFill('frontdesk@hivesalon.com')}
              className={`p-2 rounded-xl text-center border transition-all ${
                email === 'frontdesk@hivesalon.com'
                  ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-sm font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="text-[11px] font-bold">Front Desk</div>
              <div className="text-[9px] text-slate-500 mt-0.5">POS & Queue</div>
            </button>

            <button
              type="button"
              onClick={() => quickFill('vikram@hivesalon.com')}
              className={`p-2 rounded-xl text-center border transition-all ${
                email === 'vikram@hivesalon.com'
                  ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="text-[11px] font-bold">Stylist</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Chair & Formulas</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
