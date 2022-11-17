import { Router } from 'express';
import usersRouter from '../controllers/users';

const publicRouter = Router();
const protectedRouter = Router();

// publicRouter.get('/search', usersRouter.searchUser);
publicRouter.get('/:userId', usersRouter.getById);
publicRouter.get('/:userId/events', usersRouter.getUserEvents);

protectedRouter.patch('/:userId', usersRouter.updateUser);
protectedRouter.get('/:userId/event-invitations', usersRouter.getEventInvitations);

const router = {
  publicRouter,
  protectedRouter,
};

export default router;
