import { useMutation } from '@tanstack/react-query';
import eventsAPI from '../../api/events';

export const useCreateEventMutation = (onSuccess?: () => void) => {
  return useMutation(eventsAPI.createEvent, {
    onSuccess,
  }).mutate;
};
