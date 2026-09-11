import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('admin@hivesalon.com');
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
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showToast(`Welcome back, ${res.data.user.fullName}!`, 'success');
        navigate('/front-desk/dashboard');
      }
    } catch (err: any) {
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
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center p-4 relative overflow-hidden selection:bg-brand-500 selection:text-slate-950">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full glass-card p-8 border-slate-800/80 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-400 via-brand-500 to-amber-300 flex items-center justify-center text-slate-950 font-extrabold text-2xl mx-auto shadow-glow mb-4">
            H
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            HIVE <span className="text-brand-400 font-semibold">SALON</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Centralized Multi-Branch Enterprise ERP & POS Platform (MERN)
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
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

          <button type="submit" disabled={isSubmitting} className="btn-gold w-full mt-2 py-3 text-sm font-bold">
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                Sign In to Hive ERP <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            Quick Demo Profiles
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickFill('admin@hivesalon.com')}
              className="px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-brand-300 border border-slate-700/60 transition-colors"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => quickFill('manager@hivesalon.com')}
              className="px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-brand-300 border border-slate-700/60 transition-colors"
            >
              Branch Mgr
            </button>
            <button
              type="button"
              onClick={() => quickFill('frontdesk@hivesalon.com')}
              className="px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-brand-300 border border-slate-700/60 transition-colors"
            >
              Front Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
