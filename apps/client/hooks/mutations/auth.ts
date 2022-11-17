import { useMutation, useQueryClient } from '@tanstack/react-query';
import authAPI from '../../api/auth';
import { AxiosError } from 'axios';
import { APIError } from '../../api/types';

interface UseRegisterMutationProps {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}

export const useRegisterMutation = ({ onError, onSuccess }: UseRegisterMutationProps) => {
  return useMutation(authAPI.register, {
    onSuccess,
    onError,
  }).mutate;
};

interface UseLoginMutationProps {
  onSuccess?: () => void;
  onError?: (error: APIError) => void;
}

export const useLoginMutation = ({ onError, onSuccess }: UseLoginMutationProps) => {
  return useMutation(authAPI.login, {
    onSuccess,
    onError,
  }).mutate;
};

export const useLogoutMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(authAPI.logout, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['me']);
      if (onSuccess) {
        onSuccess();
      }
    },
  }).mutate;
};
