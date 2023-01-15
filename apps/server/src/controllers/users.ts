import { Request, Response } from 'express';
import { prisma } from '@event-organizer/prisma-client';
import { NotFoundError } from '../errors/not-found';
import { getLoginSession } from '@event-organizer/auth';
import {
  EventInvitationType,
  EventShowcaseType,
  eventUserInvitationSchema,
  GroupInvitationType,
  GroupShowcaseType,
  UpdateUserInputType,
  updateUserSchema,
  userEventsSchema,
  UserProfileType,
} from '@event-organizer/shared-types';
import { UnauthenticatedError, ValidationError } from '../errors';
import { generateErrorMessage } from 'zod-error';
import { formatDisplayAddress } from '../lib/format-display-address';
import { isPrivateEvent, isPublicEvent } from '../lib/events';
import { ConflictError } from '../errors/conflict';

const getById = async (req: Request, res: Response) => {
  const session = await getLoginSession(req);
  const userId = req.params.userId as string;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      favouriteCategories: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  console.log('user', user);

  if (!user) {
    throw new NotFoundError(`There is no user with id ${userId}`);
  }

  const formattedUser: UserProfileType = {
    image: user.image,
    id: user.id,
    name: user.name,
    favouriteCategories: user.favouriteCategories.map((c) => c.category),
    isMe: session?.user.userId === user.id,
    joinedAt: user.joinedAt.toISOString(),
  };

  res.status(200).json(formattedUser);
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  if (!req.userId) {
    throw new Error('No userId in updateUser');
  }
  if (req.userId !== userId) {
    throw new UnauthenticatedError('You dont have permissions to update this user');
  }

  const validation = updateUserSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }
  const body: UpdateUserInputType = req.body;

  console.log('body.name', body.name);

  const duplicatedUser = await prisma.user.findUnique({
    where: {
      name: body.name,
    },
  });
  console.log('duplicatedUser', duplicatedUser);
  console.log('userId', userId);

  if (duplicatedUser && duplicatedUser.id !== req.userId) {
    throw new ConflictError(`There is already user with name ${body.name}`);
  }

  const categoriesToSet = await prisma.category.findMany({
    where: {
      name: {
        in: body.favouriteCategories,
      },
    },
  });

  const categoriesIdToSet = categoriesToSet.map((c) => c.id);

  await prisma.$transaction([
    prisma.userFavouriteCategories.deleteMany({
      where: {
        userId,
      },
    }),
    prisma.userFavouriteCategories.createMany({
      data: categoriesIdToSet.map((c) => ({
        userId,
        categoryId: c,
      })),
    }),
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: body.name,
        image: body.image,
      },
    }),
  ]);

  res.json(200).end();
};

const getUserEvents = async (req: Request, res: Response) => {
  const session = await getLoginSession(req);
  const userId = req.params.userId;
  const requestFromUserOwner = userId === session?.user.userId;

  const validation = userEventsSchema.safeParse(req.query);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }
  const query = validation.data;

  console.log('query', query);

  const userCount = await prisma.user.count({
    where: {
      id: userId,
    },
  });

  if (!userCount) {
    throw new NotFoundError(`User with id ${userId} dose not exists`);
  }

  const events = await prisma.event.findMany({
    where: {
      eventParticipants: {
        some: {
          userId,
        },
      },
      AND: [
        {
          startDate: query.endBound ? { lte: new Date(query.endBound) } : undefined,
        },
        {
          endDate: query.startBound ? { gte: new Date(query.startBound) } : undefined,
        },
      ],
      eventVisibilityStatus: requestFromUserOwner ? undefined : 'PUBLIC',
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

  const formattedEvents = events.map((event) => ({
    id: event.id,
    name: event.name,
    displayAddress: formatDisplayAddress([event.street, event.city, event.country, event.postCode]) || null,
    participantsCount: event._count.eventParticipants || null,
    startDate: event.startDate ? event.startDate.toISOString() : null,
    endDate: event.endDate ? event.endDate.toISOString() : null,
    latitude: event.latitude ? Number(event.latitude) : null,
    longitude: event.longitude ? Number(event.longitude) : null,
    bannerImage: event.bannerImage || null,
    visibilityStatus: event.eventVisibilityStatus,
  }));

  const publicEvents = formattedEvents.filter(isPublicEvent);
  const privateEvents = formattedEvents.filter(isPrivateEvent);

  const eventShowcases: EventShowcaseType[] = [...publicEvents, ...privateEvents];

  res.status(200).json(eventShowcases);
};

const getUserGroups = async (req: Request, res: Response) => {
  const session = await getLoginSession(req);
  const userId = req.params.userId;
  console.log('session?.userId', session?.user.userId);
  const requestFromUserOwner = userId === session?.user.userId;

  const userCount = await prisma.user.count({
    where: {
      id: userId,
    },
  });

  if (!userCount) {
    throw new NotFoundError(`User with id ${userId} dose not exists`);
  }

  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
      visibility: requestFromUserOwner ? undefined : 'PUBLIC',
    },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const formattedGroups: GroupShowcaseType[] = groups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    bannerImage: group.bannerImage,
    category: {
      id: group.category.id,
      name: group.category.name,
    },
    groupVisibility: group.visibility,
    membersCount: group._count.members,
  }));

  res.json(formattedGroups);
};

