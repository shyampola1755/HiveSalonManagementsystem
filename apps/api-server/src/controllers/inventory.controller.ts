import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { Product, ProductCategory, Vendor, StockLedgerEntry, InventoryOrder } from '../models/Product';
import { Branch } from '../models/Branch';
import { AuthRequest } from '../middleware/auth';

// @desc    Get products list with stock levels
// @route   GET /api/v1/inventory/products
export const getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { categoryId, search, isRetail, isLowStock, branchId } = req.query;
  const query: any = { organizationId: req.organizationId, status: 'ACTIVE' };

  if (categoryId) query.categoryId = categoryId;
  if (isRetail === 'true') query.isRetailItem = true;
  if (search) {
    query.$or = [{ name: new RegExp(String(search), 'i') }, { sku: new RegExp(String(search), 'i') }];
  }

  const products = await Product.find(query)
    .populate('categoryId', 'name')
    .populate('vendorId', 'name phone')
    .sort({ name: 1 });

  const targetBranchId = branchId || req.activeBranchId;
  const data = products.map((p) => {
    const obj = p.toObject();
    const branchStock = targetBranchId
      ? obj.stockLevels.find((s) => s.branchId.toString() === targetBranchId.toString())
      : null;
    const currentQty = branchStock
      ? branchStock.quantity
      : obj.stockLevels.reduce((acc, s) => acc + s.quantity, 0);

    return {
      ...obj,
      currentQuantity: currentQty,
      isLowStock: currentQty <= obj.minStockThreshold,
    };
  });

  const filtered = isLowStock === 'true' ? data.filter((p) => p.isLowStock) : data;

  res.json({ success: true, count: filtered.length, data: filtered });
});

// @desc    Get product categories
// @route   GET /api/v1/inventory/categories
export const getProductCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const categories = await ProductCategory.find({ organizationId: req.organizationId }).sort({ name: 1 });
  res.json({ success: true, count: categories.length, data: categories });
});

// @desc    Create product
// @route   POST /api/v1/inventory/products
export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.create({
    ...req.body,
    organizationId: req.organizationId,
  });
  res.status(201).json({ success: true, data: product });
});

// @desc    Update product stock adjustment
// @route   POST /api/v1/inventory/adjust
export const adjustStock = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, branchId, quantityChange, movementType = 'ADJUSTMENT', notes } = req.body;
  const targetBranch = branchId || req.activeBranchId;

  const product = await Product.findOne({ _id: productId, organizationId: req.organizationId });
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const stockEntry = product.stockLevels.find((s) => s.branchId.toString() === targetBranch);
  if (stockEntry) {
    stockEntry.quantity += Number(quantityChange);
  } else {
    product.stockLevels.push({ branchId: targetBranch, quantity: Number(quantityChange) });
  }
  await product.save();

  await StockLedgerEntry.create({
    organizationId: req.organizationId,
    branchId: targetBranch,
    productId: product._id,
    movementType,
    quantityChange: Number(quantityChange),
    quantityAfter: stockEntry ? stockEntry.quantity : Number(quantityChange),
    notes,
    performedByUserId: req.user?._id,
  });

  res.json({ success: true, data: product, message: 'Stock updated successfully' });
});

// @desc    Get Inventory Order Requests
// @route   GET /api/v1/inventory/orders
export const getOrderRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { branchId, status } = req.query;
  const query: any = { organizationId: req.organizationId };

  if (branchId && branchId !== 'undefined' && branchId !== 'null' && mongoose.Types.ObjectId.isValid(String(branchId))) {
    query.branchId = branchId;
  }
  if (status) {
    query.status = status;
  }

  const orders = await InventoryOrder.find(query)
    .populate('branchId', 'name code')
    .populate('items.productId', 'name sku brand retailPrice costPrice')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Create Inventory Order Request (Branch Manager requests stock)
// @route   POST /api/v1/inventory/orders
export const createOrderRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { branchId, items, notes } = req.body;
  const targetBranchId = branchId || req.activeBranchId;

  if (!targetBranchId) {
    res.status(400).json({ success: false, message: 'Branch ID is required for stock request' });
    return;
  }

  const branch = await Branch.findById(targetBranchId);
  if (!branch) {
    res.status(404).json({ success: false, message: 'Branch not found' });
    return;
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ success: false, message: 'At least one product item is required' });
    return;
  }

  // Populate item details
  const populatedItems = [];
  for (const it of items) {
    const prod = await Product.findById(it.productId);
    if (prod) {
      populatedItems.push({
        productId: prod._id,
        productName: prod.name,
        sku: prod.sku,
        brand: prod.brand,
        requestedQuantity: Number(it.requestedQuantity) || 1,
        dispatchedQuantity: 0,
        receivedQuantity: 0,
      });
    }
  }

  const timestamp = Date.now().toString().slice(-6);
  const orderNumber = `ORD-${branch.code || 'BR'}-${timestamp}`;

  const order = await InventoryOrder.create({
    organizationId: req.organizationId,
    orderNumber,
    branchId: branch._id,
    branchName: branch.name,
    requestedByUserId: req.user?._id,
    requestedByUserName: req.user?.fullName || 'Branch Manager',
    items: populatedItems,
    status: 'PENDING',
    notes,
  });

  res.status(201).json({
    success: true,
    data: order,
    message: 'Inventory order request created successfully and sent to Super Admin',
  });
});

