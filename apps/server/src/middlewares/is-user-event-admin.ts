import { Request, Response, NextFunction } from 'express';
import { prisma } from '@event-organizer/prisma-client';
import { UnauthenticatedError } from '../errors';

export const isUserEventAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const loggedUser = req.userId;
  const eventId = req.params.eventId;

  if (!eventId) {
    throw new Error('No eventId in isUserEventAdmin middleware');
  }

  if (!loggedUser) {
    throw new Error('No userId in request object in isUserEventAdmin middleware');
  }

  const isLoggedUserAdmin = await prisma.eventParticipant.count({
    where: {
      role: 'ADMIN',
      userId: loggedUser,
      eventId,
    },
  });

  if (!isLoggedUserAdmin) {
    throw new UnauthenticatedError(`You must be event administrator to make this action`);
  }

  next();
};
