import { Router } from 'express';
import groupsRouter from '../controllers/groups';

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.get('/', groupsRouter.getAllGroups);
publicRouter.get('/:groupId', groupsRouter.getGroupDetails);

protectedRouter.post('/:groupId/users/:userId', groupsRouter.addMember);
protectedRouter.delete('/:groupId/users/:userId', groupsRouter.removeMember);
protectedRouter.post('/', groupsRouter.createGroup);
protectedRouter.get('/:groupId/users', groupsRouter.getGroupMembers);

protectedRouter.post('/:groupId/invitations', groupsRouter.createGroupInvitation);
protectedRouter.post('/:groupId/invitations/:invitationId/accept', groupsRouter.acceptGroupInvitation);
protectedRouter.delete('/:groupId/invitations/:invitationId', groupsRouter.declineGroupInvitation);
protectedRouter.post('/:groupId/invitations/search-users', groupsRouter.searchUsersToGroupInvite);
protectedRouter.get('/:groupId/invitations', groupsRouter.getAllGroupInvitation);

protectedRouter.post('/:groupId/shared-events', groupsRouter.shareEvent);
protectedRouter.get('/:groupId/shared-events', groupsRouter.getAllSharedEvents);

const router = {
  publicRouter,
  protectedRouter,
};

export default router;
