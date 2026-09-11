import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // SUPER_ADMIN and ORG_ADMIN always have full permissions
    if (['SUPER_ADMIN', 'ORG_ADMIN'].includes(req.user.role)) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of [${allowedRoles.join(', ')}] permissions.`,
      });
      return;
    }

    next();
  };
};

export const errorHandler = (err: any, req: any, res: Response, next: NextFunction): void => {
  console.error('[API Error]:', err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
