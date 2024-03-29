import { useMutation, useQueryClient } from '@tanstack/react-query';
import groupsAPI from '../../api/groups';
import { APIError } from '../../libs/api/types';

interface UseCreateGroupMutationArgs {
  onSuccess?: (data: { id: string }) => void;
  onError?: (error: APIError) => void;
}
export const useCreateGroupMutation = ({ onError, onSuccess }: UseCreateGroupMutationArgs = {}) => {
  const queryClient = useQueryClient();
  return useMutation(groupsAPI.createGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
      onSuccess && onSuccess(data);
    },
    onError,
  });
};

export const useUpdateGroupMutation = ({ onError, onSuccess }: UseCreateGroupMutationArgs = {}) => {
  const queryClient = useQueryClient();
  return useMutation(groupsAPI.updateGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      onSuccess && onSuccess(data);
    },
    onError,
  });
};

interface useJoinGroupMutationArgs {
  onSuccess?: (data: { id: string }) => void;
  onError?: (error: APIError) => void;
}
export const useJoinGroupMutation = ({ onError, onSuccess }: useJoinGroupMutationArgs = {}) => {
  const queryClient = useQueryClient();
  return useMutation(groupsAPI.joinGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['group-details'],
      });
      onSuccess && onSuccess(data);
    },
    onError,
  });
};

export const useLeaveGroupMutation = ({ onError, onSuccess }: useJoinGroupMutationArgs = {}) => {
  const queryClient = useQueryClient();
  return useMutation(groupsAPI.leaveGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['group-details'],
      });
      onSuccess && onSuccess(data);
    },
    onError,
  });
};

export const useShareEventMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(groupsAPI.shareEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['groups-to-share'],
      });
      onSuccess && onSuccess();
    },
  });
};

export const useCreateGroupMessageMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(groupsAPI.createGroupMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['group-messages']);
      onSuccess && onSuccess();
    },
  });
};
