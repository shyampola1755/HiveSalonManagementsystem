import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Branch } from '../models/Branch';
import { State, District, City } from '../models/Hierarchy';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all branches for the organization
// @route   GET /api/v1/branches
export const getBranches = asyncHandler(async (req: AuthRequest, res: Response) => {
  const branches = await Branch.find({
    organizationId: req.organizationId,
    deletedAt: null,
  })
    .populate('cityId', 'name code')
    .populate('stateId', 'name code')
    .sort({ isMainBranch: -1, name: 1 });

  res.json({ success: true, count: branches.length, data: branches });
});

// @desc    Get complete geographical hierarchy (States -> Districts -> Cities -> Branches)
// @route   GET /api/v1/branches/hierarchy
export const getHierarchy = asyncHandler(async (req: AuthRequest, res: Response) => {
  const [states, districts, cities, branches] = await Promise.all([
    State.find({ organizationId: req.organizationId, deletedAt: null }),
    District.find({ organizationId: req.organizationId, deletedAt: null }),
    City.find({ organizationId: req.organizationId, deletedAt: null }),
    Branch.find({ organizationId: req.organizationId, deletedAt: null }),
  ]);

  const tree = states.map((state) => {
    const stateDistricts = districts.filter((d) => d.stateId.toString() === state._id.toString());
    return {
      id: state._id,
      name: state.name,
      code: state.code,
      districts: stateDistricts.map((district) => {
        const districtCities = cities.filter((c) => c.districtId.toString() === district._id.toString());
        return {
          id: district._id,
          name: district.name,
          code: district.code,
          cities: districtCities.map((city) => {
            const cityBranches = branches.filter((b) => b.cityId && b.cityId.toString() === city._id.toString());
            return {
              id: city._id,
              name: city.name,
              code: city.code,
              branches: cityBranches.map((branch) => ({
                id: branch._id,
                name: branch.name,
                code: branch.code,
                address: branch.address,
                phone: branch.phone,
                isActive: branch.isActive,
                isMainBranch: branch.isMainBranch,
              })),
            };
          }),
        };
      }),
    };
  });

  res.json({ success: true, data: tree });
});

// @desc    Create a branch
// @route   POST /api/v1/branches
export const createBranch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const branch = await Branch.create({
    ...req.body,
    organizationId: req.organizationId,
  });
  res.status(201).json({ success: true, data: branch });
});

// @desc    Update a branch
// @route   PUT /api/v1/branches/:id
export const updateBranch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const branch = await Branch.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.organizationId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!branch) {
    res.status(404).json({ success: false, message: 'Branch not found' });
    return;
  }

  res.json({ success: true, data: branch });
});
