import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, AlertTriangle, Plus, Search, CheckCircle2, ArrowUpDown, X } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { activeBranchId } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustQty, setAdjustQty] = useState<number>(5);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/inventory/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeBranchId]);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const res = await apiClient.post('/inventory/adjust', {
        productId: selectedProduct._id,
        quantityChange: adjustQty,
        movementType: adjustQty > 0 ? 'PURCHASE' : 'DAMAGE',
        notes: 'Manual inventory adjustment via Back-Office',
      });
      if (res.data.success) {
        showToast('Stock count adjusted successfully!', 'success');
        setShowAdjustModal(false);
        fetchProducts();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Stock adjustment failed', 'error');
    }
  };

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Centralized Inventory & Stock Ledger</h2>
            <p className="text-xs text-slate-400">Professional back-bar chemical supplies & retail merchandise inventory</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU or product..."
            className="input-field pl-9 text-xs py-1.5"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">SKU / Barcode</th>
                <th className="p-4">Product Name & Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Cost Price</th>
                <th className="p-4">Retail Price</th>
                <th className="p-4">Current Branch Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-300">{p.sku}</td>
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{p.brand}</div>
                  </td>
                  <td className="p-4">
                    <span className="badge-sky text-[10px]">{p.categoryId?.name || 'Care'}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">₹{p.costPrice}</td>
                  <td className="p-4 font-bold text-white">₹{p.retailPrice}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-extrabold text-sm ${p.isLowStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {p.currentQuantity} units
                      </span>
                      {p.isLowStock && (
                        <span className="badge-rose text-[10px]">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setShowAdjustModal(true);
                      }}
                      className="btn-secondary py-1.5 px-3 text-xs font-semibold"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" /> Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Adjust Stock Count</h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4 text-xs">
              <div className="font-bold text-white">{selectedProduct?.name}</div>
              <div className="text-slate-400 mt-0.5">Current Stock: {selectedProduct?.currentQuantity} units</div>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Quantity Change (+ to add, - to subtract)</label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  placeholder="e.g. 10 or -2"
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn-gold w-full py-2.5 font-bold text-xs">
                Save Stock Adjustment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
