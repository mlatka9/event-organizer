import {
  CreateEventInvitationInputType,
  CreateGroupInputType,
  EventInvitationType,
  GetAllGroupsQueryParamsType,
  GetAllGroupsReturnType,
  GroupDetailsType,
  GroupInvitationType,
  GroupMember,
  SearchUserToEventInvitationInputType,
  SharedEventType,
  UserType,
} from '@event-organizer/shared-types';
import api from '../libs/api/api';

const createGroup = async (groupData: CreateGroupInputType): Promise<{ id: string }> => {
  const { data } = await api.post('/groups', groupData, {
    withCredentials: true,
  });
  return data;
};

const getGroups = async (params: GetAllGroupsQueryParamsType): Promise<GetAllGroupsReturnType> => {
  const { data } = await api.get('/groups', {
    params,
    withCredentials: true,
  });
  return data;
};

const getGroupDetails = async (groupId: string): Promise<GroupDetailsType> => {
  const { data } = await api.get(`/groups/${groupId}`, {
    withCredentials: true,
  });
  return data;
};

const joinGroup = async ({ groupId, userId }: { groupId: string; userId: string }) => {
  const { data } = await api.post(`/groups/${groupId}/users/${userId}`, null, {
    withCredentials: true,
  });
  return data;
};

const leaveGroup = async ({ groupId, userId }: { groupId: string; userId: string }) => {
  const { data } = await api.delete(`/groups/${groupId}/users/${userId}`, {
    withCredentials: true,
  });
  return data;
};

const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  const { data } = await api.get(`/groups/${groupId}/users`, {
    withCredentials: true,
  });
  return data;
};

const acceptGroupInvitation = async ({ groupId, invitationId }: { groupId: string; invitationId: string }) => {
  const { data } = await api.post(`/groups/${groupId}/invitations/${invitationId}/accept`, null, {
    withCredentials: true,
  });

  return data;
};

const declineGroupInvitation = async ({ groupId, invitationId }: { groupId: string; invitationId: string }) => {
  const { data } = await api.delete(`/groups/${groupId}/invitations/${invitationId}`, {
    withCredentials: true,
  });

  return data;
};

const createGroupInvitation = async ({ ids, groupId }: CreateEventInvitationInputType & { groupId: string }) => {
  const { data } = await api.post(
    `/groups/${groupId}/invitations`,
    { ids },
    {
      withCredentials: true,
    }
  );
  return data;
};

const searchUsersToGroupInvite = async ({
  groupId,
  limit,
  phrase,
}: SearchUserToEventInvitationInputType & {
  groupId: string;
}): Promise<UserType[]> => {
  const { data } = await api.post(
    `/groups/${groupId}/invitations/search-users`,
    { limit, phrase },
    {
      withCredentials: true,
    }
  );
  return data;
};

const getAllGroupInvitation = async (groupId: string): Promise<GroupInvitationType[]> => {
  const { data } = await api.get(`/groups/${groupId}/invitations`, {
    withCredentials: true,
  });
  return data;
};

const getSharedEvents = async (groupId: string): Promise<SharedEventType[]> => {
  const { data } = await api.get(`/groups/${groupId}/shared-events`, {
    withCredentials: true,
  });
  return data;
};

const shareEvent = async ({ eventId, groupId }: { groupId: string; eventId: string }) => {
  const { data } = await api.post(
    `/groups/${groupId}/shared-events`,
    { eventId },
    {
      withCredentials: true,
    }
  );
  return data;
};

const groupsAPI = {
  leaveGroup,
  joinGroup,
  getGroupDetails,
  createGroup,
  getGroups,
  getGroupMembers,
  acceptGroupInvitation,
  declineGroupInvitation,
  createGroupInvitation,
  searchUsersToGroupInvite,
  getAllGroupInvitation,
  getSharedEvents,
  shareEvent,
};

export default groupsAPI;
