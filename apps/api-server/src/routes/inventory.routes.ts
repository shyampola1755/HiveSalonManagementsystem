import { Router } from 'express';
import {
  getProducts,
  getProductCategories,
  createProduct,
  adjustStock,
} from '../controllers/inventory.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/products', getProducts);
router.get('/categories', getProductCategories);
router.post('/products', createProduct);
router.post('/adjust', adjustStock);

export default router;
