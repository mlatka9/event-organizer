import { useQuery } from '@tanstack/react-query';
import userAPI from '../../api/users';

export const useUserQuery = (id: string, enabled = true) => {
  return useQuery(['user', id], () => userAPI.getUser(id), {
    retry: false,
    enabled,
  });
};

export const useUserEventsQuery = (id: string, enabled = true) => {
  return useQuery(['user-events', id], () => userAPI.getUserEvents(id), {
    retry: false,
    enabled,
  });
};

export const useUserEventInvitationsQuery = (userId: string, enabled = true) => {
  return useQuery(['user-event-invitations', userId], () => userAPI.getUserEventInvitations(userId), {
    retry: false,
    enabled,
  });
};
