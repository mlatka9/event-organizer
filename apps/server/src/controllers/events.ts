import { NextFunction, Request, Response } from 'express';
import { prisma } from '@event-organizer/prisma-client';
import { ValidationError } from '../errors';
import { generateErrorMessage } from 'zod-error';
import { createEventSchema, CreateEventInputType, EventShowcaseType } from '@event-organizer/shared-types';
import { getLoginSession } from '@event-organizer/auth';

const formatDisplayAddress = (fields: (string | null)[]) => fields.filter((field) => field).join(' ');

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
      category: true,
      tags: true,
    },
  });

  if (!event) {
    res.status(400).json({ message: `No event with id ${eventId}` });
    return;
  }

  if (event.eventVisibilityStatus === 'PUBLIC') {
    const formattedEvent = {
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
    };
    res.json(formattedEvent);
  } else {
    res.status(401).json('this event is private');
  }
};

const getAll = async (req: Request, res: Response) => {
  console.log('req.query', req.query);

  const page = (req.query.page as string | undefined) || 1;
  const limit = (req.query.limit as string | undefined) || 10;
  const city = req.query.city as string | undefined;
  const category = req.query.category as string | undefined;
  const visibilityStatus = req.query.visibilityStatus as string | undefined; //private or public
  const locationStatus = req.query.locationStatus as string | undefined; //ONLINE or STATIONARY
  const timeRange = req.query.timeRange as string | undefined;

  console.log('timeRange on server', timeRange);

  if (page < 1) {
    res.status(400).json({ message: 'invalid page number' });
  }

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

  console.log('maxDate', maxDate);

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
      eventVisibilityStatus:
        visibilityStatus === 'PRIVATE' || visibilityStatus === 'PUBLIC' ? visibilityStatus : undefined,
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
      eventVisibilityStatus:
        visibilityStatus === 'PRIVATE' || visibilityStatus === 'PUBLIC' ? visibilityStatus : undefined,
      eventLocationStatus: locationStatus === 'STATIONARY' || locationStatus === 'ONLINE' ? locationStatus : undefined,
    },
    include: {
      _count: {
        select: {
          eventParticipants: true,
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

const getAllCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
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

export default {
  getAll,
  getEventInfo,
  create,
  getAllCategories,
  getNormalizedCities,
};
