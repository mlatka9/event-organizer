import { z } from 'zod';
import {
  createGroupMessageSchema,
  createGroupSchema,
  getAllGroupsQueryParamsSchema,
  getGroupMessagesQueryParamsSchema,
  shareEventSchema,
  updateGroupSchema,
} from '../schemas/groups';

export type CreateGroupInputType = z.infer<typeof createGroupSchema>;
export type UpdateGroupSchemaType = z.infer<typeof updateGroupSchema>;

export type GetAllGroupsQueryParamsType = z.infer<typeof getAllGroupsQueryParamsSchema>;
export type ShareEventInputType = z.infer<typeof shareEventSchema>;
export type GetGroupMessagesQueryParamsType = z.infer<typeof getGroupMessagesQueryParamsSchema>;
export type createGroupMessageInputType = z.infer<typeof createGroupMessageSchema>;

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

export interface GroupType {
  id: string;
  name: string;
  bannerImage: string | null;
}

export interface GetAllGroupsReturnType {
  groups: GroupShowcaseType[];
  cursor: string | null;
}

export interface GroupMessageType {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface GetGroupMessagesReturnType {
  messages: GroupMessageType[];
  cursor: string | null;
}

export interface GroupDetailsType {
  id: string;
  name: string;
  description: string;
  bannerImage: string | null;
  isUserMember: boolean;
  isUserAdmin: boolean;
  category: {
    name: string;
    id: string;
  };
  groupVisibility: 'PUBLIC' | 'PRIVATE';
  membersCount: number;
  showcaseMembers: {
    id: string;
    name: string;
    image: string | null;
  }[];
  showcaseSharedEvents: {
    id: string;
    name: string;
    description: string;
    image: string | null;
    displayAddress: string | null;
    participantsCount: number;
    startDate: string | null;
  }[];
}

export interface GroupMember {
  id: string;
  name: string;
  image: string | null;
  role: 'ADMIN' | 'USER';
}
