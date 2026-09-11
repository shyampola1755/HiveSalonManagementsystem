import { Router } from 'express';
import {
  getCategories,
  getServices,
  createService,
  updateService,
  createCategory,
} from '../controllers/services.controller';
import { authenticateJWT } from '../middleware/auth';
import { requireRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticateJWT);

router.get('/categories', getCategories);
router.post('/categories', requireRoles(['SUPER_ADMIN', 'ORG_ADMIN']), createCategory);

router.get('/', getServices);
router.post('/', requireRoles(['SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_MANAGER']), createService);
router.put('/:id', requireRoles(['SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_MANAGER']), updateService);

export default router;
