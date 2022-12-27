import { Request, Response } from 'express';
import {
  createGroupInvitationSchema,
  createGroupMessageSchema,
  createGroupSchema,
  getAllGroupsQueryParamsSchema,
  GetAllGroupsReturnType,
  getGroupMessagesQueryParamsSchema,
  GetGroupMessagesReturnType,
  GroupDetailsType,
  GroupInvitationType,
  GroupMember,
  GroupMessageType,
  GroupShowcaseType,
  searchUserToEventInvitationSchema,
  SharedEventType,
  shareEventSchema,
  UserType,
} from '@event-organizer/shared-types';
import { UnauthenticatedError, ValidationError } from '../errors';
import { generateErrorMessage } from 'zod-error';
import { prisma } from '@event-organizer/prisma-client';
import { Prisma } from '@prisma/client';
import { ConflictError } from '../errors/conflict';
import { NotFoundError } from '../errors/not-found';
import { formatDisplayAddress } from '../lib/format-display-address';
import { getLoginSession } from '@event-organizer/auth';

const getAllGroups = async (req: Request, res: Response) => {
  const validation = getAllGroupsQueryParamsSchema.safeParse(req.query);
  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const {
    data: { name, cursor, limit = 4, visibility },
  } = validation;

  const groups = await prisma.group.findMany({
    take: limit + 1,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
      visibility,
    },
    include: {
      category: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
    orderBy: [
      {
        members: {
          _count: 'desc',
        },
      },
      {
        id: 'asc',
      },
    ],
  });

  const isNextPage = groups.length > limit;
  const groupsToFormat = isNextPage ? groups.slice(0, -1) : groups;
  const nextCursor = isNextPage ? groups[groups.length - 1]?.id : null;

  const formattedGroups: GroupShowcaseType[] = groupsToFormat.map((group) => ({
    id: group.id,
    name: group.name,
    bannerImage: group.bannerImage,
    description: group.description,
    groupVisibility: group.visibility,
    category: {
      id: group.categoryId,
      name: group.category.name,
    },
    membersCount: group._count.members,
  }));

  const result: GetAllGroupsReturnType = {
    groups: formattedGroups,
    cursor: nextCursor,
  };
  res.json(result);
};

const createGroup = async (req: Request, res: Response) => {
  const validation = createGroupSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const { data: body } = validation;

  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('No user in req object');
  }

  try {
    const createdGroup = await prisma.group.create({
      data: {
        name: body.name,
        description: body.description,
        visibility: body.groupVisibility,
        categoryId: body.categoryId,
        bannerImage: body.bannerImage,
        members: {
          create: {
            userId: loggedUserId,
            role: 'ADMIN',
          },
        },
      },
    });

    res.json({ id: createdGroup.id });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictError(`There is already group with name ${body.name}`);
    }
    throw err;
  }
};

const updateGroup = async (req: Request, res: Response) => {
  const groupId = req.params.groupId;
  const validation = createGroupSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const { data: body } = validation;

  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('No user in req object');
  }

  try {
    const createdGroup = await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        name: body.name,
        description: body.description,
        visibility: body.groupVisibility,
        categoryId: body.categoryId,
        bannerImage: body.bannerImage,
      },
    });

    res.json({ id: createdGroup.id });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictError(`There is already group with name ${body.name}`);
    }
    throw err;
  }
};

