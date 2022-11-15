import { z } from 'zod';
import { createEventSchema, getAllEventsSchema } from '../schemas';

export type CreateEventInputType = z.infer<typeof createEventSchema>;
export type GetAllEventsInputType = z.infer<typeof getAllEventsSchema>;

export interface EventShowcaseType {
  id: string;
  name: string;
  displayAddress?: string;
  participantsCount: number;
  startDate?: string;
  latitude?: number;
  longitude?: number;
  bannerImage?: string;
}

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
  };
  event: {
    id: string;
    name: string;
  };
  isUserAccepted: boolean;
  isAdminAccepted: boolean;
}
