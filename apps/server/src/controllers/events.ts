import { NextFunction, Request, Response } from 'express';
import { prisma } from '@event-organizer/prisma-client';
import { UnauthenticatedError, ValidationError } from '../errors';
import { generateErrorMessage } from 'zod-error';
import {
  createEventSchema,
  CreateEventInputType,
  EventDetailsType,
  getAllEventsSchema,
  GetAllEventsInputType,
  EventShowcaseType,
  EventInvitationType,
} from '@event-organizer/shared-types';
import { NotFoundError } from '../errors/not-found';
import { getLoginSession } from '@event-organizer/auth';
import { formatDisplayAddress } from '../lib/format-display-address';

const addNormalizedCity = async (city: string | undefined) => {
  if (!city) return;

  const normalizedCity = await prisma.normalizedCity.upsert({
    where: {
      name: city,
    },
    update: {},
    create: {
      name: city,
    },
  });

  return normalizedCity.id;
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const validation = createEventSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  if (!req.userId) {
    throw new Error('Bad middleware order');
  }

  const body: CreateEventInputType = req.body;

  const normalizedCityId = await addNormalizedCity(body.normalizedCity);

  await prisma.event.create({
    data: {
      name: body.name,
      description: body.description,
      street: body.street,
      city: body.city,
      country: body.country,
      postCode: body.postCode,
      startDate: body.startDate,
      categoryId: body.categoryId,
      longitude: body.longitude,
      latitude: body.latitude,
      normalizedCityId: normalizedCityId,
      bannerImage: body.bannerImage,
      eventVisibilityStatus: body.eventVisibilityStatus,
      eventLocationStatus: body.eventLocationStatus,
      eventParticipants: {
        create: {
          role: 'ADMIN',
          userId: req.userId,
        },
      },
      tags: {
        connectOrCreate:
          body.tags &&
          body.tags.map((t) => ({
            create: {
              name: t,
            },
            where: {
              name: t,
            },
          })),
      },
    },
  });

  res.status(201).end();
};

const getEventInfo = async (req: Request, res: Response) => {
  const session = await getLoginSession(req);
  const eventId = req.params.id;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      _count: {
        select: {
          eventParticipants: true,
        },
      },
      eventParticipants: {
        select: {
          role: true,
          userId: true,
        },
      },
      category: true,
      tags: true,
    },
  });

  if (!event) {
    res.status(400).json({ message: `No event with id ${eventId}` });
    return;
  }

  console.log(event.eventVisibilityStatus);

  const isLoggedUserParticipant = event.eventParticipants.some((user) => user.userId === session?.userId);

  console.log('isLoggedUserParticipant', isLoggedUserParticipant);

  if (event.eventVisibilityStatus === 'PUBLIC' || isLoggedUserParticipant) {
    const formattedEvent: EventDetailsType = {
      id: event.id,
      name: event.name,
      description: event.description,
      displayAddress: formatDisplayAddress([event.street, event.city, event.country, event.postCode]),
      participantsCount: event._count.eventParticipants,
      startDate: event.startDate ? event.startDate.toISOString() : undefined,
      latitude: event.latitude ? Number(event.latitude) : undefined,
      longitude: event.longitude ? Number(event.longitude) : undefined,
      categoryName: event.category.name,
      categoryId: event.category.id,
      bannerImage: event.bannerImage || undefined,
      isCurrentUserAdmin: event.eventParticipants.some(
        (user) => user.role === 'ADMIN' && user.userId === session?.userId
      ),
      isCurrentUserParticipant: event.eventParticipants.some((user) => user.userId === session?.userId),
    };
    res.json(formattedEvent);
  } else {
    res.status(401).json('this event is private');
  }
};

