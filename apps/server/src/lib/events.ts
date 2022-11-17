import { PrivateEventType, PublicEventType } from '@event-organizer/shared-types';

export const isPrivateEvent = (event: { visibilityStatus: 'PUBLIC' | 'PRIVATE' }): event is PrivateEventType => {
  return event.visibilityStatus === 'PRIVATE';
};

export const isPublicEvent = (event: { visibilityStatus: 'PUBLIC' | 'PRIVATE' }): event is PublicEventType => {
  return event.visibilityStatus === 'PUBLIC';
};
