import { z } from 'zod';
import { createGroupSchema, getAllGroupsQueryParamsSchema } from '../schemas/groups';

export type CreateGroupInputType = z.infer<typeof createGroupSchema>;
export type GetAllGroupsQueryParamsType = z.infer<typeof getAllGroupsQueryParamsSchema>;

export interface GroupShowcaseType {
  id: string;
  name: string;
  description: string;
  bannerImage: string | null;
  category: {
    name: string;
    id: string;
  };
  groupVisibility: 'PUBLIC' | 'PRIVATE';
  membersCount: number;
}

export interface GetAllGroupsReturnType {
  groups: GroupShowcaseType[];
  cursor: string | null;
}
