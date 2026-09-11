import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { Branch } from '../models/Branch';
import { ENV } from '../config/env';
import { AuthRequest } from '../middleware/auth';

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Please provide email and password.' });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  const organization = await Organization.findById(user.organizationId);
  const branches = await Branch.find({ organizationId: user.organizationId, isActive: true });

  const token = jwt.sign(
    {
      userId: user._id,
      organizationId: user.organizationId,
      role: user.role,
    },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      primaryBranchId: user.primaryBranchId || (branches.length > 0 ? branches[0]._id : null),
      organization: organization
        ? {
            id: organization._id,
            name: organization.name,
            code: organization.code,
            currency: organization.currency,
          }
        : null,
      branches: branches.map((b) => ({
        id: b._id,
        name: b.name,
        code: b.code,
        cityId: b.cityId,
        isMainBranch: b.isMainBranch,
      })),
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const organization = await Organization.findById(user.organizationId);
  const branches = await Branch.find({ organizationId: user.organizationId, isActive: true });

  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      primaryBranchId: user.primaryBranchId || (branches.length > 0 ? branches[0]._id : null),
      organization: organization
        ? {
            id: organization._id,
            name: organization.name,
            code: organization.code,
            currency: organization.currency,
          }
        : null,
      branches: branches.map((b) => ({
        id: b._id,
        name: b.name,
        code: b.code,
        isMainBranch: b.isMainBranch,
      })),
    },
  });
});
