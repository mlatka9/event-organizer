import { prisma } from '@event-organizer/prisma-client';
import { NotFoundError } from '../errors/not-found';
import { NextFunction, Request, Response } from 'express';

export const isEventIdValid = async (req: Request, res: Response, next: NextFunction) => {
  const eventId = req.params.eventId;

  if (!eventId) {
    throw new Error('No eventId in isEventIdValid middleware');
  }

  const eventCount = await prisma.event.count({
    where: {
      id: eventId,
    },
  });

  if (!eventCount) {
    throw new NotFoundError(`Event with id ${eventId} doesn't exists`);
  }

  next();
};
