import { Router } from 'express';
import eventsRouter from '../controllers/events';

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.get('/', eventsRouter.getAll);
publicRouter.get('/normalized-cities', eventsRouter.getNormalizedCities);
publicRouter.get('/:id', eventsRouter.getEventInfo);
publicRouter.get('/:eventId/users', eventsRouter.getAllParticipants);

protectedRouter.post('/', eventsRouter.create);
protectedRouter.put('/:eventId', eventsRouter.updateEvent);

protectedRouter.post('/:eventId/user/:userId', eventsRouter.addParticipant);
protectedRouter.delete('/:eventId/user/:userId', eventsRouter.removeParticipant);

protectedRouter.post('/:eventId/invitation', eventsRouter.createEventInvitation);
protectedRouter.post('/:eventId/invitation/:invitationId/accept', eventsRouter.acceptEventInvitation);
protectedRouter.delete('/:eventId/invitation/:invitationId', eventsRouter.declineEventInvitation);

protectedRouter.post('/:eventId/invitation/search-users', eventsRouter.searchUsersToInvite);
protectedRouter.get('/:eventId/invitation', eventsRouter.getAllEventInvitation);

const router = {
  publicRouter,
  protectedRouter,
};

export default router;