// @desc    Dispatch / Accept Inventory Order (Super Admin dispatches stock to branch)
// @route   PUT /api/v1/inventory/orders/:id/dispatch
export const dispatchOrderRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { dispatchNotes, items } = req.body;

  const order = await InventoryOrder.findOne({ _id: id, organizationId: req.organizationId });
  if (!order) {
    res.status(404).json({ success: false, message: 'Inventory order request not found' });
    return;
  }

  if (order.status !== 'PENDING') {
    res.status(400).json({ success: false, message: `Cannot dispatch order with status ${order.status}` });
    return;
  }

  // Update item dispatched quantities if specified
  if (items && Array.isArray(items)) {
    items.forEach((it: any) => {
      const match = order.items.find((orig) => orig.productId.toString() === it.productId.toString());
      if (match) {
        match.dispatchedQuantity = it.dispatchedQuantity !== undefined ? Number(it.dispatchedQuantity) : match.requestedQuantity;
      }
    });
  } else {
    // Default dispatched quantity equals requested quantity
    order.items.forEach((it) => {
      it.dispatchedQuantity = it.requestedQuantity;
    });
  }

  order.status = 'DISPATCHED';
  order.dispatchedAt = new Date();
  order.dispatchedByUserId = req.user?._id;
  order.dispatchedByUserName = req.user?.fullName || 'Super Admin';
  order.dispatchNotes = dispatchNotes;
  await order.save();

  res.json({
    success: true,
    data: order,
    message: 'Inventory order accepted & dispatched to branch successfully',
  });
});

// @desc    Receive & Accept Stock at Branch (Branch Manager receives shipment and updates stock in DB)
// @route   PUT /api/v1/inventory/orders/:id/receive
export const receiveOrderRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { receiveNotes, items } = req.body;

  const order = await InventoryOrder.findOne({ _id: id, organizationId: req.organizationId });
  if (!order) {
    res.status(404).json({ success: false, message: 'Inventory order request not found' });
    return;
  }

  if (order.status !== 'DISPATCHED') {
    res.status(400).json({ success: false, message: `Cannot receive order with status ${order.status}` });
    return;
  }

  // Update received quantities and increment MongoDB product stock levels
  for (const it of order.items) {
    const customReceive = items?.find((reqIt: any) => reqIt.productId.toString() === it.productId.toString());
    const qtyToReceive = customReceive && customReceive.receivedQuantity !== undefined
      ? Number(customReceive.receivedQuantity)
      : it.dispatchedQuantity || it.requestedQuantity;

    it.receivedQuantity = qtyToReceive;

    // Atomically increment branch stock level in Product collection
    const product = await Product.findOne({ _id: it.productId, organizationId: req.organizationId });
    if (product) {
      const branchStock = product.stockLevels.find((s) => s.branchId.toString() === order.branchId.toString());
      if (branchStock) {
        branchStock.quantity += qtyToReceive;
      } else {
        product.stockLevels.push({ branchId: order.branchId, quantity: qtyToReceive });
      }
      await product.save();

      // Create Stock Ledger Entry for audit
      await StockLedgerEntry.create({
        organizationId: req.organizationId,
        branchId: order.branchId,
        productId: product._id,
        movementType: 'TRANSFER_IN',
        quantityChange: qtyToReceive,
        quantityAfter: branchStock ? branchStock.quantity : qtyToReceive,
        referenceId: order.orderNumber,
        notes: `Received from central inventory order: ${order.orderNumber}`,
        performedByUserId: req.user?._id,
      });
    }
  }

  order.status = 'RECEIVED';
  order.receivedAt = new Date();
  order.receivedByUserId = req.user?._id;
  order.receivedByUserName = req.user?.fullName || 'Branch Manager';
  order.receiveNotes = receiveNotes;
  await order.save();

  res.json({
    success: true,
    data: order,
    message: 'Inventory order received successfully! Branch stock updated in database and POS.',
  });
});

// @desc    Reject Inventory Order Request
// @route   PUT /api/v1/inventory/orders/:id/reject
export const rejectOrderRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { adminNotes } = req.body;

  const order = await InventoryOrder.findOne({ _id: id, organizationId: req.organizationId });
  if (!order) {
    res.status(404).json({ success: false, message: 'Inventory order request not found' });
    return;
  }

  order.status = 'REJECTED';
  order.dispatchNotes = adminNotes || 'Order request rejected by Super Admin';
  order.dispatchedAt = new Date();
  order.dispatchedByUserId = req.user?._id;
  order.dispatchedByUserName = req.user?.fullName || 'Super Admin';
  await order.save();

  res.json({
    success: true,
    data: order,
    message: 'Inventory order request rejected',
  });
});

