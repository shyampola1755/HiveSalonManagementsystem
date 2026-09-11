import { Router } from 'express';
import { getExpenses, createExpense, getCampaigns, createCampaign } from '../controllers/finance.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/expenses', getExpenses);
router.post('/expenses', createExpense);
router.get('/campaigns', getCampaigns);
router.post('/campaigns', createCampaign);

export default router;
