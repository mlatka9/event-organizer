import { useEventInfoQuery } from '../../../hooks/query/events';
import CalendarIcon from '../../../components/icons/calendar-icon';
import ClockIcon from '../../../components/icons/clock-icon';
import UserIcon from '../../../components/icons/user-icon';
import { useParams } from 'react-router-dom';
import Map from '../../../components/map';
import dayjs from 'dayjs';

const EventDetailsPage = () => {
  const params = useParams();
  const eventId = params['id'] as string;

  const { data: eventData, isSuccess } = useEventInfoQuery(eventId);

  if (!isSuccess) return <div>'loading details ....'</div>;

  return (
    <div className={'grid grid-cols-[3fr_2fr]'}>
      <div className={'h-[1000px]'}>main content</div>
      <div className={'space-y-5'}>
        <div className={'rounded-2xl shadow-md bg-white'}>
          <div className={'p-3'}>
            <h2 className={'text-lg font-semibold '}>Lokalizacja</h2>
            <p className={'text-neutral-600 text-sm'}>{eventData.displayAddress}</p>
          </div>
          {eventData.latitude && eventData.longitude && (
            <Map
              mapHeight={'300px'}
              markers={[{ id: eventData.id, longitude: eventData.longitude, latitude: eventData.latitude }]}
            />
          )}
        </div>
        <div className={'rounded-2xl shadow-md bg-white'}>
          <div className={'p-3'}>
            <h2 className={'text-lg font-semibold '}>Termin</h2>
          </div>
          <hr />
          <div className={'grid grid-cols-2 py-6 px-3'}>
            <div className={'flex justify-center items-center'}>
              <CalendarIcon width={35} height={35} />
              <p className={'text-lg ml-3'}>{dayjs(eventData.startDate).format('DD MMMM YYYY')}</p>
            </div>
            <div className={'flex justify-center items-center'}>
              <ClockIcon width={35} height={35} />
              <p className={'text-lg ml-3'}>{dayjs(eventData.startDate).format('HH:mm')}</p>
            </div>
          </div>
        </div>
        <div className={'rounded-2xl shadow-md bg-white'}>
          <div className={'p-3'}>
            <h2 className={'text-lg font-semibold '}>Uczestnicy</h2>
          </div>
          <hr />
          <div className={'flex justify-center items-center py-6 px-3'}>
            <UserIcon width={35} height={35} />
            <div className={'ml-3'}>
              <p className={'text-center font-bold'}>{eventData.participantsCount}</p>
              <p className={'ml-3'}>weźmie udział</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
