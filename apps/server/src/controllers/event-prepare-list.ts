import { Request, Response } from 'express';
import { prisma } from '@event-organizer/prisma-client';
import { NotFoundError } from '../errors/not-found';
import { createEventPrepareItemInput, EventPrepareItem, toggleIsItemDoneInput } from '@event-organizer/shared-types';
import { generateErrorMessage } from 'zod-error';
import { BadRequestError, ValidationError } from '../errors';
import { ConflictError } from '../errors/conflict';

const createEventPrepareList = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  const createdEventPrepareList = await prisma.eventPrepareList.upsert({
    where: {
      eventId,
    },
    update: {
      isEnabled: true,
    },
    create: {
      eventId,
      isEnabled: true,
    },
  });

  res.status(201).json(createdEventPrepareList);
};

const hideEventPrepareList = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const eventPrepareList = await prisma.eventPrepareList.findFirst({
    where: {
      event: {
        id: eventId,
      },
    },
  });

  if (!eventPrepareList) {
    throw new NotFoundError(`There is no prepare list for event with id  ${eventId}`);
  }

  await prisma.eventPrepareList.update({
    where: {
      id: eventPrepareList.id,
    },
    data: {
      isEnabled: false,
    },
  });

  res.status(204).end();
};

const getEventPrepareListItems = async (req: Request, res: Response) => {
  if (!req.params.eventId) {
    throw new Error('No eventId in params object');
  }

  const eventPrepareItems = await prisma.eventPrepareItem.findMany({
    where: {
      eventPrepareList: {
        eventId: req.params.eventId,
      },
    },
    include: {
      declaredParticipants: {
        include: {
          eventParticipant: {
            include: {
              user: {
                select: {
                  id: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const formattedEventPrepareItems: EventPrepareItem[] = eventPrepareItems.map((item) => ({
    id: item.id,
    description: item.description,
    isItemDone:
      (item.declaredParticipants.length === item.participantsLimit &&
        item.declaredParticipants.every((p) => p.isDone)) ||
      (item.participantsLimit === -1 && item.declaredParticipants.every((p) => p.isDone)),
    participantsLimit: item.participantsLimit,
    declaredParticipants: item.declaredParticipants.map((participant) => ({
      id: participant.eventParticipant.user.id,
      name: participant.eventParticipant.user.name,
      image: participant.eventParticipant.user.image,
      isDone: participant.isDone,
    })),
  }));

  res.json(formattedEventPrepareItems);
};

const createEventPrepareListItem = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  const eventPrepareList = await prisma.eventPrepareList.findUnique({
    where: {
      eventId: eventId,
    },
    select: {
      id: true,
    },
  });

  if (!eventPrepareList) {
    throw new Error('No eventPrepareList for provided eventId');
  }

  const validation = createEventPrepareItemInput.safeParse(req.body);
  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const { data: body } = validation;

  const eventPrepareItem = await prisma.eventPrepareItem.create({
    data: {
      description: body.description,
      participantsLimit: body.participantsLimit,
      eventPrepareListId: eventPrepareList.id,
    },
  });

  res.status(201).json(eventPrepareItem);
};

const deleteEventPrepareListItem = async (req: Request, res: Response) => {
  const itemId = req.params.itemId;

  await prisma.eventPrepareItem.delete({
    where: {
      id: itemId,
    },
  });

  res.status(201).end();
};

const toggleParticipantDeclaration = async (req: Request, res: Response) => {
  const loggedUser = req.userId;
  if (!loggedUser) {
    throw new Error('No userId in req object');
  }

  const itemId = req.params.itemId;
  const eventPrepareItem = await prisma.eventPrepareItem.findUnique({
    where: {
      id: itemId,
    },
    include: {
      _count: true,
      declaredParticipants: true,
      eventPrepareList: {
        select: {
          eventId: true,
        },
      },
    },
  });

  if (!eventPrepareItem) {
    throw new NotFoundError('No event prepare list item with provided id');
  }

  const currentDeclaredParticipantsCount = eventPrepareItem._count.declaredParticipants;

  const isLoggedUserDeclareToPrepareItem = eventPrepareItem.declaredParticipants.some(
    (p) => p.participantId === loggedUser
  );

  if (isLoggedUserDeclareToPrepareItem) {
    await prisma.eventParticipantDeclaredToItem.delete({
      where: {
        participantId_eventId_eventPrepareItemId: {
          participantId: loggedUser,
          eventId: eventPrepareItem.eventPrepareList.eventId,
          eventPrepareItemId: itemId,
        },
      },
    });

    return res.status(204).end();
  } else {
    if (
      eventPrepareItem.participantsLimit === -1 ||
      eventPrepareItem.participantsLimit > currentDeclaredParticipantsCount
    ) {
      await prisma.eventParticipantDeclaredToItem.create({
        data: {
          isDone: false,
          participantId: loggedUser,
          eventId: eventPrepareItem.eventPrepareList.eventId,
          eventPrepareItemId: itemId,
        },
      });

      return res.status(201).end();
    } else {
      throw new BadRequestError('Declared participants limit exceeded');
    }
  }
};

const toggleIsItemDone = async (req: Request, res: Response) => {
  const { eventId, itemId } = req.params;

  const validation = toggleIsItemDoneInput.safeParse(req.body);
  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }
  const { data: body } = validation;

  const eventParticipantDeclaredToItem = await prisma.eventParticipantDeclaredToItem.findFirst({
    where: {
      participantId: body.participantId,
      eventPrepareItemId: itemId,
      eventId,
    },
  });

  if (!eventParticipantDeclaredToItem) {
    throw new NotFoundError('Item not found');
  }

  await prisma.eventParticipantDeclaredToItem.update({
    where: {
      participantId_eventId_eventPrepareItemId: {
        participantId: body.participantId,
        eventId: eventId,
        eventPrepareItemId: itemId,
      },
    },
    data: {
      isDone: !eventParticipantDeclaredToItem.isDone,
    },
  });

  res.status(200).end();
};

export default {
  createEventPrepareList,
  hideEventPrepareList,
  getEventPrepareListItems,
  createEventPrepareListItem,
  deleteEventPrepareListItem,
  toggleParticipantDeclaration,
  toggleIsItemDone,
};
