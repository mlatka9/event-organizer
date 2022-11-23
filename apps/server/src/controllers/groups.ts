import { Request, Response } from 'express';
import {
  createGroupSchema,
  getAllGroupsQueryParamsSchema,
  GetAllGroupsReturnType,
  GroupShowcaseType,
} from '@event-organizer/shared-types';
import { ValidationError } from '../errors';
import { generateErrorMessage } from 'zod-error';
import { prisma } from '@event-organizer/prisma-client';
import { Prisma } from '@prisma/client';
import { ConflictError } from '../errors/conflict';

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
      },
    });

    res.json(createdGroup);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictError(`There is already group with name ${body.name}`);
    }
    throw err;
  }
};

export default {
  getAllGroups,
  createGroup,
};
