import { useMutation, useQueryClient } from '@tanstack/react-query';
import groupsAPI from '../../api/groups';
import { APIError } from '../../libs/api/types';

interface UseCreateGroupMutationArgs {
  onSuccess?: (data: { id: string }) => void;
  onError?: (error: APIError) => void;
}
const useCreateGroupMutation = ({ onError, onSuccess }: UseCreateGroupMutationArgs = {}) => {
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

export default useCreateGroupMutation;
