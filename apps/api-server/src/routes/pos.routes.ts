import { Router } from 'express';
import { getInvoices, processCheckout } from '../controllers/pos.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/invoices', getInvoices);
router.post('/checkout', processCheckout);

export default router;
