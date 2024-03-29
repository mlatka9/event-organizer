import { useQuery } from '@tanstack/react-query';
import userAPI from '../../api/users';
import { UserEventsInputType } from '@event-organizer/shared-types';

export const useUserQuery = (id: string, enabled = true) => {
  return useQuery(['user', id], () => userAPI.getUser(id), {
    retry: false,
    enabled,
  });
};

export const useUserEventsQuery = ({
  enabled = true,
  ...data
}: UserEventsInputType & { userId?: string; enabled?: boolean }) => {
  return useQuery(['user-events', data.userId, data.startBound, data.endBound], () => userAPI.getUserEvents(data), {
    retry: false,
    enabled,
  });
};

export const useUserGroupsQuery = (userId: string, enabled = true) => {
  return useQuery(['user-groups', userId], () => userAPI.getUserGroups(userId), {
    retry: false,
    enabled,
  });
};

interface UseUserEventInvitationsQueryType {
  userId: string;
  enabled?: boolean;
  limit?: number;
}

export const useUserEventInvitationsQuery = ({ userId, enabled = true, limit }: UseUserEventInvitationsQueryType) => {
  return useQuery(['user-event-invitations', userId], () => userAPI.getUserEventInvitations({ userId, limit }), {
    retry: false,
    enabled,
  });
};

interface UseUserEventPendingRequestsQueryType {
  userId: string;
  enabled?: boolean;
  limit?: number;
}

export const useUserEventPendingRequestsQuery = ({ userId, enabled, limit }: UseUserEventPendingRequestsQueryType) => {
  return useQuery(
    ['user-event-pending-requests', userId],
    () => userAPI.getUserEventPendingRequests({ userId, limit }),
    {
      retry: false,
      enabled,
    }
  );
};

export const useUserGroupPendingRequestsQuery = ({ userId, enabled, limit }: UseUserEventPendingRequestsQueryType) => {
  return useQuery(
    ['user-group-pending-requests', userId],
    () => userAPI.getUserGroupPendingRequests({ userId, limit }),
    {
      retry: false,
      enabled,
    }
  );
};

export const useUserGroupInvitationsQuery = ({ userId, enabled = true, limit }: UseUserEventInvitationsQueryType) => {
  return useQuery(['user-group-invitations', userId], () => userAPI.getUserGroupInvitations({ userId, limit }), {
    retry: false,
    enabled,
  });
};
