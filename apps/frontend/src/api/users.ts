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

interface getUserEventInvitationsType {
  userId: string;
  limit?: number;
}
const getUserEventInvitations = async ({
  userId,
  limit,
}: getUserEventInvitationsType): Promise<EventInvitationType[]> => {
  const { data } = await api.get(`/users/${userId}/event-invitations`, {
    params: {
      limit,
    },
    withCredentials: true,
  });
  return data;
};

interface GetUserEventPendingRequestsType {
  userId: string;
  limit?: number;
}
const getUserEventPendingRequests = async ({
  userId,
  limit,
}: GetUserEventPendingRequestsType): Promise<EventInvitationType[]> => {
  const { data } = await api.get(`/users/${userId}/event-pending-requests`, {
    params: {
      limit,
    },
    withCredentials: true,
  });
  return data;
};

const userAPI = { getUser, updateUser, getUserEvents, getUserEventInvitations, getUserEventPendingRequests };

export default userAPI;
