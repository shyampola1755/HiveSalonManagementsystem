import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DollarSign, Plus, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';

export const FinanceView: React.FC = () => {
  const { activeBranchId } = useAuth();
  const { showToast } = useToast();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'UTILITIES',
    amount: 1500,
    paidVia: 'BANK_TRANSFER',
    notes: '',
  });

  const fetchExpenses = async () => {
    try {
      const res = await apiClient.get('/finance/expenses');
      if (res.data.success) {
        setExpenses(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [activeBranchId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/finance/expenses', {
        ...formData,
        expenseDate: new Date(),
      });
      if (res.data.success) {
        showToast('Expense logged successfully!', 'success');
        setShowModal(false);
        fetchExpenses();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to record expense', 'error');
    }
  };

  const totalExpenseAmount = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Expenses, Cash Flow & Financial Ledger</h2>
            <p className="text-xs text-slate-500">Salon operating costs, vendor payments, rent, and utility deductions</p>
          </div>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-gold text-xs font-bold px-4 py-2 shadow-sm">
          <Plus className="w-4 h-4" /> Record Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 border-slate-200 bg-white shadow-sm">
          <div className="text-xs font-semibold text-slate-500">TOTAL RECORDED EXPENSES</div>
          <div className="text-2xl font-black text-rose-600 mt-1">₹{totalExpenseAmount.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{expenses.length} expense entries</div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Expense Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Amount (INR)</th>
                <th className="p-4">Payment Channel</th>
                <th className="p-4">Date Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 text-sm">{exp.title}</td>
                  <td className="p-4">
                    <span className="badge-gold text-[10px]">{exp.category}</span>
                  </td>
                  <td className="p-4 font-bold text-rose-600 font-mono text-sm">-₹{exp.amount?.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-slate-600">{exp.paidVia}</td>
                  <td className="p-4 text-slate-500">{new Date(exp.expenseDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Record Operating Expense</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Salon Cleanliness & Laundry Supplies"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field bg-white"
                  >
                    <option value="UTILITIES">Utilities</option>
                    <option value="RENT">Rent & Lease</option>
                    <option value="SALARY">Payroll & Stipends</option>
                    <option value="SUPPLIES">Supplies & Laundry</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Mode</label>
                <select
                  value={formData.paidVia}
                  onChange={(e) => setFormData({ ...formData, paidVia: e.target.value })}
                  className="input-field bg-white"
                >
                  <option value="BANK_TRANSFER">Bank IMPS / NEFT</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="CASH">Cash Petty</option>
                  <option value="CREDIT_CARD">Company Card</option>
                </select>
              </div>

              <button type="submit" className="btn-gold w-full py-2.5 font-bold text-xs mt-2 shadow-md">
                Save & Log Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
