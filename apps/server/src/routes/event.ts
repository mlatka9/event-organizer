import { Router } from 'express';
import eventsRouter from '../controllers/events';
import eventsPrepareListRouter from '../controllers/event-prepare-list';
import { isEventIdValid } from '../middlewares/is-event-id-valid';
import { isUserEventAdmin } from '../middlewares/is-user-event-admin';

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.get('/', eventsRouter.getAll);
publicRouter.get('/normalized-cities', eventsRouter.getNormalizedCities);
publicRouter.get('/:id', eventsRouter.getEventInfo);
publicRouter.get('/:eventId/users', eventsRouter.getAllParticipants);

protectedRouter.post('/', eventsRouter.create);
protectedRouter.delete('/:eventId', eventsRouter.deleteEvent);
protectedRouter.put('/:eventId', eventsRouter.updateEvent);
protectedRouter.patch('/:eventId', eventsRouter.updateEventTime);

protectedRouter.post('/:eventId/user/:userId', eventsRouter.addParticipant);
protectedRouter.delete('/:eventId/user/:userId', eventsRouter.removeParticipant);

protectedRouter.post('/:eventId/invitation', eventsRouter.createEventInvitation);
protectedRouter.post('/:eventId/invitation/:invitationId/accept', eventsRouter.acceptEventInvitation);
protectedRouter.delete('/:eventId/invitation/:invitationId', eventsRouter.declineEventInvitation);

protectedRouter.post('/:eventId/invitation/search-users', eventsRouter.searchUsersToInvite);
protectedRouter.get('/:eventId/invitation', eventsRouter.getAllEventInvitation);
protectedRouter.post('/:eventId/shared-events/group-list', eventsRouter.getGroupsToShare);

protectedRouter.post('/:eventId/date-poll', eventsRouter.createDatePoll);
protectedRouter.delete('/:eventId/date-poll', eventsRouter.hideDatePoll);
protectedRouter.get('/:eventId/date-poll', eventsRouter.getDatePoll);
protectedRouter.post('/:eventId/date-poll/:datePollId/create-option', eventsRouter.createDatePollOption);
protectedRouter.patch('/:eventId/date-poll/:datePollId/toggle-select', eventsRouter.toggleDatePollOption);
protectedRouter.delete('/:eventId/date-poll/:datePollId/options/:optionId', eventsRouter.deleteDatePollOption);

protectedRouter.post('/:eventId/chat', eventsRouter.createEventChat);
protectedRouter.delete('/:eventId/chat', eventsRouter.hideEventChat);
protectedRouter.get('/:eventId/chat/messages', eventsRouter.getEventChatMessages);
protectedRouter.post('/:eventId/chat/messages', eventsRouter.createEventChatMessage);

protectedRouter.post(
  '/:eventId/prepare-list',
  isEventIdValid,
  isUserEventAdmin,
  eventsPrepareListRouter.createEventPrepareList
); // dodaj liste w ustawieniach

protectedRouter.delete(
  '/:eventId/prepare-list',
  isEventIdValid,
  isUserEventAdmin,
  eventsPrepareListRouter.hideEventPrepareList
); // ukryj listę w ustawienaich

protectedRouter.get('/:eventId/prepare-list/items', eventsPrepareListRouter.getEventPrepareListItems); // pobierz wszystkie itemy z listy
protectedRouter.post('/:eventId/prepare-list/items', eventsPrepareListRouter.createEventPrepareListItem); // dodaj nowy item do listy
protectedRouter.delete('/:eventId/prepare-list/items/:itemId', eventsPrepareListRouter.deleteEventPrepareListItem); // usuń item z listy (dla administratora)
protectedRouter.post(
  '/:eventId/prepare-list/items/:itemId/participants-declared-toggle',
  eventsPrepareListRouter.toggleParticipantDeclaration
); // toggle participant declaration

protectedRouter.post('/:eventId/prepare-list/items/:itemId/toggle-is-done', eventsPrepareListRouter.toggleIsItemDone); // toggle participant declaration is done

const router = {
  publicRouter,
  protectedRouter,
};

export default router;