const getAll = async (req: Request, res: Response) => {
  const validation = getAllEventsSchema.safeParse(req.query);

  console.log(validation);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const { city, timeRange, category, locationStatus, page = 1, limit = 10 }: GetAllEventsInputType = validation.data;

  const currentDate = new Date();
  let maxDate: Date | undefined = undefined;

  if (timeRange === 'TODAY') {
    const date = new Date();
    date.setDate(currentDate.getDate() + 1);
    maxDate = date;
  }
  if (timeRange === 'THISWEEK') {
    const date = new Date();
    date.setDate(currentDate.getDate() + 7);
    maxDate = date;
  }
  if (timeRange === 'THISMONTH') {
    const date = new Date();
    date.setMonth(currentDate.getMonth() + 1);
    maxDate = date;
  }

  const eventsCount = await prisma.event.count({
    where: {
      startDate: maxDate
        ? {
            lte: maxDate,
            gte: currentDate,
          }
        : undefined,
      category: {
        name: category,
      },
      normalizedCity: {
        name: city
          ? {
              contains: city,
              mode: 'insensitive',
            }
          : undefined,
      },
      eventLocationStatus: locationStatus === 'STATIONARY' || locationStatus === 'ONLINE' ? locationStatus : undefined,
    },
  });

  const events = await prisma.event.findMany({
    skip: (+page - 1) * +limit,
    take: +limit,
    where: {
      startDate: maxDate
        ? {
            lte: maxDate,
            gte: currentDate,
          }
        : undefined,
      category: {
        name: category,
      },
      normalizedCity: {
        name: city
          ? {
              contains: city,
              mode: 'insensitive',
            }
          : undefined,
      },
      eventLocationStatus: locationStatus === 'STATIONARY' || locationStatus === 'ONLINE' ? locationStatus : undefined,
    },
    include: {
      _count: true,
      eventParticipants: {
        select: {
          role: true,
          userId: true,
        },
      },
      category: true,
      tags: true,
    },
  });

  const formattedEvents: EventShowcaseType[] = events.map((event) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    displayAddress: formatDisplayAddress([event.street, event.city, event.country, event.postCode]),
    participantsCount: event._count.eventParticipants,
    startDate: event.startDate ? event.startDate.toISOString() : undefined,
    latitude: event.latitude ? Number(event.latitude) : undefined,
    longitude: event.longitude ? Number(event.longitude) : undefined,
    categoryName: event.category.name,
    categoryId: event.category.id,
    bannerImage: event.bannerImage || undefined,
  }));

  res.status(200).json({ events: formattedEvents, currentPage: +page, pageCount: Math.ceil(eventsCount / +limit) });
};

const getNormalizedCities = async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;

  if (!search) {
    const normalizedCities = await prisma.normalizedCity.findMany({
      take: 5,
    });
    res.status(200).json(normalizedCities);
    return;
  }

  const normalizedCities = await prisma.normalizedCity.findMany({
    take: 5,
    where: {
      name: search
        ? {
            contains: search,
            mode: 'insensitive',
          }
        : undefined,
    },
  });

  res.status(200).json(normalizedCities);
};

const addParticipant = async (req: Request, res: Response) => {
  const currentUserId = req.userId;

  const eventId = req.params.eventId as string;
  const userId = req.params.userId as string;

  console.log('eventId', eventId);
  console.log('userId', userId);

  if (!currentUserId) {
    throw new Error('No userId in protected route');
  }

  const [event, userToAdd] = await Promise.all([
    prisma.event.findUnique({
      where: {
        id: eventId,
      },
    }),
    prisma.user.findUnique({
      where: {
        id: userId,
      },
    }),
  ]);

  if (!event) {
    throw new NotFoundError(`Event with id ${eventId} dose not exists`);
  }

  if (!userToAdd) {
    throw new NotFoundError(`User with id ${userId} dose not exists`);
  }

  // const eventAdmins = await prisma.eventParticipant.findMany({
  //   where: {
  //     role: 'ADMIN',
  //     eventId: eventId,
  //   },
  // });

  // const eventAdminsIds = eventAdmins.map((user) => user.userId);

  if (event.eventVisibilityStatus === 'PUBLIC') {
    if (userToAdd.id !== userId) {
      throw new UnauthenticatedError('You dont have permission to add user to this event');
    }
    await prisma.eventParticipant.create({
      data: {
        userId,
        eventId,
      },
    });
    res.status(201).end();
  }
};

const removeParticipant = async (req: Request, res: Response) => {
  const currentUserId = req.userId;

  const eventId = req.params.eventId as string;
  const userId = req.params.userId as string;

  console.log(eventId, userId);

  if (!currentUserId) {
    throw new Error('No userId in protected route');
  }

  const [event, userToAdd] = await Promise.all([
    prisma.event.findUnique({
      where: {
        id: eventId,
      },
    }),
    prisma.user.findUnique({
      where: {
        id: userId,
      },
    }),
  ]);

  if (!event) {
    throw new NotFoundError(`Event with id ${eventId} dose not exists`);
  }

  if (!userToAdd) {
    throw new NotFoundError(`User with id ${userId} dose not exists`);
  }

  if (event.eventVisibilityStatus === 'PUBLIC') {
    if (userToAdd.id !== userId) {
      throw new UnauthenticatedError('You dont have permission to remove user from this event');
    }
    await prisma.eventParticipant.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });
    res.status(204).end();
  }
};

