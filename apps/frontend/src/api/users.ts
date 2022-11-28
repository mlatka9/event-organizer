import {
  EventInvitationType,
  EventShowcaseType,
  GroupInvitationType,
  GroupShowcaseType,
  UpdateUserInputType,
  UserEventsInputType,
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

const getUserEvents = async ({
  userId,
  ...params
}: UserEventsInputType & { userId?: string }): Promise<EventShowcaseType[]> => {
  const { data } = await api.get(`/users/${userId}/events`, {
    params,
    withCredentials: true,
  });
  return data;
};

const getUserGroups = async (userId: string): Promise<GroupShowcaseType[]> => {
  const { data } = await api.get(`/users/${userId}/groups`, {
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

const getUserGroupInvitations = async ({
  userId,
  limit,
}: {
  userId: string;
  limit?: number;
}): Promise<GroupInvitationType[]> => {
  const { data } = await api.get(`/users/${userId}/group-invitations`, {
    params: {
      limit,
    },
    withCredentials: true,
  });
  return data;
};

const getUserEventInvitations = async ({
  userId,
  limit,
}: {
  userId: string;
  limit?: number;
}): Promise<EventInvitationType[]> => {
  const { data } = await api.get(`/users/${userId}/event-invitations`, {
    params: {
      limit,
    },
    withCredentials: true,
  });
  return data;
};

const getUserGroupPendingRequests = async ({
  userId,
  limit,
}: {
  userId: string;
  limit?: number;
}): Promise<GroupInvitationType[]> => {
  const { data } = await api.get(`/users/${userId}/group-pending-requests`, {
    params: {
      limit,
    },
    withCredentials: true,
  });
  return data;
};

const userAPI = {
  getUser,
  updateUser,
  getUserEvents,
  getUserGroups,
  getUserEventInvitations,
  getUserEventPendingRequests,
  getUserGroupPendingRequests,
  getUserGroupInvitations,
};

export default userAPI;
