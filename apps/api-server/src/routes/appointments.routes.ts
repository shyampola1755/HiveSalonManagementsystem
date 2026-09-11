import { Router } from 'express';
import {
  getAppointments,
  getLiveQueue,
  createAppointment,
  updateAppointmentStatus,
} from '../controllers/appointments.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getAppointments);
router.get('/queue', getLiveQueue);
router.post('/', createAppointment);
router.put('/:id/status', updateAppointmentStatus);

export default router;
