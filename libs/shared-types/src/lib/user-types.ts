import { CategoryType } from './category-types';
import { z } from 'zod';

export interface UserType {
  joinedAt: string;
  image: string | null;
  id: string;
  name: string;
  favouriteCategories: CategoryType[];
  isMe: boolean;
}

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nazwa musi składać się z conajmniej 3 znaków' })
    .max(20, { message: 'Nazwa może składać się z co najwyżej 20 znaków' })
    .optional(),
  image: z.string().url().optional(),
  favouriteCategories: z.array(z.string()).optional(),
});

export type UpdateUserInputType = z.infer<typeof updateUserSchema>;