const getGroupDetails = async (req: Request, res: Response) => {
  const session = await getLoginSession(req);

  const loggedUserId = session?.user.userId;
  const groupId = req.params.groupId;

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      members: {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      eventsShared: {
        select: {
          event: {
            select: {
              id: true,
              name: true,
              bannerImage: true,
              city: true,
              street: true,
              postCode: true,
              country: true,
              startDate: true,
              _count: {
                select: {
                  eventParticipants: true,
                },
              },
              description: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!group) {
    throw new NotFoundError(`Group with id ${groupId} doesn't exists`);
  }

  const member = group.members.find((member) => member.user.id === loggedUserId);

  if (group.visibility === 'PRIVATE' && !member) {
    throw new UnauthenticatedError('You dont have permission to read details about this event');
  }

  const formattedGroupDetails: GroupDetailsType = {
    id: group.id,
    name: group.name,
    bannerImage: group.bannerImage,
    isUserAdmin: member ? member.role === 'ADMIN' : false,
    isUserMember: !!member,
    category: {
      name: group.category.name,
      id: group.category.id,
    },
    groupVisibility: group.visibility,
    description: group.description,
    showcaseMembers: group.members.slice(0, 10).map((member) => ({
      id: member.user.id,
      name: member.user.name,
      image: member.user.image,
    })),
    membersCount: group.members.length,
    showcaseSharedEvents: group.eventsShared.slice(0, 10).map(({ event }) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      image: event.bannerImage,
      participantsCount: event._count.eventParticipants,
      displayAddress: formatDisplayAddress([event.street, event.city, event.postCode, event.country]),
      startDate: event.startDate ? event.startDate.toISOString() : null,
    })),
  };

  res.json(formattedGroupDetails);
};

const addMember = async (req: Request, res: Response) => {
  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('No userId in request object');
  }

  const groupId = req.params.groupId;
  const userId = req.params.userId;

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) {
    throw new Error(`Group with id ${groupId} dont exists`);
  }

  const groupMember = await prisma.usersInGroup.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: loggedUserId,
      },
    },
  });

  if (groupMember && groupMember.userId === userId) {
    throw new ConflictError(`User with id ${userId} is already group member`);
  }

  const isUserEligibleToJoin = loggedUserId === userId;

  if (isUserEligibleToJoin) {
    await prisma.usersInGroup.create({
      data: {
        userId,
        groupId,
      },
    });
    res.status(201).end();
  } else {
    res.status(401).json('You dont have permissions to join this group');
  }
};

const removeMember = async (req: Request, res: Response) => {
  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('No userId in request object');
  }

  const groupId = req.params.groupId;
  const userId = req.params.userId;

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) {
    throw new Error(`Group with id ${groupId} dont exists`);
  }

  const groupMember = await prisma.usersInGroup.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: loggedUserId,
      },
    },
  });

  if (!groupMember) {
    throw new ConflictError(`User with id ${userId} is not group member`);
  }

  const isUserEligibleToJoin = loggedUserId === userId;

  if (isUserEligibleToJoin) {
    await prisma.usersInGroup.delete({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
    res.status(200).json('User successfully left group');
  } else {
    res.status(401).json('You dont have permissions to leave this group');
  }
};

const getGroupMembers = async (req: Request, res: Response) => {
  // const loggedUserId = req.userId;
  // if (!loggedUserId) {
  //   throw new Error('No userId in req object');
  // }

  const groupId = req.params.groupId;

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) {
    throw new ValidationError(`No group with id ${groupId}`);
  }

  const members = await prisma.usersInGroup.findMany({
    where: {
      groupId,
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

  const formattedMembers: GroupMember[] = members.map((member) => ({
    id: member.user.id,
    name: member.user.name,
    image: member.user.image,
    role: member.role,
  }));

  res.json(formattedMembers);
};

const createGroupInvitation = async (req: Request, res: Response) => {
  const groupId = req.params.groupId as string;
  const loggedUserId = req.userId;

  const validation = createGroupInvitationSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const { ids } = validation.data;

  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  if (ids.length === 0) {
    throw new ValidationError('userId is required');
  }

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      members: {
        select: {
          role: true,
          userId: true,
        },
      },
    },
  });

  if (!group) {
    throw new NotFoundError(`Event with id ${groupId} dose not exists`);
  }

  const usersAlreadyGroupMember = group.members.filter((user) => ids.includes(user.userId));

  if (usersAlreadyGroupMember.length) {
    throw new ValidationError(
      `Users with ids: ${usersAlreadyGroupMember
        .map((u) => u.userId)
        .join(', ')} is already member in group with id ${groupId}`
    );
  }

  const adminsIds = group.members.filter((user) => user.role === 'ADMIN').map((user) => user.userId);
  const isLoggedUserAdmin = adminsIds.includes(loggedUserId);

  if (isLoggedUserAdmin || (ids.length === 1 && loggedUserId === ids[0])) {
    await prisma.groupInvitation.createMany({
      data: ids.map((id) => ({
        groupId,
        userId: id,
        isUserAccepted: !adminsIds.includes(loggedUserId),
        isAdminAccepted: adminsIds.includes(loggedUserId),
      })),
    });

    res.status(201).end();
    return;
  }
  throw new UnauthenticatedError('You dont have permissions to create group invitation');
};

