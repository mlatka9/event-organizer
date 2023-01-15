import { useRemoveDatePollOptionMutation, useUpdateEventTimeMutation } from '../../../../hooks/mutation/events';
import { toast } from 'react-toastify';
import { EventDatePollOptionType } from '@event-organizer/shared-types';
import { useEventDetails } from '../../../../layouts/events-layout';

interface EventDatePollSettingsProps {
  option: EventDatePollOptionType;
  eventDatePollId: string;
  isCurrentlySelected: boolean;
  closeSettingsModal: () => void;
}

const EventDatePollSettings = ({
  option,
  eventDatePollId,
  closeSettingsModal,
  isCurrentlySelected,
}: EventDatePollSettingsProps) => {
  const { event } = useEventDetails();

  const onUpdateEventTimeSuccess = () => {
    toast.success('Ustawiono nową datę wydarzenia');
  };
  const updateEventTime = useUpdateEventTimeMutation(onUpdateEventTimeSuccess);
  const removeDatePollOption = useRemoveDatePollOptionMutation();

  const handleUpdateEventTime = () => {
    closeSettingsModal();
    const tempEndDate = option.endDate || option.startDate;
    updateEventTime.mutate({
      eventId: event.id,
      startDate: option.startDate,
      endDate: tempEndDate,
    });
  };

  const handleRemoveDatePollOption = () => {
    removeDatePollOption.mutate({
      eventId: event.id,
      datePollId: eventDatePollId,
      optionId: option.id,
    });
  };

  return (
    <div className={'absolute top-5 right-0 bg-white rounded-md shadow'}>
      {!isCurrentlySelected && (
        <button
          className={'w-32 text-left hover:bg-blue-50 transition-colors py-2 px-3'}
          onClick={(e) => {
            e.stopPropagation();
            handleUpdateEventTime();
          }}
        >
          wybierz datę
        </button>
      )}

      <button
        className={'w-32 text-left text-red-400  hover:bg-red-50 transition-colors py-2 px-3'}
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveDatePollOption();
        }}
      >
        usuń opcję
      </button>
    </div>
  );
};

export default EventDatePollSettings;