// const searchUser = async (req: Request, res: Response) => {
//   const validation = searchUserSchema.safeParse(req.body);
//
//   if (!validation.success) {
//     const errorMessage = generateErrorMessage(validation.error.issues);
//     throw new ValidationError(errorMessage);
//   }
//
//   const { phrase, limit = 10 } = validation.data;
//
//   const matchingUsers = await prisma.user.findMany({
//     take: limit,
//     where: {
//       name: {
//         search: phrase,
//       },
//     },
//   });
//
//   const formattedUsers: UserType = matchingUsers.map((user) => ({}));
//
//   res.status(200).json(matchingUsers);
// };

const getEventPendingRequest = async (req: Request, res: Response) => {
  const loggedUser = req.userId;
  const userId = req.params.userId;

  const validation = eventUserInvitationSchema.safeParse(req.query);
  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }
  const query = validation.data;

  if (!loggedUser) {
    throw new Error('no userId no req object');
  }

  if (loggedUser !== userId) {
    throw new UnauthenticatedError('You dont have permission to read event invitation');
  }
  const eventPendingRequests = await prisma.eventInvitation.findMany({
    take: query.limit,
    where: {
      userId,
      isAdminAccepted: false,
      isUserAccepted: true,
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

  const formattedPendingRequests: EventInvitationType[] = eventPendingRequests.map((invitation) => ({
    id: invitation.id,
    user: invitation.user,
    event: invitation.event,
    isUserAccepted: invitation.isUserAccepted,
    isAdminAccepted: invitation.isAdminAccepted,
  }));

  res.status(200).json(formattedPendingRequests);
};

const getEventInvitations = async (req: Request, res: Response) => {
  const loggedUser = req.userId;
  const userId = req.params.userId;

  const validation = eventUserInvitationSchema.safeParse(req.query);
  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }
  const query = validation.data;

  if (!loggedUser) {
    throw new Error('no userId no req object');
  }

  if (loggedUser !== userId) {
    throw new UnauthenticatedError('You dont have permission to read event invitation');
  }

  const eventInvitations = await prisma.eventInvitation.findMany({
    take: query.limit,
    where: {
      userId,
      isUserAccepted: false,
      isAdminAccepted: true,
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
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedEventInvitation: EventInvitationType[] = eventInvitations.map((invitation) => ({
    id: invitation.id,
    user: invitation.user,
    event: invitation.event,
    isUserAccepted: invitation.isUserAccepted,
    isAdminAccepted: invitation.isAdminAccepted,
  }));

  res.status(200).json(formattedEventInvitation);
};

const getGroupPendingRequest = async (req: Request, res: Response) => {
  const loggedUser = req.userId;
  const userId = req.params.userId;

  const validation = eventUserInvitationSchema.safeParse(req.query);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }
  const query = validation.data;

  if (!loggedUser) {
    throw new Error('no userId no req object');
  }

  if (loggedUser !== userId) {
    throw new UnauthenticatedError('You dont have permission to read event invitation');
  }
  const groupPendingRequests = await prisma.groupInvitation.findMany({
    take: query.limit,
    where: {
      userId,
      isAdminAccepted: false,
      isUserAccepted: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      group: {
        select: {
          id: true,
          name: true,
          bannerImage: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedPendingRequests: GroupInvitationType[] = groupPendingRequests.map((invitation) => ({
    id: invitation.id,
    user: invitation.user,
    group: invitation.group,
    isUserAccepted: invitation.isUserAccepted,
    isAdminAccepted: invitation.isAdminAccepted,
  }));

  res.status(200).json(formattedPendingRequests);
};

const getGroupInvitations = async (req: Request, res: Response) => {
  const loggedUser = req.userId;
  const userId = req.params.userId;

  const validation = eventUserInvitationSchema.safeParse(req.query);
  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }
  const query = validation.data;

  if (!loggedUser) {
    throw new Error('no userId no req object');
  }

  if (loggedUser !== userId) {
    throw new UnauthenticatedError('You dont have permission to read event invitation');
  }

  const eventInvitations = await prisma.groupInvitation.findMany({
    take: query.limit,
    where: {
      userId,
      isAdminAccepted: true,
      isUserAccepted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      group: {
        select: {
          id: true,
          name: true,
          bannerImage: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log('eventInvitations', eventInvitations);

  const formattedEventInvitation: GroupInvitationType[] = eventInvitations.map((invitation) => ({
    id: invitation.id,
    user: invitation.user,
    group: invitation.group,
    isUserAccepted: invitation.isUserAccepted,
    isAdminAccepted: invitation.isAdminAccepted,
  }));

  res.status(200).json(formattedEventInvitation);
};

export default {
  getUserGroups,
  getById,
  updateUser,
  getUserEvents,
  getEventInvitations,
  getEventPendingRequest,
  getGroupInvitations,
  getGroupPendingRequest,
};
