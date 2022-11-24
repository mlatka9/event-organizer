import { useMutation, useQueryClient } from '@tanstack/react-query';
import eventsAPI from '../../api/events';

export const useCreateEventMutation = (onSuccess?: (eventData: { eventId: string }) => void) => {
  return useMutation(eventsAPI.createEvent, {
    onSuccess,
  });
};

export const useUpdateEventMutation = (onSuccess?: () => void) => {
  return useMutation(eventsAPI.updateEvent, {
    onSuccess,
  });
};

export const useAddParticipantMutation = (eventId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.addParticipant, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['event', eventId],
      });
      onSuccess && onSuccess();
    },
  });
};

export const useRemoveParticipantMutation = (eventId: string, onSuccess?: () => void) => {
  console.log('useRemoveParticipantMutation');
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.removeParticipant, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['event', eventId],
      });
      onSuccess && onSuccess();
    },
  });
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

export const useDeclineEventInvitationMutation = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.declineEventInvitation, {
    onSuccess: async () => {
      queryClient.invalidateQueries(['event-invitations']);
      queryClient.invalidateQueries(['user-event-invitations']);
      onSuccess && onSuccess();
    },
  });
};
