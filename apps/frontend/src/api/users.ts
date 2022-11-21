import {
  EventInvitationType,
  EventShowcaseType,
  UpdateUserInputType,
  UserProfileType,
} from '@event-organizer/shared-types';
import api from '../libs/api/api';

const getUser = async (id: string): Promise<UserProfileType> => {
  const { data } = await api.get(`/users/${id}`, {
    withCredentials: true,
  });
  return data;
};

const updateUser = async (updateUserData: UpdateUserInputType & { userId: string }) => {
  const { data } = await api.patch(`/users/${updateUserData.userId}`, updateUserData, {
    withCredentials: true,
  });
  return data;
};

const getUserEvents = async (userId: string): Promise<EventShowcaseType[]> => {
  const { data } = await api.get(`/users/${userId}/events`, {
    withCredentials: true,
  });
  return data;
};

const getUserEventInvitations = async (userId: string): Promise<EventInvitationType[]> => {
  const { data } = await api.get(`/users/${userId}/event-invitations`, {
    withCredentials: true,
  });
  return data;
};

const userAPI = { getUser, updateUser, getUserEvents, getUserEventInvitations };

export default userAPI;