const acceptGroupInvitation = async (req: Request, res: Response) => {
  const groupId = req.params.groupId;
  const invitationId = req.params.invitationId;

  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  const invitation = await prisma.groupInvitation.findUnique({
    where: {
      id: invitationId,
    },
  });

  const groupAdmins = await prisma.usersInGroup.findMany({
    where: {
      groupId,
      role: 'ADMIN',
    },
  });

  const groupAdminsIds = groupAdmins.map((admin) => admin.userId);

  if (!invitation) {
    throw new NotFoundError(`Invitation with id ${invitationId} dose not exists`);
  }

  const isUserEligibleToJoinEvent =
    (invitation.userId === loggedUserId && invitation.isAdminAccepted) ||
    (groupAdminsIds.includes(loggedUserId) && invitation.isUserAccepted);

  if (isUserEligibleToJoinEvent) {
    await prisma.$transaction([
      prisma.usersInGroup.create({
        data: {
          groupId,
          userId: invitation.userId,
        },
      }),
      prisma.groupInvitation.delete({
        where: {
          id: invitationId,
        },
      }),
    ]);

    res.status(201).json({ message: `User with id ${invitation.userId} was added to event with id ${groupId}` });
  }

  throw new UnauthenticatedError('You dont have permission to accept invitation');
};

const declineGroupInvitation = async (req: Request, res: Response) => {
  const groupId = req.params.groupId;
  const invitationId = req.params.invitationId;

  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  const invitation = await prisma.groupInvitation.findUnique({
    where: {
      id: invitationId,
    },
  });

  const groupAdmins = await prisma.usersInGroup.findMany({
    where: {
      groupId,
      role: 'ADMIN',
    },
  });

  const groupAdminsIds = groupAdmins.map((admin) => admin.userId);

  if (!invitation) {
    throw new NotFoundError(`Invitation with id ${invitationId} dose not exists`);
  }

  const isUserEligibleToDeclineInvitation = invitation.userId === loggedUserId || groupAdminsIds.includes(loggedUserId);

  if (isUserEligibleToDeclineInvitation) {
    console.log('REMOVING');
    await prisma.groupInvitation.delete({
      where: {
        id: invitationId,
      },
    });

    res.status(204).end();
  } else {
    throw new UnauthenticatedError('You dont have permission to decline invitation');
  }
};

