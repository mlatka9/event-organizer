import { useMutation, useQueryClient } from '@tanstack/react-query';
import eventsAPI from '../../api/events';

export const useCreateEventMutation = (onSuccess?: () => void) => {
  return useMutation(eventsAPI.createEvent, {
    onSuccess,
  }).mutate;
};

export const useAddParticipantMutation = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.addParticipant, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['event', eventId],
      });
    },
  }).mutate;
};

export const useRemoveParticipantMutation = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.removeParticipant, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['event', eventId],
      });
    },
  }).mutate;
};
