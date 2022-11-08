import { useMutation, useQueryClient } from '@tanstack/react-query';
import authAPI from '../../api/user';

export const useRegisterMutation = (onSuccess?: () => void) => {
  return useMutation(authAPI.register, {
    onSuccess,
  }).mutate;
};

export const useLoginMutation = (onSuccess?: () => void) => {
  return useMutation(authAPI.login, {
    onSuccess,
  }).mutate;
};

export const useLogoutMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(authAPI.logout, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      if (onSuccess) {
        onSuccess();
      }
    },
  }).mutate;
};
