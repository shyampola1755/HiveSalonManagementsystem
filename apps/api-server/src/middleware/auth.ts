import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  organizationId?: string;
  activeBranchId?: string;
}

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { userId: string; organizationId: string };

    const user = await User.findById(decoded.userId).populate('primaryBranchId');
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User not found or account is deactivated.' });
      return;
    }

    req.user = user;
    req.organizationId = user.organizationId.toString();

    // Extract active branch from custom header if present, or fallback to user's primary branch
    const branchHeader = req.headers['x-branch-id'] as string;
    req.activeBranchId = branchHeader || (user.primaryBranchId ? user.primaryBranchId.toString() : undefined);

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};
