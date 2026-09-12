import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Scissors,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  User,
  FlaskConical,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react';

export const StylistView: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'formulas' | 'earnings'>('today');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await apiClient.get('/appointments/queue');
        if (res.data.success) {
          setAppointments(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQueue();
  }, []);

  // Filter appointments for the logged-in stylist or general queue
  const myAppointments = appointments;

  const myFormulas = [
    {
      clientName: 'Rhea Kapoor',
      service: 'Warm Honey Balayage Gloss',
      brand: "L'Oréal Professionnel Dia Light",
      mix: '8.34 (30g) + 9.02 (15g) + Clear (10g)',
      developer: '6 Vol (1.8%) • Ratio 1:1.5',
      time: '20 mins processing',
      notes: 'Very porous ends. Do not exceed 20 mins. Rinse with Metal Detox shampoo.',
      date: 'Today, 11:15 AM',
    },
    {
      clientName: 'Pooja Hegde',
      service: 'Cool Mocha Brunette Gloss',
      brand: 'Wella Professionals Illumina',
      mix: '6/16 (40g) + 7/81 (20g)',
      developer: '1.9% Pastel Developer',
      time: '15 mins processing',
      notes: 'Tone on towel-dried hair after pre-lightening.',
      date: '3 days ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stylist Header */}
      <div className="glass-card p-6 bg-gradient-to-r from-amber-50/70 via-rose-50/50 to-purple-50/40 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-600 font-bold uppercase tracking-wider mb-1">
            <Scissors className="w-4 h-4" /> Stylist Station & Chair Dashboard
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            Welcome back, {user?.fullName || 'Vikram Mehta'} 💇‍♂️
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Senior Creative Hair Stylist • Chair #03 (Banjara Hills Flagship)
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'today' ? 'bg-brand-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Chair Schedule
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'formulas' ? 'bg-brand-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hair Formulas
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'earnings' ? 'bg-brand-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Commissions
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>MY CLIENTS TODAY</span>
            <User className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{myAppointments.length} Clients</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">1 currently in service</div>
        </div>

        <div className="glass-card p-5 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>TODAY'S COMMISSIONS</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹1,660</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">20% commission tier rate</div>
        </div>

        <div className="glass-card p-5 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>MONTHLY TARGET PROGRESS</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹98,400 / 1.5L</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: '65.6%' }}></div>
          </div>
        </div>

        <div className="glass-card p-5 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>CLIENT RATING</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">4.95 ⭐</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Based on 64 reviews</div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chair Appointments */}
          <div className="lg:col-span-2 glass-card p-6 border-slate-200 bg-white shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" /> Today's Chair Queue & Appointments
            </h3>
              {myAppointments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No active appointments currently scheduled in your chair queue.
                </div>
              ) : (
                myAppointments.map((app) => (
                  <div
                    key={app._id}
                    className={`p-5 rounded-2xl border transition-all ${
                      app.status === 'IN_SERVICE'
                        ? 'bg-brand-500/10 border-brand-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center font-bold text-brand-600 shadow-sm">
                          <span className="text-xs">{app.startTime}</span>
                          <span className="text-[10px] text-slate-400">{app.durationMinutes}m</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-base text-slate-900">{app.customerName}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                app.status === 'IN_SERVICE'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {app.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-xs text-brand-600 font-semibold mt-0.5">{app.serviceName}</div>
                          {app.notes && (
                            <div className="text-[11px] text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 mt-2">
                              📝 {app.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right sm:self-center">
                        <div className="text-base font-black text-slate-900">₹{app.totalPrice?.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          Your cut: ₹{(app.totalPrice * 0.2).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
          </div>

          {/* Chair Quick Actions & Color Mixer */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-slate-200 bg-white shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" /> Active Client Color Formula
              </h3>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-900">Rhea Kapoor</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold border border-purple-200">
                    Dia Light
                  </span>
                </div>
                <div className="text-xs text-slate-800 font-mono bg-white p-2.5 rounded-lg border border-purple-100">
                  8.34 (30g) + 9.02 (15g) + Clear (10g)
                </div>
                <div className="text-[11px] text-slate-600">
                  Developer: <span className="text-slate-900 font-semibold">6 Vol (1.8%)</span> • Ratio: <span className="text-slate-900 font-semibold">1:1.5</span>
                </div>
                <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                  ⚠️ High porous ends. Keep under 20 mins.
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-slate-200 bg-white shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Station Protocols</h3>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Sanitize tools between clients
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Log color dispensary weight
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Record patch test for new formulas
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'formulas' && (
        <div className="glass-card p-6 border-slate-200 bg-white shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-brand-600" /> Saved Client Formulations & Dispensary Log
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myFormulas.map((f, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{f.clientName}</h4>
                  <span className="text-[10px] text-slate-500">{f.date}</span>
                </div>
                <div className="text-xs text-brand-600 font-semibold">{f.service}</div>
                <div className="text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                  {f.mix}
                </div>
                <div className="text-xs text-slate-600">
                  Brand: <span className="text-slate-900 font-medium">{f.brand}</span> | {f.developer}
                </div>
                <div className="text-[11px] text-slate-500 italic">"{f.notes}"</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="glass-card p-6 border-slate-200 bg-white shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" /> Monthly Commission & Payout Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Service Revenue Delivered</div>
              <div className="text-xl font-bold text-slate-900 mt-1">₹98,400</div>
              <div className="text-[10px] text-emerald-600 font-medium">Base Commission: ₹19,680 (20%)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Retail Products Upsold</div>
              <div className="text-xl font-bold text-slate-900 mt-1">₹14,500</div>
              <div className="text-[10px] text-emerald-600 font-medium">Retail Commission: ₹1,450 (10%)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Client Tips Collected</div>
              <div className="text-xl font-bold text-emerald-600 mt-1">₹3,200</div>
              <div className="text-[10px] text-slate-400">Direct 100% Payout</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
