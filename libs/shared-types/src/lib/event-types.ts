import { z } from 'zod';

const isoDateRegExp = new RegExp(
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
);

export const isISODate = (str: string) => {
  return isoDateRegExp.test(str);
};

export const createEventSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Nazwa musi miec co najmniej 6 znaków' })
    .max(50, { message: 'Nazwa może mieć cnajwyżej 50 znaków' }),
  description: z
    .string()
    .min(10, { message: 'Opis musi miec co najmniej 10 znaków' })
    .max(200, { message: 'Opis może mieć co najwyżej 200 znaków' }),
  street: z.string().max(200, { message: 'Ulica może mieć co najwyżej 200 znaków' }).optional(),
  city: z.string().max(200, { message: 'Miasto może mieć co najwyżej 200 znaków' }).optional(),
  country: z.string().max(200, { message: 'Państwo może mieć co najwyżej 200 znaków' }).optional(),
  postCode: z.string().max(200, { message: 'Kod pocztowy może mieć co najwyżej 10 znaków' }).optional(),
  startDate: z
    .string()
    .refine((date) => (date ? isISODate(date) : true), { message: 'Nieprawidłowy format daty' })
    .optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  tags: z.array(z.string()),
  normalizedCity: z.string().optional(),
  eventVisibilityStatus: z.enum(['PRIVATE', 'PUBLIC']),
  eventLocationStatus: z.enum(['STATIONARY', 'ONLINE']),
  bannerImage: z.string().optional(),
  categoryId: z.string().min(1, { message: 'Kategoria jest wymagana' }),
});

export type CreateEventInputType = z.infer<typeof createEventSchema>;

export interface EventShowcaseType {
  id: string;
  name: string;
  description: string;
  displayAddress?: string;
  participantsCount: number;
  startDate?: string;
  latitude?: number;
  longitude?: number;
  bannerImage?: string;
  categoryName: string;
  categoryId: string;
}
