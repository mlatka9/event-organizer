import { CategoryType } from './category-types';
import { z } from 'zod';
import { updateUserSchema } from '../schemas';

export interface UserType {
  joinedAt: string;
  image: string | null;
  id: string;
  name: string;
  favouriteCategories: CategoryType[];
  isMe: boolean;
}

export type UpdateUserInputType = z.infer<typeof updateUserSchema>;
