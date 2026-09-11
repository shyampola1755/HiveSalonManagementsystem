import { Router } from 'express';
import {
  getProducts,
  getProductCategories,
  createProduct,
  adjustStock,
  getOrderRequests,
  createOrderRequest,
  dispatchOrderRequest,
  receiveOrderRequest,
  rejectOrderRequest,
} from '../controllers/inventory.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/products', getProducts);
router.get('/categories', getProductCategories);
router.post('/products', createProduct);
router.post('/adjust', adjustStock);

// Branch Order Requests & Dispatch Workflow
router.get('/orders', getOrderRequests);
router.post('/orders', createOrderRequest);
router.put('/orders/:id/dispatch', dispatchOrderRequest);
router.put('/orders/:id/receive', receiveOrderRequest);
router.put('/orders/:id/reject', rejectOrderRequest);

export default router;

