import { Request, Response } from 'express';
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
  createEventInvitationSchema,
  CreateEventInvitationInputType,
  EventParticipant,
  searchUserToEventInvitationSchema,
  UserType,
} from '@event-organizer/shared-types';
import { NotFoundError } from '../errors/not-found';
import { getLoginSession } from '@event-organizer/auth';
import { formatDisplayAddress } from '../lib/format-display-address';
import { isPublicEvent } from '../lib/events';

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

const create = async (req: Request, res: Response) => {
  const validation = createEventSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  if (!req.userId) {
    throw new Error('No userId in req object');
  }

  const eventData = validation.data;

  const normalizedCityId = await addNormalizedCity(eventData.normalizedCity);

  const event = await prisma.event.create({
    data: {
      name: eventData.name,
      description: eventData.description,
      street: eventData.street,
      city: eventData.city,
      country: eventData.country,
      postCode: eventData.postCode,
      startDate: eventData.startDate,
      categoryId: eventData.categoryId,
      longitude: eventData.longitude,
      latitude: eventData.latitude,
      normalizedCityId: normalizedCityId,
      bannerImage: eventData.bannerImage,
      eventVisibilityStatus: eventData.eventVisibilityStatus,
      eventLocationStatus: eventData.eventLocationStatus,
      eventParticipants: {
        create: {
          role: 'ADMIN',
          userId: req.userId,
        },
      },
      tags: {
        connectOrCreate:
          eventData.tags &&
          eventData.tags.map((t) => ({
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

  res.status(201).json({ eventId: event.id });
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

  const isLoggedUserParticipant = event.eventParticipants.some((user) => user.userId === session?.user.userId);

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
        (user) => user.role === 'ADMIN' && user.userId === session?.user.userId
      ),
      isCurrentUserParticipant: event.eventParticipants.some((user) => user.userId === session?.user.userId),
      city: event.city || undefined,
      country: event.country || undefined,
      eventLocationStatus: event.eventLocationStatus,
      eventVisibilityStatus: event.eventVisibilityStatus,
      postCode: event.postCode || undefined,
      street: event.postCode || undefined,
      tags: event.tags.map((t) => t.name),
    };
    res.json(formattedEvent);
  } else {
    res.status(401).json('this event is private');
  }
};

const getAll = async (req: Request, res: Response) => {
  const validation = getAllEventsSchema.safeParse(req.query);

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

  console.log('pre events');

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

  const formattedEvents = events.map((event) => ({
    id: event.id,
    name: event.name,
    displayAddress: formatDisplayAddress([event.street, event.city, event.country, event.postCode]) || null,
    participantsCount: event._count.eventParticipants || null,
    startDate: event.startDate ? event.startDate.toISOString() : null,
    latitude: event.latitude ? Number(event.latitude) : null,
    longitude: event.longitude ? Number(event.longitude) : null,
    bannerImage: event.bannerImage || null,
    visibilityStatus: event.eventVisibilityStatus,
  }));

  const publicEvents = formattedEvents.filter(isPublicEvent);
  // const privateEvents = formattedEvents.filter(isPrivateEvent);

  const eventShowcases: EventShowcaseType[] = [...publicEvents];

  res.status(200).json({ events: eventShowcases, currentPage: +page, pageCount: Math.ceil(eventsCount / +limit) });
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
  console.log('removeParticipant');
  const currentUserId = req.userId;

  const eventId = req.params.eventId as string;
  const userId = req.params.userId as string;

  console.log(eventId, userId);

  if (!currentUserId) {
    throw new Error('No userId in protected route');
  }

  const [event, userToRemove] = await Promise.all([
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

  if (!userToRemove) {
    throw new NotFoundError(`User with id ${userId} dose not exists`);
  }

  // if (event.eventVisibilityStatus === 'PUBLIC') {
  if (userToRemove.id !== userId) {
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
  // }
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

  const eventInvitation = await prisma.eventInvitation.findMany({
    where: {
      eventId,
      NOT: {
        AND: [
          {
            isUserAccepted: true,
          },
          {
            isAdminAccepted: true,
          },
        ],
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      event: {
        select: {
          id: true,
          name: true,
          bannerImage: true,
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
  const loggedUserId = req.userId;

  const validation = createEventInvitationSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const { ids }: CreateEventInvitationInputType = validation.data;

  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  if (ids.length === 0) {
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

  const usersAlreadyParticipatingInEvent = event.eventParticipants.filter((user) => ids.includes(user.userId));

  if (usersAlreadyParticipatingInEvent.length) {
    throw new ValidationError(
      `Users with ids: ${usersAlreadyParticipatingInEvent
        .map((u) => u.userId)
        .join(', ')} is already participating in event with id ${eventId}`
    );
  }

  const adminsIds = event.eventParticipants.filter((user) => user.role === 'ADMIN').map((user) => user.userId);

  const isLoggedUserAdmin = adminsIds.includes(loggedUserId);

  if (isLoggedUserAdmin || (ids.length === 1 && loggedUserId === ids[0])) {
    await prisma.eventInvitation.createMany({
      data: ids.map((id) => ({
        eventId,
        userId: id,
        isUserAccepted: !adminsIds.includes(loggedUserId),
        isAdminAccepted: adminsIds.includes(loggedUserId),
      })),
    });

    res.status(201).end();
    return;
  }
  throw new UnauthenticatedError('You dont have permissions to create event invitation 123');
};

const acceptEventInvitation = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;
  const invitationId = req.params.invitationId;

  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  const invitation = await prisma.eventInvitation.findUnique({
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

  if (isUserEligibleToJoinEvent) {
    await prisma.$transaction([
      prisma.eventParticipant.create({
        data: {
          eventId,
          userId: invitation.userId,
        },
      }),
      prisma.eventInvitation.delete({
        where: {
          id: invitationId,
        },
      }),
    ]);

    res.status(201).json({ message: `User with id ${invitation.userId} was added to event with id ${eventId}` });
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

  const invitation = await prisma.eventInvitation.findUnique({
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

  console.log('eventAdminsIds', eventAdminsIds);
  console.log('loggedUserId', loggedUserId);

  if (!invitation) {
    throw new NotFoundError(`Invitation with id ${invitationId} dose not exists`);
  }

  const isUserEligibleToDeclineInvitation = invitation.userId === loggedUserId || eventAdminsIds.includes(loggedUserId);

  if (isUserEligibleToDeclineInvitation) {
    console.log('REMOVING');
    await prisma.eventInvitation.delete({
      where: {
        id: invitationId,
      },
    });

    res.status(204).end();
  } else {
    throw new UnauthenticatedError('You dont have permission to decline invitation');
  }
};

const getAllParticipants = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  const eventCount = await prisma.event.count({
    where: {
      id: eventId,
    },
  });

  if (!eventCount) {
    throw new NotFoundError(`There is not event with id ${eventId}`);
  }

  const eventParticipants = await prisma.eventParticipant.findMany({
    where: {
      eventId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const formattedParticipants: EventParticipant[] = eventParticipants.map((participant) => ({
    id: participant.user.id,
    name: participant.user.name,
    image: participant.user.image,
    role: participant.role,
  }));

  res.status(200).json(formattedParticipants);
};

const searchUsersToInvite = async (req: Request, res: Response) => {
  const loggedUserId = req.userId;

  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  const validation = searchUserToEventInvitationSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const eventId = req.params.eventId;

  const eventCount = await prisma.event.count({
    where: {
      id: eventId,
    },
  });

  if (!eventCount) {
    throw new NotFoundError(`Event with id ${eventId} dose not exists`);
  }

  const { phrase, limit = 10 } = validation.data;

  console.log('phrase', phrase);

  const matchingUsers = await prisma.user.findMany({
    where: {
      name: {
        contains: phrase,
        mode: 'insensitive',
      },
      eventParticipants: {
        none: {
          eventId,
          user: {
            name: {
              contains: phrase,
              mode: 'insensitive',
            },
          },
        },
      },
      pendingEventInvitations: {
        none: {
          eventId,
          user: {
            name: {
              contains: phrase,
              mode: 'insensitive',
            },
          },
        },
      },
    },
  });

  const formattedUsers: UserType[] = matchingUsers.map((user) => ({
    id: user.id,
    name: user.name,
    image: user.image,
  }));

  res.json(formattedUsers);
};

const updateEvent = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  const validation = createEventSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  if (!req.userId) {
    throw new Error('No userId in req object');
  }

  const eventData = validation.data;

  const normalizedCityId = await addNormalizedCity(eventData.normalizedCity);

  const event = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      name: eventData.name,
      description: eventData.description,
      street: eventData.street,
      city: eventData.city,
      country: eventData.country,
      postCode: eventData.postCode,
      startDate: eventData.startDate,
      categoryId: eventData.categoryId,
      longitude: eventData.longitude,
      latitude: eventData.latitude,
      normalizedCityId: normalizedCityId,
      bannerImage: eventData.bannerImage,
      eventVisibilityStatus: eventData.eventVisibilityStatus,
      eventLocationStatus: eventData.eventLocationStatus,
      tags: {
        connectOrCreate:
          eventData.tags &&
          eventData.tags.map((t) => ({
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

  res.status(200).end();
};

export default {
  updateEvent,
  searchUsersToInvite,
  getAllParticipants,
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
