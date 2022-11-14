import api from '../lib/api';
import { CreateEventInputType, EventShowcaseType } from '@event-organizer/shared-types';
import { CategoryType } from '@event-organizer/shared-types';

const createEvent = async (registerData: CreateEventInputType) => {
  const { data } = await api.post('/events', registerData, {
    withCredentials: true,
  });
  return data;
};

const getEventInfo = async (id: string): Promise<EventShowcaseType> => {
  const { data } = await api.get(`/events/${id}`);
  return data;
};

const getEvents = async (args: {
  page?: number;
  city?: string;
  locationStatus?: string;
  visibilityStatus?: string;
  category?: string;
  timeRange?: string;
}): Promise<{ events: EventShowcaseType[]; currentPage: number; pageCount: number }> => {
  const { data } = await api.get('/events', {
    withCredentials: true,
    params: {
      page: args.page,
      category: args.category,
      city: args.city,
      locationStatus: args.locationStatus,
      visibilityStatus: args.visibilityStatus,
      timeRange: args.timeRange,
    },
  });
  return data;
};

const getCategories = async (): Promise<CategoryType[]> => {
  const { data } = await api.get('/events/categories');
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

const eventsAPI = {
  createEvent,
  getEvents,
  getEventInfo,
  getCategories,
  getNormalizedCities,
};

export default eventsAPI;
