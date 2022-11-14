import { useMutation, useQueryClient } from '@tanstack/react-query';
import usersAPI from '../../api/user';

interface UseUpdateUserMutationProps {
  userId: string;
  onSuccess?: () => void;
}

export const useUpdateUserMutation = ({ userId, onSuccess }: UseUpdateUserMutationProps) => {
  const queryClient = useQueryClient();
  return useMutation(usersAPI.updateUser, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user', userId],
      });
      onSuccess && onSuccess();
    },
  }).mutate;
};

// export const useCreateEventMutation = (onSuccess?: () => void) => {
//   return useMutation({
//     mutationFn: usersAPI.updateUser
//   }).mutate;
// };
