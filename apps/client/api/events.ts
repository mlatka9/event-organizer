import api from '../lib/api';
import { CreateEventInputType } from '@event-organizer/shared-types';

const createEvent = async (registerData: CreateEventInputType) => {
  const { data } = await api.post('/auth/events', registerData);
  return data;
};

const eventsAPI = {
  createEvent,
};

export default eventsAPI;
