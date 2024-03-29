import { useEventInfoQuery } from '../../../hooks/query/events';
import CalendarIcon from '../../../components/icons/calendar-icon';
import ClockIcon from '../../../components/icons/clock-icon';
import UserIcon from '../../../components/icons/user-icon';
import { useParams } from 'react-router-dom';
import Map from '../../../components/map';
import dayjs from 'dayjs';
import EventDatePoll from './event-date-poll/event-date.poll';
import { EventChat } from './event-chat';
import { EventPrepareList } from '../event-prepare-list';
import clsx from 'clsx';

const EventDetailsPage = () => {
  const params = useParams();
  const eventId = params['id'] as string;

  const { data: eventData, isSuccess } = useEventInfoQuery(eventId);

  if (!isSuccess) return <div>'loading details ....'</div>;

  const showLayoutWithModules =
    eventData.isCurrentUserParticipant &&
    (eventData.isDatePollEnabled || eventData.isEventChatEnabled || eventData.isEventPrepareListEnabled);

  return (
    <div className={clsx(showLayoutWithModules && 'grid lg:grid-cols-[3fr_2fr] gap-10')}>
      <div className={'space-y-5'}>
        {eventData.isCurrentUserParticipant && eventData.isEventChatEnabled && <EventChat eventId={eventId} />}
        {eventData.isCurrentUserParticipant && eventData.isDatePollEnabled && <EventDatePoll eventId={eventId} />}
        {eventData.isCurrentUserParticipant && eventData.isEventPrepareListEnabled && <EventPrepareList />}
      </div>
      <div className={'space-y-5 row-start-1 lg:col-start-2'}>
        <div className={'rounded-2xl shadow-md bg-white'}>
          <div className={'p-3'}>
            <h2 className={'text-lg font-semibold '}>Lokalizacja</h2>
            <p className={'text-neutral-600 text-sm'}>
              {eventData.eventLocationStatus === 'ONLINE' ? 'online' : eventData.displayAddress}
            </p>
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
          {eventData.endDate && eventData.endDate !== eventData.startDate && (
            <div className={'grid grid-cols-2 py-6 px-3'}>
              <div className={'flex justify-center items-center'}>
                <CalendarIcon width={35} height={35} />
                <p className={'text-lg ml-3'}>{dayjs(eventData.endDate).format('DD MMMM YYYY')}</p>
              </div>
              <div className={'flex justify-center items-center'}>
                <ClockIcon width={35} height={35} />
                <p className={'text-lg ml-3'}>{dayjs(eventData.endDate).format('HH:mm')}</p>
              </div>
            </div>
          )}
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
