import { Router } from 'express';
import eventsRouter from '../controllers/events';

const router = Router();

router.post('/', eventsRouter.create);
router.get('/', eventsRouter.getAll);

export default router;
