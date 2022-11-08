import { z } from 'zod';

const isoDateRegExp = new RegExp(
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
);

export const isISODate = (str: string) => {
  return isoDateRegExp.test(str);
};

export const createEventSchema = z.object({
  name: z.string(),
  description: z.string().min(6, { message: 'Hasło musi miec co najmniej 6 znaków' }),
  street: z.string(),
  city: z.string(),
  country: z.string(),
  postCode: z.string(),
  startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date ' }).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateEventInputType = z.infer<typeof createEventSchema>;
