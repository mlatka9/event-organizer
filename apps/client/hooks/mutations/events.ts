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
  console.log('useRemoveParticipantMutation');
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.removeParticipant, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['event', eventId],
      });
    },
  }).mutate;
};

export const useCreateEventInvitationMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.createEventInvitation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user-event-invitations']);
      onSuccess && onSuccess();
    },
  });
};

export const useAcceptEventInvitationMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.acceptEventInvitation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['event-invitations']);
      queryClient.invalidateQueries(['user-event-invitations']);
      onSuccess && onSuccess();
    },
  });
};

export const useDeclineEventInvitationMutation = ({
  eventId,
  onSuccess,
}: {
  onSuccess?: () => void;
  eventId: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.declineEventInvitation, {
    onSuccess: async () => {
      queryClient.invalidateQueries(['event-invitations', eventId]);
      queryClient.invalidateQueries(['user-event-invitations']);
      onSuccess && onSuccess();
    },
  });
};