const searchUsersToGroupInvite = async (req: Request, res: Response) => {
  const loggedUserId = req.userId;

  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  const validation = searchUserToEventInvitationSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const groupId = req.params.groupId;

  const groupCount = await prisma.group.count({
    where: {
      id: groupId,
    },
  });

  if (!groupCount) {
    throw new NotFoundError(`Group with id ${groupId} dose not exists`);
  }

  const { phrase, limit = 10 } = validation.data;

  const matchingUsers = await prisma.user.findMany({
    where: {
      name: {
        contains: phrase,
        mode: 'insensitive',
      },
      groups: {
        none: {
          groupId,
          user: {
            name: {
              contains: phrase,
              mode: 'insensitive',
            },
          },
        },
      },
      pendingGroupInvitations: {
        none: {
          groupId,
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

const getAllGroupInvitation = async (req: Request, res: Response) => {
  const groupId = req.params.groupId as string;
  const loggedUserId = req.userId;

  if (!loggedUserId) {
    throw new Error('No userId in req object');
  }

  const isLoggedUserEligible = await prisma.usersInGroup.count({
    where: {
      groupId,
      userId: loggedUserId,
      role: 'ADMIN',
    },
  });

  if (!isLoggedUserEligible) {
    throw new UnauthenticatedError(`You dont have permission to read invitation for group with id ${groupId}`);
  }

  const groupInvitations = await prisma.groupInvitation.findMany({
    where: {
      groupId,
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
      group: {
        select: {
          id: true,
          name: true,
          bannerImage: true,
        },
      },
    },
  });

  const formattedGroupInvitation: GroupInvitationType[] = groupInvitations.map((invitation) => ({
    id: invitation.id,
    user: invitation.user,
    group: invitation.group,
    isUserAccepted: invitation.isUserAccepted,
    isAdminAccepted: invitation.isAdminAccepted,
  }));

  res.status(200).json(formattedGroupInvitation);
};

const shareEvent = async (req: Request, res: Response) => {
  const loggedUser = req.userId;
  const groupId = req.params.groupId;
  if (!loggedUser) {
    throw new Error('No user id in req object');
  }

  const validation = shareEventSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const { data: body } = validation;

  const user = await prisma.user.findUnique({
    where: {
      id: loggedUser,
    },
  });

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  const event = await prisma.event.findUnique({
    where: {
      id: body.eventId,
    },
  });

  if (!user) {
    throw new ValidationError(`User with id ${loggedUser} dont exists`);
  }

  if (!event) {
    throw new ValidationError(`Event with id ${body.eventId} dont exists`);
  }

  if (!group) {
    throw new ValidationError(`Group with id ${groupId} dont exists`);
  }

  if (event.eventVisibilityStatus === 'PRIVATE') {
    throw new ValidationError('You cant share private events on groups');
  }

  await prisma.eventSharedInGroup.create({
    data: {
      groupId,
      eventId: body.eventId,
      userId: loggedUser,
    },
  });

  res.status(201).end();
};

const getAllSharedEvents = async (req: Request, res: Response) => {
  const groupId = req.params.groupId;

  const sharedEvents = await prisma.eventSharedInGroup.findMany({
    where: {
      groupId,
      event: {
        eventVisibilityStatus: 'PUBLIC',
      },
    },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          category: true,
          bannerImage: true,
          eventVisibilityStatus: true,
          latitude: true,
          longitude: true,
          startDate: true,
          country: true,
          postCode: true,
          city: true,
          street: true,
          _count: {
            select: {
              eventParticipants: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const formattedSharedEvents = sharedEvents.map(({ event, user }) => ({
    id: event.id,
    name: event.name,
    bannerImage: event.bannerImage,
    startDate: event.startDate ? event.startDate.toISOString() : null,
    displayAddress: formatDisplayAddress([event.street, event.city, event.postCode, event.country]),
    participantsCount: event._count.eventParticipants,
    sharedBy: { name: user.name, id: user.id, image: user.image },
  }));

  const temp: Record<
    string,
    { sharedBy: { id: string; name: string; image: string | null }[]; eventData: Omit<SharedEventType, 'sharedBy'> }
  > = {};

  formattedSharedEvents.forEach((event) => {
    if (temp[event.id]) {
      temp[event.id].sharedBy.push(event.sharedBy);
    } else {
      temp[event.id] = { sharedBy: [event.sharedBy], eventData: event };
    }
  });

  const result: SharedEventType[] = Object.entries(temp).map(([_, value]) => ({
    ...value.eventData,
    sharedBy: value.sharedBy,
  }));

  res.json(result);
};

const getGroupMessages = async (req: Request, res: Response) => {
  const groupId = req.params.groupId;

  const groupCount = await prisma.group.count({
    where: {
      id: groupId,
    },
  });

  if (!groupCount) {
    throw new ValidationError(`No group with id ${groupId}`);
  }

  const validation = getGroupMessagesQueryParamsSchema.safeParse(req.query);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const { limit = 10, cursor } = validation.data;

  const messages = await prisma.groupMessage.findMany({
    take: limit + 1,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    where: {
      groupId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });

  const isNextPage = messages.length > limit;
  const messagesToFormat = isNextPage ? messages.slice(0, -1) : messages;
  const nextCursor = isNextPage ? messages[messages.length - 1]?.id : null;

  const formattedMessages: GroupMessageType[] = messagesToFormat.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: new Date(m.createdAt).toISOString(),
    author: {
      id: m.author.id,
      name: m.author.name,
      image: m.author.image,
    },
  }));

  const result: GetGroupMessagesReturnType = {
    messages: formattedMessages,
    cursor: nextCursor,
  };

  res.json(result);
};

const createGroupMessage = async (req: Request, res: Response) => {
  const loggedUserId = req.userId;
  if (!loggedUserId) {
    throw new Error('no userId in req object');
  }
  const groupId = req.params.groupId;

  const groupCount = await prisma.group.count({
    where: {
      id: groupId,
    },
  });

  if (!groupCount) {
    throw new ValidationError(`No group with id ${groupId}`);
  }

  const validation = createGroupMessageSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const { content } = validation.data;

  const message = await prisma.groupMessage.create({
    data: {
      groupId,
      content,
      authorId: loggedUserId,
    },
  });

  res.status(201).json(message);
};

export default {
  getGroupMembers,
  getGroupDetails,
  getAllGroups,
  createGroup,
  removeMember,
  addMember,
  createGroupInvitation,
  acceptGroupInvitation,
  declineGroupInvitation,
  searchUsersToGroupInvite,
  getAllGroupInvitation,
  shareEvent,
  getAllSharedEvents,
  getGroupMessages,
  createGroupMessage,
  updateGroup,
};
