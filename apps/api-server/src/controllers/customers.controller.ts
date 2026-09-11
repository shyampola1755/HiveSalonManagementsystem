import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  Customer,
  CustomerNote,
  CustomerColorFormula,
  CustomerPatchTest,
  CustomerWalletTransaction,
} from '../models/Customer';
import { CustomerPackage, CustomerMembership } from '../models/Membership';
import { Appointment } from '../models/Appointment';
import { Invoice } from '../models/Invoice';
import { AuthRequest } from '../middleware/auth';

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Search and list customers
// @route   GET /api/v1/customers
export const getCustomers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search, limit = 50, page = 1 } = req.query;
  const query: any = { organizationId: req.organizationId, deletedAt: null };

  if (search) {
    const escaped = escapeRegex(String(search).trim());
    const searchRegex = new RegExp(escaped, 'i');
    query.$or = [{ fullName: searchRegex }, { phone: searchRegex }, { email: searchRegex }];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [customers, total] = await Promise.all([
    Customer.find(query).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
    Customer.countDocuments(query),
  ]);

  res.json({
    success: true,
    total,
    page: Number(page),
    data: customers,
  });
});

// @desc    Get 360° Customer Profile (includes notes, formulas, patch tests, wallet, packages, appointments, invoices)
// @route   GET /api/v1/customers/:id
export const getCustomerById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const customer = await Customer.findOne({ _id: req.params.id, organizationId: req.organizationId });
  if (!customer) {
    res.status(404).json({ success: false, message: 'Customer not found' });
    return;
  }

  const [notes, colorFormulas, patchTests, walletHistory, packages, memberships, appointments, invoices] =
    await Promise.all([
      CustomerNote.find({ customerId: customer._id }).sort({ createdAt: -1 }),
      CustomerColorFormula.find({ customerId: customer._id }).sort({ appliedAt: -1 }),
      CustomerPatchTest.find({ customerId: customer._id }).sort({ testedAt: -1 }),
      CustomerWalletTransaction.find({ customerId: customer._id }).sort({ createdAt: -1 }).limit(20),
      CustomerPackage.find({ customerId: customer._id, status: 'ACTIVE' }),
      CustomerMembership.find({ customerId: customer._id, status: 'ACTIVE' }),
      Appointment.find({ customerId: customer._id }).sort({ appointmentDate: -1 }).limit(10),
      Invoice.find({ customerId: customer._id }).sort({ createdAt: -1 }).limit(10),
    ]);

  res.json({
    success: true,
    data: {
      ...customer.toObject(),
      notes,
      colorFormulas,
      patchTests,
      walletHistory,
      packages,
      memberships,
      appointments,
      invoices,
    },
  });
});

// @desc    Create new customer
// @route   POST /api/v1/customers
export const createCustomer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const customer = await Customer.create({
    ...req.body,
    organizationId: req.organizationId,
  });
  res.status(201).json({ success: true, data: customer });
});

// @desc    Update customer
// @route   PUT /api/v1/customers/:id
export const updateCustomer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.organizationId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!customer) {
    res.status(404).json({ success: false, message: 'Customer not found' });
    return;
  }

  res.json({ success: true, data: customer });
});

// @desc    Top-up or adjust customer wallet
// @route   POST /api/v1/customers/:id/wallet
export const adjustWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { amount, type, reason } = req.body;
  const customer = await Customer.findOne({ _id: req.params.id, organizationId: req.organizationId });

  if (!customer) {
    res.status(404).json({ success: false, message: 'Customer not found' });
    return;
  }

  const delta = type === 'DEBIT' ? -Math.abs(amount) : Math.abs(amount);
  customer.walletBalance = (customer.walletBalance || 0) + delta;
  await customer.save();

  const transaction = await CustomerWalletTransaction.create({
    customerId: customer._id,
    amount: Math.abs(amount),
    type,
    reason: reason || 'Manual wallet adjustment',
    balanceAfter: customer.walletBalance,
  });

  res.json({
    success: true,
    data: {
      walletBalance: customer.walletBalance,
      transaction,
    },
  });
});

// @desc    Add technical note
// @route   POST /api/v1/customers/:id/notes
export const addCustomerNote = asyncHandler(async (req: AuthRequest, res: Response) => {
  const note = await CustomerNote.create({
    customerId: req.params.id,
    note: req.body.note,
    category: req.body.category || 'GENERAL',
    authorUserId: req.user?._id,
    authorName: req.user?.fullName,
  });
  res.status(201).json({ success: true, data: note });
});

// @desc    Add hair color formula
// @route   POST /api/v1/customers/:id/formulas
export const addColorFormula = asyncHandler(async (req: AuthRequest, res: Response) => {
  const formula = await CustomerColorFormula.create({
    ...req.body,
    customerId: req.params.id,
    technicianUserId: req.user?._id,
  });
  res.status(201).json({ success: true, data: formula });
});

// @desc    Add patch test record
// @route   POST /api/v1/customers/:id/patch-tests
export const addPatchTest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const patchTest = await CustomerPatchTest.create({
    ...req.body,
    customerId: req.params.id,
    technicianUserId: req.user?._id,
  });
  res.status(201).json({ success: true, data: patchTest });
});
