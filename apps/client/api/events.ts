import api from '../lib/api';
import {
  CreateEventInputType,
  EventDetailsType,
  EventShowcaseType,
  GetAllEventsInputType,
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

const eventsAPI = {
  removeParticipant,
  addParticipant,
  createEvent,
  getEvents,
  getEventInfo,

  getNormalizedCities,
};

export default eventsAPI;
