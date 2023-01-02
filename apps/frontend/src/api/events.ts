import api from '../libs/api/api';
import {
  CreateDatePollOptionInputType,
  CreateEventInputType,
  CreateEventInvitationInputType,
  createGroupMessageInputType,
  EventDatePollType,
  EventDetailsType,
  EventInvitationType,
  EventParticipant,
  EventShowcaseType,
  GetAllEventsInputType,
  GetGroupMessagesQueryParamsType,
  GetGroupMessagesReturnType,
  GroupType,
  SearchGroupsToShareEventInputType,
  SearchUserToEventInvitationInputType,
  ToggleDatePollSchemaInputType,
  UpdateEventTimeInputType,
  UserType,
} from '@event-organizer/shared-types';

const createEvent = async (eventData: CreateEventInputType): Promise<{ eventId: string }> => {
  const { data } = await api.post('/events', eventData, {
    withCredentials: true,
  });
  return data;
};

const updateEvent = async ({ eventId, ...eventData }: CreateEventInputType & { eventId: string }) => {
  const { data } = await api.put(`/events/${eventId}`, eventData, {
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
      limit: 4,
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

const getGroupsToShareEvent = async ({
  eventId,
  ...restData
}: SearchGroupsToShareEventInputType & { eventId: string }): Promise<GroupType[]> => {
  const { data } = await api.post(`/events/${eventId}/shared-events/group-list`, restData, {
    withCredentials: true,
  });
  return data;
};

const createEventDatePoll = async ({ eventId }: { eventId: string }) => {
  const { data } = await api.post(`/events/${eventId}/date-poll`, null, {
    withCredentials: true,
  });
  return data;
};

const hideEventDatePoll = async ({ eventId }: { eventId: string }) => {
  const { data } = await api.delete(`/events/${eventId}/date-poll`, {
    withCredentials: true,
  });
  return data;
};

const createEventChat = async ({ eventId }: { eventId: string }) => {
  const { data } = await api.post(`/events/${eventId}/chat`, null, {
    withCredentials: true,
  });
  return data;
};

const hideEventChat = async ({ eventId }: { eventId: string }) => {
  const { data } = await api.delete(`/events/${eventId}/chat`, {
    withCredentials: true,
  });
  return data;
};

const getEventDatePoll = async ({ eventId }: { eventId: string }): Promise<EventDatePollType> => {
  const { data } = await api.get(`/events/${eventId}/date-poll`, {
    withCredentials: true,
  });
  return data;
};

const toggleDatePollOption = async ({
  eventId,
  datePollId,
  ...optionData
}: ToggleDatePollSchemaInputType & { eventId: string; datePollId: string }) => {
  const { data } = await api.patch(`/events/${eventId}/date-poll/${datePollId}/toggle-select`, optionData, {
    withCredentials: true,
  });
  return data;
};

const createDatePollOption = async ({
  eventId,
  datePollId,
  ...optionData
}: CreateDatePollOptionInputType & { eventId: string; datePollId: string }) => {
  const { data } = await api.post(`/events/${eventId}/date-poll/${datePollId}/create-option`, optionData, {
    withCredentials: true,
  });
  return data;
};

const removeDatePollOption = async ({
  eventId,
  datePollId,
  optionId,
}: ToggleDatePollSchemaInputType & { eventId: string; datePollId: string }) => {
  const { data } = await api.delete(`/events/${eventId}/date-poll/${datePollId}/options/${optionId}`, {
    withCredentials: true,
  });
  return data;
};

const updateEventTime = async ({ eventId, ...eventData }: UpdateEventTimeInputType & { eventId: string }) => {
  const { data } = await api.patch(`/events/${eventId}`, eventData, {
    withCredentials: true,
  });
  return data;
};

const getEventChatMessages = async ({
  eventId,
  ...params
}: GetGroupMessagesQueryParamsType & { eventId: string }): Promise<GetGroupMessagesReturnType> => {
  const { data } = await api.get(`/events/${eventId}/chat/messages`, {
    params,
    withCredentials: true,
  });
  return data;
};

const createEventChatMessage = async ({ content, eventId }: createGroupMessageInputType & { eventId: string }) => {
  const { data } = await api.post(
    `/events/${eventId}/chat/messages`,
    {
      content,
    },
    {
      withCredentials: true,
    }
  );
  return data;
};

const eventsAPI = {
  getEventDatePoll,
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
  updateEvent,
  getGroupsToShareEvent,
  createEventDatePoll,
  hideEventDatePoll,
  toggleDatePollOption,
  createDatePollOption,
  removeDatePollOption,
  updateEventTime,
  createEventChat,
  hideEventChat,
  getEventChatMessages,
  createEventChatMessage,
};

export default eventsAPI;
