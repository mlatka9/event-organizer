import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Nazwa musi miec co najmniej 6 znaków' })
    .max(50, { message: 'Nazwa może mieć cnajwyżej 50 znaków' }),
  description: z
    .string()
    .min(10, { message: 'Opis musi miec co najmniej 10 znaków' })
    .max(200, { message: 'Opis może mieć co najwyżej 200 znaków' }),
  bannerImage: z.string().optional(),
  categoryId: z.string().min(1, { message: 'Kategoria jest wymagana' }),
  groupVisibility: z.enum(['PRIVATE', 'PUBLIC']),
});

export const updateGroupSchema = createGroupSchema.omit({ bannerImage: true }).extend({
  bannerImage: z.string().nullable(),
});

export const getAllGroupsQueryParamsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.preprocess((val) => val && Number(val), z.number().positive().optional()),
  name: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
});

export const createGroupInvitationSchema = z.object({
  ids: z.array(z.string()),
});

export const shareEventSchema = z.object({
  eventId: z.string().min(1, 'eventId is required'),
});

export const getGroupMessagesQueryParamsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.preprocess((val) => val && Number(val), z.number().positive().optional()),
});

export const createGroupMessageSchema = z.object({
  content: z.string(),
});
