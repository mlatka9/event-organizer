import { CategoryType } from './category-types';
import { z } from 'zod';
import { updateUserSchema } from '../schemas';

export interface UserProfileType {
  joinedAt: string;
  image: string | null;
  id: string;
  name: string;
  favouriteCategories: CategoryType[];
  isMe: boolean;
}

export interface UserType {
  image: string | null;
  id: string;
  name: string;
}

export type UpdateUserInputType = z.infer<typeof updateUserSchema>;
