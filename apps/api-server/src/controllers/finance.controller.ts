import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Expense, CommissionPlan, MarketingCampaign } from '../models/Finance';
import { Invoice } from '../models/Invoice';
import { AuthRequest } from '../middleware/auth';

// @desc    Get expenses
// @route   GET /api/v1/finance/expenses
export const getExpenses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { branchId, category } = req.query;
  const query: any = { organizationId: req.organizationId };
  if (branchId) query.branchId = branchId;
  if (category) query.category = category;

  const expenses = await Expense.find(query).populate('branchId', 'name code').sort({ expenseDate: -1 });
  res.json({ success: true, count: expenses.length, data: expenses });
});

// @desc    Log new expense
// @route   POST /api/v1/finance/expenses
export const createExpense = asyncHandler(async (req: AuthRequest, res: Response) => {
  const expense = await Expense.create({
    ...req.body,
    organizationId: req.organizationId,
    branchId: req.body.branchId || req.activeBranchId,
    recordedByUserId: req.user?._id,
  });
  res.status(201).json({ success: true, data: expense });
});

// @desc    Get marketing campaigns
// @route   GET /api/v1/finance/campaigns
export const getCampaigns = asyncHandler(async (req: AuthRequest, res: Response) => {
  const campaigns = await MarketingCampaign.find({ organizationId: req.organizationId }).sort({ createdAt: -1 });
  res.json({ success: true, count: campaigns.length, data: campaigns });
});

// @desc    Create marketing campaign
// @route   POST /api/v1/finance/campaigns
export const createCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const campaign = await MarketingCampaign.create({
    ...req.body,
    organizationId: req.organizationId,
  });
  res.status(201).json({ success: true, data: campaign });
});
