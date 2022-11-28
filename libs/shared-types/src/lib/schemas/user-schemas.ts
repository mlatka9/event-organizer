import { z } from 'zod';
import { isISODate } from '../utils';

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nazwa musi składać się z conajmniej 3 znaków' })
    .max(20, { message: 'Nazwa może składać się z co najwyżej 20 znaków' })
    .optional(),
  image: z.string().optional(),
  favouriteCategories: z.array(z.string()).optional(),
});

export const eventUserInvitationSchema = z.object({
  limit: z.preprocess((val) => val && Number(val), z.number().min(1).optional()),
});

export const searchUserToEventInvitationSchema = z.object({
  phrase: z.string().optional(),
  limit: z.preprocess((val) => val && Number(val), z.number()).optional(),
});

export const userEventsSchema = z
  .object({
    endBound: z
      .string()
      .refine((date) => (date ? isISODate(date) : true), {
        message: 'Nieprawidłowy format daty.',
      })
      .optional(),
    startBound: z
      .string()
      .refine((date) => (date ? isISODate(date) : true), { message: 'Nieprawidłowy format daty' })
      .optional(),
  })
  .refine(
    (data) =>
      data.endBound && data.startBound
        ? data.startBound && new Date(data.endBound).valueOf() > new Date(data.startBound).valueOf()
        : true,
    {
      message: 'Data końca musi być po dacie startu',
      path: ['endDate'],
    }
  );
