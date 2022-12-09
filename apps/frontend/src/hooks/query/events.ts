import { useQuery } from '@tanstack/react-query';
import eventsAPI from '../../api/events';
import {
  EventDetailsType,
  GetAllEventsInputType,
  SearchGroupsToShareEventInputType,
  SearchUserToEventInvitationInputType,
} from '@event-organizer/shared-types';
import { APIError } from '../../libs/api/types';

export const useEventsQuery = ({
  enabled = true,
  page,
  city,
  category,
  locationStatus,
  timeRange,
}: GetAllEventsInputType & { enabled: boolean }) => {
  return useQuery(
    ['events', page, city, locationStatus, timeRange, category],
    () => eventsAPI.getEvents({ page, city, locationStatus, timeRange, category }),
    {
      enabled,
      keepPreviousData: true,
    }
  );
};

export const useEventInfoQuery = (id: string, enabled = true) => {
  return useQuery<EventDetailsType, APIError>(['event', id], () => eventsAPI.getEventInfo(id), {
    enabled,
    retry: false,
  });
};

export const useAllEventInvitationQuery = (eventId: string, enabled = true) => {
  return useQuery(['event-invitations', eventId], () => eventsAPI.getAllEventInvitation(eventId), {
    enabled,
    retry: false,
  });
};

export const useGetAllParticipantsQuery = (eventId: string, enabled = true) => {
  return useQuery(['event-participants', eventId], () => eventsAPI.getAllParticipants(eventId), {
    enabled,
    retry: false,
  });
};

export const useSearchUsersToInviteQuery = ({
  enabled = true,
  eventId,
  phrase,
  limit,
}: SearchUserToEventInvitationInputType & {
  eventId: string;
  enabled?: boolean;
}) => {
  return useQuery(['UsersToInvite', eventId, phrase], () => eventsAPI.searchUsersToInvite({ eventId, phrase, limit }), {
    enabled,
    retry: false,
  });
};

export const useGroupsToShareEventQuery = ({
  phrase,
  limit,
  eventId,
}: SearchGroupsToShareEventInputType & { eventId: string }) => {
  return useQuery(
    ['groups-to-share', eventId, phrase],
    () => eventsAPI.getGroupsToShareEvent({ eventId, phrase, limit }),
    {
      retry: false,
    }
  );
};

export const useGetEventDatePoll = ({ eventId, enabled = true }: { eventId: string; enabled?: boolean }) => {
  return useQuery(['event-date-poll', eventId], () => eventsAPI.getEventDatePoll({ eventId }), {
    retry: false,
    enabled,
  });
};
