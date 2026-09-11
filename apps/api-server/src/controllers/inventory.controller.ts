import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Product, ProductCategory, Vendor, StockLedgerEntry } from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// @desc    Get products list with stock levels
// @route   GET /api/v1/inventory/products
export const getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { categoryId, search, isRetail, isLowStock } = req.query;
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

  const branchId = req.activeBranchId;
  const data = products.map((p) => {
    const obj = p.toObject();
    const branchStock = branchId
      ? obj.stockLevels.find((s) => s.branchId.toString() === branchId)
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
