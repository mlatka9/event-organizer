import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@event-organizer/prisma-client';
import { ValidationError } from '../errors';
import { generateErrorMessage } from 'zod-error';
import { createEventSchema, CreateEventInputType } from '@event-organizer/shared-types';

const create = async (req: Request, res: Response, next: NextFunction) => {
  const validation = createEventSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }
  const body: CreateEventInputType = req.body;
  await prisma.event.create({
    data: {
      name: body.name,
      description: body.description,
      street: body.street,
      city: body.city,
      country: body.country,
      postCode: body.postCode,
      startDate: body.startDate,
      longitude: body.longitude,
      latitude: body.latitude,
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

const getAll = async (req: Request, res: Response) => {
  const events = await prisma.event.findMany();

  res.status(200).json(events);
};

export default {
  getAll,
  create,
};
