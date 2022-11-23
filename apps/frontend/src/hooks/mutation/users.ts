import { useMutation, useQueryClient } from '@tanstack/react-query';
import usersAPI from '../../api/users';
import { APIError } from '../../libs/api/types';

interface UseUpdateUserMutationProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: APIError) => void;
}

export const useUpdateUserMutation = ({ userId, onSuccess, onError }: UseUpdateUserMutationProps) => {
  const queryClient = useQueryClient();
  return useMutation(usersAPI.updateUser, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user', userId],
      });
      onSuccess && onSuccess();
    },
    onError,
  });
};
