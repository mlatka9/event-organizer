import { Request, Response } from 'express';
import { prisma } from '@event-organizer/prisma-client';
import { NotFoundError } from '../errors/not-found';
import { getLoginSession } from '@event-organizer/auth';
import { EventShowcaseType, UpdateUserInputType, updateUserSchema, UserType } from '@event-organizer/shared-types';
import { UnauthenticatedError, ValidationError } from '../errors';
import { generateErrorMessage } from 'zod-error';
import { formatDisplayAddress } from '../lib/format-display-address';

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

  const formattedUser: UserType = {
    image: user.image,
    id: user.id,
    name: user.name,
    favouriteCategories: user.favouriteCategories.map((c) => c.category),
    isMe: session?.userId === user.id,
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
  const userId = req.params.userId;

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

  const formattedEvents: EventShowcaseType[] = events.map((event) => ({
    id: event.id,
    name: event.name,
    displayAddress: formatDisplayAddress([event.street, event.city, event.country, event.postCode]),
    participantsCount: event._count.eventParticipants,
    startDate: event.startDate ? event.startDate.toISOString() : undefined,
    latitude: event.latitude ? Number(event.latitude) : undefined,
    longitude: event.longitude ? Number(event.longitude) : undefined,
    bannerImage: event.bannerImage || undefined,
  }));

  console.log('formattedEvents', formattedEvents);

  res.status(200).json(formattedEvents);
};

export default {
  getById,
  updateUser,
  getUserEvents,
};
