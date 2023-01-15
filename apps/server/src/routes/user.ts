import { Router } from 'express';
import usersRouter from '../controllers/users';

const publicRouter = Router();
const protectedRouter = Router();

// publicRouter.get('/search', usersRouter.searchUser);
publicRouter.get('/:userId', usersRouter.getById);
publicRouter.get('/:userId/events', usersRouter.getUserEvents);
publicRouter.get('/:userId/groups', usersRouter.getUserGroups);

protectedRouter.patch('/:userId', usersRouter.updateUser);

protectedRouter.get('/:userId/event-invitations', usersRouter.getEventInvitations);
protectedRouter.get('/:userId/event-pending-requests', usersRouter.getEventPendingRequest);

protectedRouter.get('/:userId/group-invitations', usersRouter.getGroupInvitations);
protectedRouter.get('/:userId/group-pending-requests', usersRouter.getGroupPendingRequest);

const router = {
  publicRouter,
  protectedRouter,
};

export default router;
