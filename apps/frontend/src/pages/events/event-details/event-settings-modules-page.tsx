import { useEventDetails } from '../../../layouts/events-layout';
import { useCreateEventDatePoll, useDeleteEventDatePoll } from '../../../hooks/mutation/events';
import Button from '../../../components/common/button';
import EventDatePoll from './event-date-poll/event-date.poll';

const EventSettingsModulesPage = () => {
  const { event } = useEventDetails();
  const { mutate: createEventDatePoll, isLoading: isCreateLoading } = useCreateEventDatePoll(event.id);
  const { mutate: deleteEventDatePoll, isLoading: isDeleteLoading } = useDeleteEventDatePoll(event.id);

  console.log('isCreateLoading', isCreateLoading, event.isDatePollEnabled);

  const handleCreateEventDatePoll = () => {
    createEventDatePoll({
      eventId: event.id,
    });
  };

  const handleDeleteEventDatePoll = () => {
    deleteEventDatePoll({
      eventId: event.id,
    });
  };

  return (
    <div className={'min-h-[700px]'}>
      <h2 className={'text-2xl font-semibold mb-10'}>Sekcja z modułami</h2>
      <div className={'flex items-start justify-between'}>
        <div>
          <h3 className={'text-lg text-gray-600 font-semibold'}>Wybieranie wspólnego terminu wydarzenia</h3>
          <p className={'text-sm text-gray-400 '}>Pozwól uczestnikom wybrać najdogodniejszy termin wydarzenia.</p>
        </div>
        {event.isDatePollEnabled ? (
          <Button onClick={handleDeleteEventDatePoll} disabled={isDeleteLoading}>
            Dezaktywuj
          </Button>
        ) : (
          <Button onClick={handleCreateEventDatePoll} disabled={isCreateLoading}>
            Aktywuj
          </Button>
        )}
      </div>

      {event.isDatePollEnabled && (
        <div className={'mt-10'}>
          <EventDatePoll eventId={event.id} />
        </div>
      )}
    </div>
  );
};

export default EventSettingsModulesPage;
