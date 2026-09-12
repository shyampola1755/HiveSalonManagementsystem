import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { Invoice } from '../models/Invoice';
import { Appointment } from '../models/Appointment';
import { Customer } from '../models/Customer';
import { Branch } from '../models/Branch';
import { StaffProfile } from '../models/Staff';
import { Product } from '../models/Product';
import { Expense } from '../models/Finance';
import { AuthRequest } from '../middleware/auth';

// @desc    Get complete executive & operational dashboard analytics
// @route   GET /api/v1/reports/dashboard
export const getDashboardMetrics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const targetBranch = req.query.branchId || req.headers['x-branch-id'] || req.activeBranchId;
  const branchFilter: any = { organizationId: req.organizationId };

  if (targetBranch && targetBranch !== 'undefined' && targetBranch !== 'null' && targetBranch !== 'ALL') {
    let branchDoc = null;
    if (mongoose.Types.ObjectId.isValid(String(targetBranch))) {
      branchDoc = await Branch.findById(targetBranch);
    }
    if (!branchDoc) {
      branchDoc = await Branch.findOne({
        organizationId: req.organizationId,
        $or: [
          { code: new RegExp(`^${targetBranch}$`, 'i') },
          { name: new RegExp(String(targetBranch).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
        ],
      });
    }

    if (branchDoc) {
      branchFilter.branchId = branchDoc._id;
    } else if (mongoose.Types.ObjectId.isValid(String(targetBranch))) {
      branchFilter.branchId = targetBranch;
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    todayInvoices,
    totalInvoices,
    todayAppointments,
    activeCustomersCount,
    totalBranches,
    staffCount,
    lowStockCount,
    todayExpenses,
  ] = await Promise.all([
    Invoice.find({
      ...branchFilter,
      createdAt: { $gte: today },
      paymentStatus: { $ne: 'VOID' },
    }),
    Invoice.find({
      ...branchFilter,
      paymentStatus: { $ne: 'VOID' },
    }),
    Appointment.find({
      ...branchFilter,
      appointmentDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    }),
    Customer.countDocuments({ organizationId: req.organizationId, deletedAt: null }),
    Branch.countDocuments({ organizationId: req.organizationId, isActive: true }),
    StaffProfile.countDocuments({ organizationId: req.organizationId, status: 'ACTIVE' }),
    Product.countDocuments({ organizationId: req.organizationId, status: 'ACTIVE' }),
    Expense.find({
      ...branchFilter,
      expenseDate: { $gte: today },
    }),
  ]);

  const todayRevenue = todayInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalRevenue = totalInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const todayExpenseTotal = todayExpenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);

  // Status breakdown of today's appointments
  const appointmentBreakdown = {
    total: todayAppointments.length,
    scheduled: todayAppointments.filter((a) => a.status === 'SCHEDULED').length,
    inService: todayAppointments.filter((a) => a.status === 'IN_SERVICE').length,
    completed: todayAppointments.filter((a) => a.status === 'COMPLETED').length,
    checkedIn: todayAppointments.filter((a) => a.status === 'CHECKED_IN').length,
  };

  // Recent 7 days revenue trend
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyInvoices = await Invoice.find({
    ...branchFilter,
    createdAt: { $gte: sevenDaysAgo },
    paymentStatus: { $ne: 'VOID' },
  });

  const dailyRevenueMap: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateKey = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    dailyRevenueMap[dateKey] = 0;
  }

  weeklyInvoices.forEach((inv) => {
    const dateKey = new Date(inv.createdAt).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    if (dailyRevenueMap[dateKey] !== undefined) {
      dailyRevenueMap[dateKey] += inv.totalAmount || 0;
    }
  });

  const revenueTrend = Object.entries(dailyRevenueMap).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  res.json({
    success: true,
    data: {
      metrics: {
        todayRevenue,
        totalRevenue,
        todayExpenseTotal,
        netToday: todayRevenue - todayExpenseTotal,
        todayAppointmentsCount: todayAppointments.length,
        totalCustomers: activeCustomersCount,
        activeBranches: totalBranches,
        totalStaff: staffCount,
        inventoryCount: lowStockCount,
      },
      appointmentBreakdown,
      revenueTrend,
    },
  });
});
