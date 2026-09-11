import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Service, ServiceCategory } from '../models/Service';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all service categories
// @route   GET /api/v1/services/categories
export const getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const categories = await ServiceCategory.find({
    organizationId: req.organizationId,
    deletedAt: null,
  }).sort({ sortOrder: 1, name: 1 });

  res.json({ success: true, count: categories.length, data: categories });
});

// @desc    Get all services (optionally filtered by category or active branch)
// @route   GET /api/v1/services
export const getServices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { categoryId, search, status = 'ACTIVE' } = req.query;
  const query: any = { organizationId: req.organizationId, deletedAt: null };

  if (categoryId) query.categoryId = categoryId;
  if (status) query.status = status;
  if (search) {
    query.name = new RegExp(String(search), 'i');
  }

  const services = await Service.find(query)
    .populate('categoryId', 'name icon color')
    .sort({ name: 1 });

  // Apply branch-specific pricing if activeBranchId is passed
  const branchId = req.activeBranchId;
  const processedServices = services.map((svc) => {
    const s: any = svc.toObject();
    if (branchId && s.branchPricing && s.branchPricing.length > 0) {
      const override = s.branchPricing.find((bp: any) => bp.branchId.toString() === branchId);
      if (override) {
        s.effectivePrice = override.price;
        s.isAvailableInBranch = override.isAvailable;
      } else {
        s.effectivePrice = s.basePrice;
        s.isAvailableInBranch = true;
      }
    } else {
      s.effectivePrice = s.basePrice;
      s.isAvailableInBranch = true;
    }
    return s;
  });

  res.json({ success: true, count: processedServices.length, data: processedServices });
});

// @desc    Create new service
// @route   POST /api/v1/services
export const createService = asyncHandler(async (req: AuthRequest, res: Response) => {
  const service = await Service.create({
    ...req.body,
    organizationId: req.organizationId,
  });
  res.status(201).json({ success: true, data: service });
});

// @desc    Update service
// @route   PUT /api/v1/services/:id
export const updateService = asyncHandler(async (req: AuthRequest, res: Response) => {
  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.organizationId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!service) {
    res.status(404).json({ success: false, message: 'Service not found' });
    return;
  }

  res.json({ success: true, data: service });
});

// @desc    Create service category
// @route   POST /api/v1/services/categories
export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await ServiceCategory.create({
    ...req.body,
    organizationId: req.organizationId,
  });
  res.status(201).json({ success: true, data: category });
});
