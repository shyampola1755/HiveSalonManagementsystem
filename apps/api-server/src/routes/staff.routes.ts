import { Router } from 'express';
import {
  getStaff,
  getAttendance,
  clockAttendance,
  getLeaves,
  updateLeaveStatus,
} from '../controllers/staff.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getStaff);
router.get('/attendance', getAttendance);
router.post('/attendance/clock', clockAttendance);
router.get('/leaves', getLeaves);
router.put('/leaves/:id', updateLeaveStatus);

export default router;
