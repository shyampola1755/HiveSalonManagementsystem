import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { MembershipTier, CustomerMembership, CustomerPackage, LoyaltyPointsLedger } from '../models/Membership';
import { Customer } from '../models/Customer';
import { AuthRequest } from '../middleware/auth';

// @desc    Get membership tiers
// @route   GET /api/v1/memberships/tiers
export const getMembershipTiers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tiers = await MembershipTier.find({ organizationId: req.organizationId, isActive: true });
  res.json({ success: true, count: tiers.length, data: tiers });
});

// @desc    Sell membership to customer
// @route   POST /api/v1/memberships/subscribe
export const subscribeMembership = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { customerId, tierId } = req.body;
  const tier = await MembershipTier.findById(tierId);
  const customer = await Customer.findById(customerId);

  if (!tier || !customer) {
    res.status(400).json({ success: false, message: 'Invalid customer or tier ID' });
    return;
  }

  const startDate = new Date();
  const expiryDate = new Date(startDate.getTime() + tier.validityDays * 24 * 60 * 60 * 1000);

  const membership = await CustomerMembership.create({
    organizationId: req.organizationId,
    customerId: customer._id,
    tierId: tier._id,
    tierName: tier.name,
    startDate,
    expiryDate,
    pricePaid: tier.price,
    status: 'ACTIVE',
  });

  res.status(201).json({ success: true, data: membership });
});

// @desc    Get customer packages
// @route   GET /api/v1/memberships/packages
export const getCustomerPackages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { customerId } = req.query;
  const query: any = { organizationId: req.organizationId };
  if (customerId) query.customerId = customerId;

  const packages = await CustomerPackage.find(query).populate('customerId', 'fullName phone').sort({ createdAt: -1 });
  res.json({ success: true, count: packages.length, data: packages });
});

// @desc    Redeem a session from package
// @route   POST /api/v1/memberships/packages/:id/redeem
export const redeemPackageSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const pkg = await CustomerPackage.findOne({ _id: req.params.id, organizationId: req.organizationId });
  if (!pkg || pkg.status !== 'ACTIVE' || pkg.remainingSessions <= 0) {
    res.status(400).json({ success: false, message: 'Package is expired or has no remaining sessions' });
    return;
  }

  pkg.usedSessions += 1;
  pkg.remainingSessions -= 1;
  if (pkg.remainingSessions === 0) {
    pkg.status = 'COMPLETED';
  }
  await pkg.save();

  res.json({ success: true, data: pkg, message: 'Session redeemed successfully' });
});
