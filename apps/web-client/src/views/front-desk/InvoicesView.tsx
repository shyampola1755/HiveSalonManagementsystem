import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Receipt, Search, Printer, Eye, X, CheckCircle2 } from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const { activeBranchId } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await apiClient.get('/pos/invoices');
        const getArray = (r: any) => {
          if (!r) return [];
          if (Array.isArray(r.data?.data)) return r.data.data;
          if (Array.isArray(r.data)) return r.data;
          if (Array.isArray(r.data?.data?.data)) return r.data.data.data;
          return [];
        };
        setInvoices(getArray(res));
      } catch (e) {
        console.error(e);
      }
    };
    fetchInvoices();
  }, [activeBranchId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-brand-400 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">POS Invoices & Tax Receipts</h2>
            <p className="text-xs text-slate-400">Complete transaction history, billing audit, and GST invoice records</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-300">{inv.invoiceNumber}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{inv.customerName}</div>
                    <div className="text-[11px] text-slate-400">{inv.customerPhone}</div>
                  </td>
                  <td className="p-4">
                    <div className="line-clamp-1">{inv.items?.map((i: any) => i.name).join(', ')}</div>
                    <div className="text-[10px] text-slate-500">{inv.items?.length} items</div>
                  </td>
                  <td className="p-4 font-bold text-white text-sm">₹{inv.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className="badge-emerald text-[10px]">{inv.payments?.[0]?.method || 'PAID'}</span>
                  </td>
                  <td className="p-4 text-slate-400">{new Date(inv.createdAt).toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="btn-secondary py-1.5 px-3 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View/Print Invoice Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-brand-400" /> Tax Receipt #{selectedInvoice.invoiceNumber}
              </h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3 font-mono">
              <div className="text-center border-b border-slate-800 pb-2">
                <div className="font-extrabold text-sm text-white">HIVE LUXURY SALON</div>
                <div className="text-[10px] text-slate-400">GSTIN: 36AABCH1234F1Z5</div>
              </div>

              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Client:</span>
                <span className="text-white font-bold">{selectedInvoice.customerName}</span>
              </div>

              <div className="divide-y divide-slate-800/60 py-2 border-y border-slate-800">
                {selectedInvoice.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-1 text-[11px]">
                    <span className="text-slate-300">{item.name} x{item.quantity}</span>
                    <span className="text-white font-bold">₹{item.totalAmount}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>₹{selectedInvoice.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (18%):</span>
                  <span>₹{selectedInvoice.taxAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-brand-400 text-sm pt-1 border-t border-slate-800">
                  <span>Grand Total:</span>
                  <span>₹{selectedInvoice.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={() => window.print()} className="btn-gold w-full text-xs font-bold py-2.5">
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
