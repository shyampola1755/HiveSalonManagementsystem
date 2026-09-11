import { Router } from 'express';
import {
  getMembershipTiers,
  subscribeMembership,
  getCustomerPackages,
  redeemPackageSession,
} from '../controllers/memberships.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/tiers', getMembershipTiers);
router.post('/subscribe', subscribeMembership);
router.get('/packages', getCustomerPackages);
router.post('/packages/:id/redeem', redeemPackageSession);

export default router;
