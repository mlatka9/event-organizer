import { z } from 'zod';
import {
  createEventInvitationSchema,
  createEventSchema,
  getAllEventsSchema,
  searchGroupsToShareEventSchema,
  searchUserToEventInvitationSchema,
} from '../schemas';
import { EventRole } from '@prisma/client';

export type CreateEventInputType = z.infer<typeof createEventSchema>;
export type GetAllEventsInputType = z.infer<typeof getAllEventsSchema>;
export type CreateEventInvitationInputType = z.infer<typeof createEventInvitationSchema>;
export type SearchUserToEventInvitationInputType = z.infer<typeof searchUserToEventInvitationSchema>;
export type SearchGroupsToShareEventInputType = z.infer<typeof searchGroupsToShareEventSchema>;

export interface PrivateEventType {
  id: string;
  name: string;
  bannerImage: string | null;
  visibilityStatus: 'PRIVATE';
  locationStatus: 'STATIONARY' | 'ONLINE';
  displayAddress: null;
  participantsCount: null;
  startDate: null;
  endDate: null;
  latitude: null;
  longitude: null;
}

export interface PublicEventType {
  id: string;
  name: string;
  bannerImage: string | null;
  visibilityStatus: 'PUBLIC';
  locationStatus: 'STATIONARY' | 'ONLINE';
  displayAddress: string | null;
  participantsCount: number | null;
  startDate: string | null;
  endDate: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface SharedEventType {
  id: string;
  name: string;
  bannerImage: string | null;
  displayAddress: string | null;
  participantsCount: number | null;
  startDate: string | null;
  sharedBy: { id: string; name: string; image: string | null }[];
}

export type EventShowcaseType = PublicEventType | PrivateEventType;

export interface EventDetailsType {
  id: string;
  name: string;
  description: string;
  displayAddress?: string;
  participantsCount: number;
  startDate?: string;
  endDate?: string;
  latitude?: number;
  longitude?: number;
  bannerImage?: string;
  categoryName: string;
  categoryId: string;
  isCurrentUserParticipant: boolean;
  isCurrentUserAdmin: boolean;
  street?: string;
  city?: string;
  country?: string;
  postCode?: string;
  tags: string[];
  eventVisibilityStatus: 'PRIVATE' | 'PUBLIC';
  eventLocationStatus: 'STATIONARY' | 'ONLINE';
}

export interface EventInvitationType {
  id: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  event: {
    id: string;
    name: string;
    bannerImage: string | null;
  };
  isUserAccepted: boolean;
  isAdminAccepted: boolean;
}

export interface GroupInvitationType {
  id: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  group: {
    id: string;
    name: string;
    bannerImage: string | null;
  };
  isUserAccepted: boolean;
  isAdminAccepted: boolean;
}

export type EventParticipantRole = EventRole;

export interface EventParticipant {
  id: string;
  name: string;
  image: string | null;
  role: EventParticipantRole;
}
