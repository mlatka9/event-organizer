import api from '../lib/api';
import {
  CreateEventInputType,
  CreateEventInvitationInputType,
  EventDetailsType,
  EventInvitationType,
  EventParticipant,
  EventShowcaseType,
  GetAllEventsInputType,
  SearchUserToEventInvitationInputType,
  UserType,
} from '@event-organizer/shared-types';

const createEvent = async (registerData: CreateEventInputType) => {
  const { data } = await api.post('/events', registerData, {
    withCredentials: true,
  });
  return data;
};

const getEventInfo = async (id: string): Promise<EventDetailsType> => {
  const { data } = await api.get(`/events/${id}`, {
    withCredentials: true,
  });
  return data;
};

const getEvents = async (
  args: GetAllEventsInputType
): Promise<{ events: EventShowcaseType[]; currentPage: number; pageCount: number }> => {
  const { data } = await api.get('/events', {
    withCredentials: true,
    params: {
      page: args.page,
      category: args.category,
      city: args.city,
      locationStatus: args.locationStatus,
      timeRange: args.timeRange,
    },
  });
  return data;
};

const getNormalizedCities = async (search: string): Promise<{ id: string; name: string }[]> => {
  const { data } = await api.get('/events/normalized-cities', {
    params: {
      search,
    },
  });
  return data;
};

const addParticipant = async ({ userId, eventId }: { eventId: string; userId: string }) => {
  await api.post(`/events/${eventId}/user/${userId}`, null, {
    withCredentials: true,
  });
};

const removeParticipant = async ({ userId, eventId }: { eventId: string; userId: string }) => {
  await api.delete(`/events/${eventId}/user/${userId}`, {
    withCredentials: true,
  });
};

const getAllEventInvitation = async (eventId: string): Promise<EventInvitationType[]> => {
  const { data } = await api.get(`/events/${eventId}/invitation`, {
    withCredentials: true,
  });
  return data;
};

const createEventInvitation = async ({ ids, eventId }: CreateEventInvitationInputType & { eventId: string }) => {
  const { data } = await api.post(
    `/events/${eventId}/invitation`,
    { ids },
    {
      withCredentials: true,
    }
  );
  return data;
};

const getAllParticipants = async (eventId: string): Promise<EventParticipant[]> => {
  const { data } = await api.get(`/events/${eventId}/users`, {
    withCredentials: true,
  });
  return data;
};

const searchUsersToInvite = async ({
  eventId,
  limit,
  phrase,
}: SearchUserToEventInvitationInputType & {
  eventId: string;
}): Promise<UserType[]> => {
  const { data } = await api.post(
    `/events/${eventId}/invitation/search-users`,
    { limit, phrase },
    {
      withCredentials: true,
    }
  );
  return data;
};

const acceptEventInvitation = async ({ eventId, invitationId }: { eventId: string; invitationId: string }) => {
  const { data } = await api.post(`/events/${eventId}/invitation/${invitationId}/accept`, null, {
    withCredentials: true,
  });

  return data;
};

const declineEventInvitation = async ({ eventId, invitationId }: { eventId: string; invitationId: string }) => {
  const { data } = await api.delete(`/events/${eventId}/invitation/${invitationId}`, {
    withCredentials: true,
  });

  return data;
};

const eventsAPI = {
  createEventInvitation,
  removeParticipant,
  addParticipant,
  createEvent,
  getEvents,
  getEventInfo,
  getNormalizedCities,
  getAllEventInvitation,
  getAllParticipants,
  searchUsersToInvite,
  acceptEventInvitation,
  declineEventInvitation,
};

export default eventsAPI;
