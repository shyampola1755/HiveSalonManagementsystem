import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Invoice } from '../models/Invoice';
import { Customer } from '../models/Customer';
import { Branch } from '../models/Branch';
import { Appointment } from '../models/Appointment';
import { Product, StockLedgerEntry } from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// @desc    Get Invoices list
// @route   GET /api/v1/pos/invoices
export const getInvoices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { branchId, customerId, limit = 50 } = req.query;
  const query: any = { organizationId: req.organizationId };

  if (branchId) query.branchId = branchId;
  if (customerId) query.customerId = customerId;

  const invoices = await Invoice.find(query)
    .populate('branchId', 'name code')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.json({ success: true, count: invoices.length, data: invoices });
});

// @desc    Process POS Checkout & Generate Tax Invoice
// @route   POST /api/v1/pos/checkout
export const processCheckout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    customerId,
    appointmentId,
    branchId,
    items,
    discountType = 'FIXED',
    discountValue = 0,
    couponCode,
    tipAmount = 0,
    payments,
    notes,
  } = req.body;

  const targetBranchId = branchId || req.activeBranchId;
  const branch = await Branch.findById(targetBranchId);
  const customer = await Customer.findById(customerId);

  if (!customer) {
    res.status(400).json({ success: false, message: 'Customer is required for invoice' });
    return;
  }

  // Calculate items subtotal, taxes, totals
  let subtotal = 0;
  const processedItems = items.map((item: any) => {
    const total = item.quantity * item.unitPrice - (item.discountAmount || 0);
    const taxRate = item.taxRate !== undefined ? item.taxRate : 18;
    const tax = (total * taxRate) / 100;
    subtotal += total;
    return {
      itemType: item.itemType || 'SERVICE',
      itemId: item.itemId,
      name: item.name,
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice,
      discountAmount: item.discountAmount || 0,
      taxRate,
      taxAmount: tax,
      totalAmount: total,
      staffId: item.staffId,
      staffName: item.staffName,
      commissionAmount: item.commissionAmount || 0,
    };
  });

  // Calculate overall discount
  let discountAmount = 0;
  if (discountType === 'PERCENTAGE') {
    discountAmount = (subtotal * discountValue) / 100;
  } else {
    discountAmount = Number(discountValue) || 0;
  }
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // 18% GST (9% CGST + 9% SGST)
  const gstRate = branch?.taxConfig?.taxRate || 18;
  const totalTax = (taxableAmount * gstRate) / 100;
  const cgst = totalTax / 2;
  const sgst = totalTax / 2;
  const grandTotal = Math.round(taxableAmount + totalTax + Number(tipAmount));

  // Verify payments total
  const totalPaid = payments ? payments.reduce((acc: number, p: any) => acc + Number(p.amount), 0) : grandTotal;
  const balance = Math.max(0, grandTotal - totalPaid);

  // Generate unique invoice number
  const prefix = branch?.invoiceConfig?.prefix || 'INV';
  const timestamp = Date.now().toString().slice(-6);
  const invoiceNumber = `${prefix}-${branch?.code || 'MAIN'}-${timestamp}`;

  const invoice = await Invoice.create({
    organizationId: req.organizationId,
    branchId: targetBranchId,
    invoiceNumber,
    appointmentId,
    customerId: customer._id,
    customerName: customer.fullName,
    customerPhone: customer.phone,
    cashierUserId: req.user?._id,
    cashierName: req.user?.fullName || 'Cashier',
    items: processedItems,
    subtotal,
    discountType,
    discountValue,
    discountAmount,
    couponCode,
    taxAmount: totalTax,
    cgstAmount: cgst,
    sgstAmount: sgst,
    tipAmount,
    totalAmount: grandTotal,
    paidAmount: totalPaid,
    balanceAmount: balance,
    paymentStatus: balance === 0 ? 'PAID' : totalPaid > 0 ? 'PARTIAL' : 'UNPAID',
    payments: payments || [{ method: 'CASH', amount: grandTotal, paidAt: new Date() }],
    notes,
  });

  // Update customer CRM metrics
  customer.totalSpent = (customer.totalSpent || 0) + grandTotal;
  customer.totalVisits = (customer.totalVisits || 0) + 1;
  customer.lastVisitAt = new Date();
  // Award 1 loyalty point per 100 currency spent
  const earnedPoints = Math.floor(grandTotal / 100);
  customer.loyaltyPoints = (customer.loyaltyPoints || 0) + earnedPoints;
  await customer.save();

  // If appointment was attached, mark it completed
  if (appointmentId) {
    await Appointment.findByIdAndUpdate(appointmentId, {
      status: 'COMPLETED',
      invoiceId: invoice._id,
    });
  }

  // Deduct stock for product items sold
  for (const item of processedItems) {
    if (item.itemType === 'PRODUCT' && item.itemId) {
      await Product.updateOne(
        { _id: item.itemId, 'stockLevels.branchId': targetBranchId },
        { $inc: { 'stockLevels.$.quantity': -item.quantity } }
      );
      await StockLedgerEntry.create({
        organizationId: req.organizationId,
        branchId: targetBranchId,
        productId: item.itemId,
        movementType: 'SALE',
        quantityChange: -item.quantity,
        quantityAfter: 0,
        referenceId: invoiceNumber,
        performedByUserId: req.user?._id,
      });
    }
  }

  res.status(201).json({
    success: true,
    data: invoice,
    message: 'Invoice created and payment recorded successfully',
  });
});
