import { useMutation } from '@tanstack/react-query';
import authAPI from '../../api/auth';
import { APIError } from '../../libs/api/types';

interface UseRegisterMutationProps {
  onSuccess?: () => void;
  onError?: (error: APIError) => void;
}

export const useRegisterMutation = ({ onError, onSuccess }: UseRegisterMutationProps) => {
  return useMutation(authAPI.register, {
    onSuccess,
    onError,
  }).mutate;
};
