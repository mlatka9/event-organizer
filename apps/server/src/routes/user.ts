import { Router } from 'express';
import eventsRouter from '../controllers/users';

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.get('/:userId', eventsRouter.getById);
protectedRouter.patch('/:userId', eventsRouter.updateUser);

const router = {
  publicRouter,
  protectedRouter,
};

export default router;
