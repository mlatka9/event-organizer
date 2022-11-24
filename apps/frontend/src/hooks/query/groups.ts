import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import groupsAPI from '../../api/groups';
import {
  GetAllGroupsQueryParamsType,
  GroupDetailsType,
  SearchUserToEventInvitationInputType,
} from '@event-organizer/shared-types';
import { APIError } from '../../libs/api/types';
import eventsAPI from '../../api/events';

export const useGroupsQuery = ({
  enabled,
  ...filters
}: Omit<GetAllGroupsQueryParamsType, 'cursor'> & { enabled?: boolean } = {}) => {
  return useInfiniteQuery(
    ['groups', filters],
    ({ pageParam }) => {
      return groupsAPI.getGroups({
        ...filters,
        cursor: pageParam,
      });
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      retry: false,
      keepPreviousData: true,
      enabled,
    }
  );
};

interface useGroupDetailsQueryArgs {
  groupId: string;
  enabled?: boolean;
}

export const useGroupDetailsQuery = ({ groupId, enabled = true }: useGroupDetailsQueryArgs) => {
  return useQuery<GroupDetailsType, APIError>(['group-details', groupId], () => groupsAPI.getGroupDetails(groupId), {
    enabled,
    retry: false,
  });
};

export const useGroupMembersQuery = ({ groupId, enabled = true }: useGroupDetailsQueryArgs) => {
  return useQuery(['group-members', groupId], () => groupsAPI.getGroupMembers(groupId), {
    enabled,
    retry: false,
  });
};

export const useCreateGroupInvitationMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(groupsAPI.createGroupInvitation, {
    onSuccess: () => {
      //TODO
      onSuccess && onSuccess();
    },
  });
};

export const useAcceptGroupInvitationMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(groupsAPI.acceptGroupInvitation, {
    onSuccess: () => {
      //TODO
      onSuccess && onSuccess();
    },
  });
};

export const useDeclineGroupInvitationMutation = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation(groupsAPI.declineGroupInvitation, {
    onSuccess: async () => {
      // TODO
      // queryClient.invalidateQueries(['event-invitations', eventId]);
      // queryClient.invalidateQueries(['user-event-invitations']);
      onSuccess && onSuccess();
    },
  });
};

export const useSearchUsersToGroupInviteQuery = ({
  enabled = true,
  groupId,
  phrase,
  limit,
}: SearchUserToEventInvitationInputType & {
  groupId: string;
  enabled?: boolean;
}) => {
  return useQuery(
    ['users-to-group-invite', groupId, phrase],
    () => groupsAPI.searchUsersToGroupInvite({ groupId, phrase, limit }),
    {
      enabled,
      retry: false,
    }
  );
};

export const useAllGroupInvitationQuery = (eventId: string, enabled = true) => {
  return useQuery(['group-invitations', eventId], () => groupsAPI.getAllGroupInvitation(eventId), {
    enabled,
    retry: false,
  });
};

export const useAllGroupSharedEventsQuery = (groupId: string, enabled = true) => {
  return useQuery(['group-shared-events', groupId], () => groupsAPI.getSharedEvents(groupId), {
    enabled,
    retry: false,
  });
};
