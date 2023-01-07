import api from '../libs/api/api';
import {
  CreateEventPrepareItemInputType,
  EventPrepareItem,
  ToggleIsItemDoneInputType,
} from '@event-organizer/shared-types';

const createEventPrepareList = async ({ eventId }: { eventId: string }) => {
  const { data } = await api.post(`/events/${eventId}/prepare-list`, null, {
    withCredentials: true,
  });
  return data;
};

const hideEventPrepareList = async ({ eventId }: { eventId: string }) => {
  const { data } = await api.delete(`/events/${eventId}/prepare-list`, {
    withCredentials: true,
  });
  return data;
};

const getEventPrepareListItems = async ({ eventId }: { eventId: string }): Promise<EventPrepareItem[]> => {
  const { data } = await api.get(`/events/${eventId}/prepare-list/items`, {
    withCredentials: true,
  });
  return data;
};

const createEventPrepareListItems = async ({
  eventId,
  ...body
}: CreateEventPrepareItemInputType & { eventId: string }): Promise<EventPrepareItem[]> => {
  const { data } = await api.post(`/events/${eventId}/prepare-list/items`, body, {
    withCredentials: true,
  });
  return data;
};

const deleteEventPrepareListItem = async ({ eventId, itemId }: { eventId: string; itemId: string }) => {
  const { data } = await api.delete(`/events/${eventId}/prepare-list/items/${itemId}`, {
    withCredentials: true,
  });
  return data;
};

const toggleParticipantDeclaration = async ({ eventId, itemId }: { eventId: string; itemId: string }) => {
  const { data } = await api.post(
    `/events/${eventId}/prepare-list/items/${itemId}/participants-declared-toggle`,
    null,
    {
      withCredentials: true,
    }
  );
  return data;
};

const toggleIsItemDone = async ({
  eventId,
  itemId,
  ...body
}: ToggleIsItemDoneInputType & { eventId: string; itemId: string }) => {
  const { data } = await api.post(`/events/${eventId}/prepare-list/items/${itemId}/toggle-is-done`, body, {
    withCredentials: true,
  });
  return data;
};

const eventPrepareListAPI = {
  createEventPrepareList,
  hideEventPrepareList,
  getEventPrepareListItems,
  createEventPrepareListItems,
  deleteEventPrepareListItem,
  toggleParticipantDeclaration,
  toggleIsItemDone,
};

export default eventPrepareListAPI;