const getAllEventInvitation = async (req: Request, res: Response) => {
  const eventId = req.params.eventId as string;
  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  const isLoggedUserEligible = await prisma.eventParticipant.count({
    where: {
      eventId,
      userId: loggedUserId,
      role: 'ADMIN',
    },
  });

  if (!isLoggedUserEligible) {
    throw new UnauthenticatedError(`You dont have permission to invitation for event with id ${eventId}`);
  }

  const eventInvitation = await prisma.eventInvitaion.findMany({
    where: {
      eventId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      event: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const formattedEventInvitation: EventInvitationType[] = eventInvitation.map((invitation) => ({
    id: invitation.id,
    user: invitation.user,
    event: invitation.event,
    isUserAccepted: invitation.isUserAccepted,
    isAdminAccepted: invitation.isAdminAccepted,
  }));

  res.status(200).json(formattedEventInvitation);
};

const createEventInvitation = async (req: Request, res: Response) => {
  const eventId = req.params.eventId as string;
  const userId = req.body.userId;
  const loggedUserId = req.userId;

  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  if (!userId) {
    throw new ValidationError('userId is required');
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      eventParticipants: {
        select: {
          role: true,
          userId: true,
        },
      },
    },
  });

  if (!event) {
    throw new NotFoundError(`Event with id ${eventId} dose not exists`);
  }

  if (event.eventParticipants.some((user) => user.userId === userId)) {
    throw new ValidationError(`User with id ${userId} is already participating in event with id ${eventId}`);
  }

  const adminsIds = event.eventParticipants.filter((user) => user.role === 'ADMIN').map((user) => user.userId);

  if (!loggedUserId === userId && !adminsIds.includes(loggedUserId)) {
    throw new UnauthenticatedError('You dont have permissions to create event invitation');
  }

  await prisma.eventInvitaion.create({
    data: {
      eventId,
      userId,
      isUserAccepted: !adminsIds.includes(loggedUserId),
      isAdminAccepted: adminsIds.includes(loggedUserId),
    },
  });

  res.status(201).end();
};

const acceptEventInvitation = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;
  const invitationId = req.params.invitationId;

  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  const invitation = await prisma.eventInvitaion.findUnique({
    where: {
      id: invitationId,
    },
  });

  const eventAdmins = await prisma.eventParticipant.findMany({
    where: {
      eventId,
      role: 'ADMIN',
    },
  });

  const eventAdminsIds = eventAdmins.map((admin) => admin.userId);

  if (!invitation) {
    throw new NotFoundError(`Invitation with id ${invitationId} dose not exists`);
  }

  console.log(invitation.userId, loggedUserId, invitation.isAdminAccepted);

  const isUserEligibleToJoinEvent =
    (invitation.userId === loggedUserId && invitation.isAdminAccepted) ||
    (eventAdminsIds.includes(loggedUserId) && invitation.isUserAccepted);

  console.log('isUserEligibleToJoinEvent', isUserEligibleToJoinEvent);

  if (isUserEligibleToJoinEvent) {
    await prisma.$transaction([
      prisma.eventParticipant.create({
        data: {
          eventId,
          userId: invitation.userId,
        },
      }),
      prisma.eventInvitaion.update({
        where: {
          id: invitationId,
        },
        data: {
          isUserAccepted: true,
          isAdminAccepted: true,
        },
      }),
    ]);

    res.status(201).end({ message: `User with id ${invitation.userId} was added to event with id ${eventId}` });
  }

  throw new UnauthenticatedError('You dont have permission to accept invitation');
};

const declineEventInvitation = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;
  const invitationId = req.params.invitationId;

  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  const invitation = await prisma.eventInvitaion.findUnique({
    where: {
      id: invitationId,
    },
  });

  const eventAdmins = await prisma.eventParticipant.findMany({
    where: {
      eventId,
      role: 'ADMIN',
    },
  });

  const eventAdminsIds = eventAdmins.map((admin) => admin.userId);

  if (!invitation) {
    throw new NotFoundError(`Invitation with id ${invitationId} dose not exists`);
  }

  const isUserEligibleToDeclineInvitation =
    (invitation.userId === loggedUserId && invitation.isAdminAccepted) ||
    (eventAdminsIds.includes(loggedUserId) && invitation.isUserAccepted);

  if (isUserEligibleToDeclineInvitation) {
    await prisma.eventInvitaion.delete({
      where: {
        id: invitationId,
      },
    });

    res.status(204).end();
  }

  throw new UnauthenticatedError('You dont have permission to decline invitation');
};

export default {
  getAllEventInvitation,
  declineEventInvitation,
  acceptEventInvitation,
  createEventInvitation,
  getAll,
  getEventInfo,
  create,
  getNormalizedCities,
  addParticipant,
  removeParticipant,
};
