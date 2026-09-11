import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/reports.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/dashboard', getDashboardMetrics);

export default router;
