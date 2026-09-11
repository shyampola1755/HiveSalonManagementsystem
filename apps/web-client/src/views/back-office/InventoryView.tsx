import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ShoppingBag,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  ArrowUpDown,
  X,
  Truck,
  PackageCheck,
  Clock,
  Send,
  XCircle,
  Building2,
  FileText,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { user, activeBranchId } = useAuth();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'ORDERS'>('CATALOG');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [branches, setBranches] = useState<any[]>([]);

  // Stock Adjust Modal State
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustQty, setAdjustQty] = useState<number>(5);

  // New Order Request Modal State
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderBranchId, setOrderBranchId] = useState<string>(activeBranchId || '');
  const [orderItems, setOrderItems] = useState<{ productId: string; requestedQuantity: number }[]>([
    { productId: '', requestedQuantity: 5 },
  ]);
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Dispatch Action Modal State
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dispatchNotes, setDispatchNotes] = useState('');

  // Receive Action Modal State
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [receiveNotes, setReceiveNotes] = useState('');

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

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

  const fetchOrders = async () => {
    try {
      const branchQuery = !isSuperAdmin && activeBranchId ? `?branchId=${activeBranchId}` : '';
      const res = await apiClient.get(`/inventory/orders${branchQuery}`);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await apiClient.get('/branches');
      if (res.data.success) {
        setBranches(res.data.data);
        if (!orderBranchId && res.data.data.length > 0) {
          setOrderBranchId(activeBranchId || res.data.data[0]._id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchBranches();
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

  // Create Inventory Order Request
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = orderItems.filter((it) => it.productId && it.requestedQuantity > 0);
    if (validItems.length === 0) {
      showToast('Please select at least one product with quantity > 0', 'error');
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const res = await apiClient.post('/inventory/orders', {
        branchId: orderBranchId || activeBranchId,
        items: validItems,
        notes: orderNotes,
      });
      if (res.data.success) {
        showToast('Inventory order request sent to Super Admin!', 'success');
        setShowOrderModal(false);
        setOrderItems([{ productId: '', requestedQuantity: 5 }]);
        setOrderNotes('');
        fetchOrders();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit order request', 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Super Admin: Dispatch Order
  const handleDispatchOrder = async () => {
    if (!selectedOrder) return;
    try {
      const res = await apiClient.put(`/inventory/orders/${selectedOrder._id}/dispatch`, {
        dispatchNotes,
      });
      if (res.data.success) {
        showToast('Inventory order dispatched to branch successfully!', 'success');
        setShowDispatchModal(false);
        setSelectedOrder(null);
        setDispatchNotes('');
        fetchOrders();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Dispatch failed', 'error');
    }
  };

  // Branch Manager: Receive & Update Stock
  const handleReceiveOrder = async () => {
    if (!selectedOrder) return;
    try {
      const res = await apiClient.put(`/inventory/orders/${selectedOrder._id}/receive`, {
        receiveNotes,
      });
      if (res.data.success) {
        showToast('Shipment received! Branch stock updated in database & POS.', 'success');
        setShowReceiveModal(false);
        setSelectedOrder(null);
        setReceiveNotes('');
        fetchOrders();
        fetchProducts(); // Refresh live stock
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Receive failed', 'error');
    }
  };

  // Super Admin: Reject Order
  const handleRejectOrder = async (orderId: string) => {
    const reason = window.prompt('Enter reason for rejecting this order:');
    if (reason === null) return;
    try {
      const res = await apiClient.put(`/inventory/orders/${orderId}/reject`, {
        adminNotes: reason || 'Rejected by Admin',
      });
      if (res.data.success) {
        showToast('Order request rejected', 'info');
        fetchOrders();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Reject failed', 'error');
    }
  };

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Centralized Inventory & Stock Requests</h2>
            <p className="text-xs text-slate-400">
              Multi-branch supply chain, order requests, dispatch approvals & live POS stock
            </p>
          </div>
        </div>

        {/* Tab Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => setActiveTab('CATALOG')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'CATALOG' ? 'bg-brand-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Stock Catalog
            </button>
            <button
              onClick={() => setActiveTab('ORDERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'ORDERS' ? 'bg-brand-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Order Requests
              {orders.filter((o) => o.status === 'PENDING' || o.status === 'DISPATCHED').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          </div>

          <button
            onClick={() => setShowOrderModal(true)}
            className="btn-gold py-2 px-3 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Request Inventory
          </button>
        </div>
      </div>

      {/* TAB 1: STOCK CATALOG VIEW */}
      {activeTab === 'CATALOG' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search SKU or product name..."
                className="input-field pl-9 text-xs py-1.5"
              />
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Showing {filteredProducts.length} live inventory items
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Product & Brand</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Cost Price</th>
                    <th className="p-4">Retail Price</th>
                    <th className="p-4">Branch Stock (POS Live)</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.map((p) => (
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
                          <span
                            className={`font-extrabold text-sm ${
                              p.isLowStock ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
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
        </div>
      )}

      {/* TAB 2: INVENTORY ORDER REQUESTS & SHIPMENT FLOW */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Branch Order Requests & Stock Shipments</h3>
              </div>
              <span className="text-xs text-slate-400">
                {orders.length} total requests logged
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <PackageCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">No inventory requests found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Branch managers can click "+ Request Inventory" to order stock from central management.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Branch</th>
                      <th className="p-4">Requested By</th>
                      <th className="p-4">Items & Quantities</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Timestamps & Notes</th>
                      <th className="p-4 text-right">Workflow Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-brand-300">
                          {ord.orderNumber}
                        </td>
                        <td className="p-4 font-semibold text-white">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {ord.branchName || ord.branchId?.name || 'Branch'}
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">
                          {ord.requestedByUserName}
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {ord.items.map((it: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between gap-3 text-[11px]">
                                <span className="text-white font-medium">{it.productName}</span>
                                <span className="font-mono font-bold text-brand-400">
                                  {ord.status === 'RECEIVED'
                                    ? `Recv: ${it.receivedQuantity || it.requestedQuantity} units`
                                    : ord.status === 'DISPATCHED'
                                    ? `Sent: ${it.dispatchedQuantity || it.requestedQuantity} units`
                                    : `Req: ${it.requestedQuantity} units`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          {ord.status === 'PENDING' && (
                            <span className="badge-amber inline-flex items-center gap-1 text-[10px]">
                              <Clock className="w-3 h-3" /> Pending Approval
                            </span>
                          )}
                          {ord.status === 'DISPATCHED' && (
                            <span className="badge-sky inline-flex items-center gap-1 text-[10px]">
                              <Truck className="w-3 h-3 animate-pulse" /> Dispatched (In Transit)
                            </span>
                          )}
                          {ord.status === 'RECEIVED' && (
                            <span className="badge-emerald inline-flex items-center gap-1 text-[10px]">
                              <CheckCircle2 className="w-3 h-3" /> Stock Received & Updated
                            </span>
                          )}
                          {ord.status === 'REJECTED' && (
                            <span className="badge-rose inline-flex items-center gap-1 text-[10px]">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-[11px] text-slate-400">
                          <div>Created: {new Date(ord.createdAt).toLocaleDateString()}</div>
                          {ord.notes && <div className="text-slate-300 mt-0.5">Note: "{ord.notes}"</div>}
                          {ord.dispatchNotes && (
                            <div className="text-brand-300 mt-0.5">Dispatch: "{ord.dispatchNotes}"</div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {/* Super Admin Action: Accept & Dispatch */}
                          {isSuperAdmin && ord.status === 'PENDING' && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setShowDispatchModal(true);
                                }}
                                className="btn-gold py-1.5 px-3 text-xs font-bold flex items-center gap-1"
                              >
                                <Send className="w-3.5 h-3.5" /> Accept & Dispatch
                              </button>
                              <button
                                onClick={() => handleRejectOrder(ord._id)}
                                className="btn-secondary py-1.5 px-2 text-xs text-rose-400 hover:bg-rose-500/10"
                                title="Reject Request"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Branch Manager Action: Receive Shipment & Update Stock in MongoDB */}
                          {ord.status === 'DISPATCHED' && (
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setShowReceiveModal(true);
                              }}
                              className="btn-gold py-1.5 px-3 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                            >
                              <PackageCheck className="w-3.5 h-3.5" /> Receive & Update Stock
                            </button>
                          )}

                          {ord.status === 'RECEIVED' && (
                            <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Updated in POS
                            </span>
                          )}

                          {!isSuperAdmin && ord.status === 'PENDING' && (
                            <span className="text-[11px] text-amber-400 font-medium">
                              Awaiting Super Admin
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: NEW INVENTORY ORDER REQUEST MODAL */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Create Inventory Order Request</h3>
              </div>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Receiving Branch</label>
                <select
                  value={orderBranchId}
                  onChange={(e) => setOrderBranchId(e.target.value)}
                  className="input-field"
                  disabled={!isSuperAdmin && !!activeBranchId}
                >
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-slate-300 font-semibold">Select Products & Quantities</label>
                  <button
                    type="button"
                    onClick={() => setOrderItems([...orderItems, { productId: '', requestedQuantity: 5 }])}
                    className="text-brand-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3 h-3" /> Add Product
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const updated = [...orderItems];
                          updated[idx].productId = e.target.value;
                          setOrderItems(updated);
                        }}
                        className="input-field flex-1 text-xs"
                        required
                      >
                        <option value="">-- Select Product --</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} ({p.brand}) - Current Stock: {p.currentQuantity}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={item.requestedQuantity}
                        onChange={(e) => {
                          const updated = [...orderItems];
                          updated[idx].requestedQuantity = Number(e.target.value);
                          setOrderItems(updated);
                        }}
                        className="input-field w-20 text-center font-bold text-xs"
                        placeholder="Qty"
                        required
                      />

                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setOrderItems(orderItems.filter((_, i) => i !== idx))}
                          className="p-2 text-rose-400 hover:text-rose-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Request Notes</label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Urgent stock replenishment for weekend appointments"
                  className="input-field resize-none h-16"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="btn-gold w-full py-2.5 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Submit Order Request to Super Admin
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SUPER ADMIN DISPATCH MODAL */}
      {showDispatchModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Accept & Dispatch Inventory</h3>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Number:</span>
                <span className="font-mono font-bold text-brand-300">{selectedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination Branch:</span>
                <span className="font-bold text-white">{selectedOrder.branchName}</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <div className="text-slate-400 mb-1 font-semibold">Items to Dispatch:</div>
                {selectedOrder.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span>{it.productName}</span>
                    <span className="font-bold text-white">{it.requestedQuantity} units</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dispatch / Courier Notes</label>
                <input
                  type="text"
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="e.g. Sent via internal courier / Warehouse batch #42"
                  className="input-field"
                />
              </div>

              <button
                onClick={handleDispatchOrder}
                className="btn-gold w-full py-2.5 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Truck className="w-4 h-4" /> Confirm Dispatch & Send Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BRANCH MANAGER RECEIVE SHIPMENT MODAL */}
      {showReceiveModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <PackageCheck className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Receive Shipment & Update Stock</h3>
              </div>
              <button onClick={() => setShowReceiveModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Number:</span>
                <span className="font-mono font-bold text-brand-300">{selectedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dispatched By:</span>
                <span className="font-bold text-white">{selectedOrder.dispatchedByUserName || 'Super Admin'}</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <div className="text-slate-400 mb-1 font-semibold">Incoming Stock to be Added:</div>
                {selectedOrder.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-slate-300 py-0.5">
                    <span>{it.productName}</span>
                    <span className="font-bold text-emerald-400">+{it.dispatchedQuantity || it.requestedQuantity} units</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Receipt Notes / Verification</label>
                <input
                  type="text"
                  value={receiveNotes}
                  onChange={(e) => setReceiveNotes(e.target.value)}
                  placeholder="e.g. All items verified in intact condition"
                  className="input-field"
                />
              </div>

              <button
                onClick={handleReceiveOrder}
                className="btn-gold w-full py-2.5 font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Receipt & Increment Branch Stock in DB
              </button>
            </div>
          </div>
        </div>
      )}

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
