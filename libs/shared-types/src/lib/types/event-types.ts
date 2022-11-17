import { z } from 'zod';
import {
  createEventInvitationSchema,
  createEventSchema,
  getAllEventsSchema,
  searchUserToEventInvitationSchema,
} from '../schemas';
import { EventRole, EventVisibilityStatus } from '@prisma/client';

export type CreateEventInputType = z.infer<typeof createEventSchema>;
export type GetAllEventsInputType = z.infer<typeof getAllEventsSchema>;
export type CreateEventInvitationInputType = z.infer<typeof createEventInvitationSchema>;
export type SearchUserToEventInvitationInputType = z.infer<typeof searchUserToEventInvitationSchema>;

export interface PrivateEventType {
  id: string;
  name: string;
  bannerImage: string | null;
  visibilityStatus: 'PRIVATE';
  displayAddress: null;
  participantsCount: null;
  startDate: null;
  latitude: null;
  longitude: null;
}

export interface PublicEventType {
  id: string;
  name: string;
  bannerImage: string | null;
  visibilityStatus: 'PUBLIC';
  displayAddress: string | null;
  participantsCount: number | null;
  startDate: string | null;
  latitude: number | null;
  longitude: number | null;
}

export type EventShowcaseType = PublicEventType | PrivateEventType;

export interface EventDetailsType {
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
  isCurrentUserParticipant: boolean;
  isCurrentUserAdmin: boolean;
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

export type EventParticipantRole = EventRole;

export interface EventParticipant {
  id: string;
  name: string;
  image: string | null;
  role: EventParticipantRole;
}
