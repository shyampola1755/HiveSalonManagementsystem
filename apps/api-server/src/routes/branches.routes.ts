import { Router } from 'express';
import { getBranches, getHierarchy, createBranch, updateBranch } from '../controllers/branches.controller';
import { authenticateJWT } from '../middleware/auth';
import { requireRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticateJWT);

router.get('/', getBranches);
router.get('/hierarchy', getHierarchy);
router.post('/', requireRoles(['SUPER_ADMIN', 'ORG_ADMIN']), createBranch);
router.put('/:id', requireRoles(['SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_MANAGER']), updateBranch);

export default router;
