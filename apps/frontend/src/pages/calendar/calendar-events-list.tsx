import { useUserEventsQuery } from '../../hooks/query/users';
import { useAuth } from '../../hooks/use-auth';
import dayjs from 'dayjs';
import EventList from './event-list';
import CloseIcon from '../../components/icons/close-icon';

interface CalendarEventsListProps {
  selectedDate?: string;
  unselectDate: () => void;
}

const CalendarEventsList = ({ selectedDate, unselectDate }: CalendarEventsListProps) => {
  const { user, isLoading } = useAuth();

  const endBound = selectedDate
    ? dayjs(selectedDate).add(1, 'day').subtract(1, 'millisecond').toISOString()
    : undefined;

  const { data, isSuccess } = useUserEventsQuery({
    userId: user?.userId,
    enabled: !isLoading && !!selectedDate,
    startBound: selectedDate,
    endBound,
  });

  return (
    <div className={'p-5'}>
      <div className={'flex justify-between'}>
        <h2 className={'text-xl font-semibold text-neutral-800'}>Wydarzenia w których bierzesz udział</h2>
        <button onClick={unselectDate}>
          <CloseIcon />
        </button>
      </div>
      <p className={'text-md font-semibold text-neutral-500 mb-10'}>{dayjs(selectedDate).format('DD MMMM YYYY')}</p>
      <div className={'flex flex-col space-y-3'}>
        {isLoading || !isSuccess ? <div>loading...</div> : <EventList events={data} />}
      </div>
    </div>
  );
};

export default CalendarEventsList;
