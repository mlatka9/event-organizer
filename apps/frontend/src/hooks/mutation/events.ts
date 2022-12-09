import { useMutation, useQueryClient } from '@tanstack/react-query';
import eventsAPI from '../../api/events';
import { EventDatePollType, ToggleDatePollSchemaInputType } from '@event-organizer/shared-types';

export const useCreateEventMutation = (onSuccess?: (eventData: { eventId: string }) => void) => {
  return useMutation(eventsAPI.createEvent, {
    onSuccess,
  });
};

export const useUpdateEventMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.updateEvent, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['event']);
      onSuccess && onSuccess();
    },
  });
};

export const useAddParticipantMutation = (eventId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.addParticipant, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['event', eventId]);
      await queryClient.invalidateQueries(['event-participants']);
      onSuccess && onSuccess();
    },
  });
};

export const useRemoveParticipantMutation = (eventId: string, onSuccess?: () => void) => {
  console.log('useRemoveParticipantMutation');
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.removeParticipant, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['event', eventId]);
      await queryClient.invalidateQueries(['event-participants']);
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

export const useCreateEventDatePoll = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.createEventDatePoll, {
    onSuccess: async () => {
      queryClient.setQueriesData(['event', eventId], (oldData) =>
        oldData
          ? {
              ...oldData,
              isDatePollEnabled: true,
            }
          : oldData
      );
      queryClient.invalidateQueries(['event']);
    },
  });
};

export const useDeleteEventDatePoll = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.hideEventDatePoll, {
    onSuccess: async () => {
      queryClient.setQueriesData(['event', eventId], (oldData) =>
        oldData
          ? {
              ...oldData,
              isDatePollEnabled: false,
            }
          : oldData
      );
      queryClient.invalidateQueries(['event']);
    },
  });
};

export const useToggleDatePollOptionMutation = ({ optionId }: { optionId: string }) => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.toggleDatePollOption, {
    onSuccess: async () => {
      queryClient.setQueriesData<EventDatePollType>(['event-date-poll'], (oldData) =>
        oldData
          ? {
              ...oldData,
              options: oldData.options.map((option) =>
                option.id === optionId ? { ...option, isSelected: !option.isSelected } : option
              ),
            }
          : oldData
      );
      queryClient.invalidateQueries(['event-date-poll']);
    },
  });
};

export const useCreateDatePollOptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.createDatePollOption, {
    onSuccess: async () => {
      // queryClient.setQueriesData<EventDatePollType>(['event-date-poll'], (oldData) =>
      //   oldData
      //     ? {
      //       ...oldData,
      //       options: oldData.options.map((option) =>
      //         option.id === optionId ? { ...option, isSelected: !option.isSelected } : option
      //       ),
      //     }
      //     : oldData
      // );
      queryClient.invalidateQueries(['event-date-poll']);
    },
  });
};
