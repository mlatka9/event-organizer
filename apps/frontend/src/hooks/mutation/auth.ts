import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import authAPI from '../../api/auth';

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
