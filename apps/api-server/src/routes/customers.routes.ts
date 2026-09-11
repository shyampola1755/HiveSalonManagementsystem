import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  adjustWallet,
  addCustomerNote,
  addColorFormula,
  addPatchTest,
} from '../controllers/customers.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.post('/:id/wallet', adjustWallet);
router.post('/:id/notes', addCustomerNote);
router.post('/:id/formulas', addColorFormula);
router.post('/:id/patch-tests', addPatchTest);

export default router;
