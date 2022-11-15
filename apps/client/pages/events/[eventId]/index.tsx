import { useRouter } from 'next/router';
import { useEventInfoQuery } from '../../../hooks/query/events';
import MainLayout from '../../../components/layouts/main-layout';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import CalendarIcon from '../../../components/icons/calendar-icon';
import ClockIcon from '../../../components/icons/clock-icon';
import UserIcon from '../../../components/icons/user-icon';
import EventLayout from '../../../components/layouts/event-layout';

const MapWithNoSSR = dynamic(() => import('../../../components/map'), {
  ssr: false,
});

const EventDetailsPage = () => {
  const router = useRouter();
  const eventId = router.query.eventId as string;

  const { data: eventData, isSuccess, isError, error } = useEventInfoQuery(eventId, router.isReady);

  if (isError && error?.response?.status === 401) {
    return <MainLayout>no right to see</MainLayout>;
  }

  if (isError && error?.response?.status === 400) {
    return <MainLayout>no event with id</MainLayout>;
  }

  if (!isSuccess) return <>loading...</>;

  return (
    <EventLayout>
      <div className={'grid grid-cols-[3fr_2fr]'}>
        <div className={'h-[1000px]'}>main content</div>
        <div className={'space-y-5'}>
          <div className={'rounded-2xl shadow-lg bg-white'}>
            <div className={'px-3 py-5'}>
              <h2 className={'text-xl font-semibold '}>Lokalizacja</h2>
              <p className={'text-neutral-600 text-sm'}>{eventData.displayAddress}</p>
            </div>
            {eventData.latitude && eventData.longitude && (
              <MapWithNoSSR
                mapHeight={'300px'}
                markers={[{ id: eventData.id, longitude: eventData.longitude, latitude: eventData.latitude }]}
              />
            )}
          </div>
          <div className={'rounded-2xl shadow-lg bg-white'}>
            <div className={'px-3 py-5'}>
              <h2 className={'text-xl font-semibold '}>Termin</h2>
            </div>
            <hr />
            <div className={'grid grid-cols-2 py-8'}>
              <div className={'flex justify-center items-center'}>
                <CalendarIcon width={40} height={40} />
                <p className={'text-xl ml-3'}>{dayjs(eventData.startDate).format('DD-MM-YYYY')}</p>
              </div>
              <div className={'flex justify-center items-center'}>
                <ClockIcon width={40} height={40} />
                <p className={'text-xl ml-3'}>{dayjs(eventData.startDate).format('HH:mm')}</p>
              </div>
            </div>
          </div>
          <div className={'rounded-2xl shadow-lg bg-white'}>
            <div className={'px-3 py-5'}>
              <h2 className={'text-xl font-semibold '}>Uczestnicy</h2>
            </div>
            <hr />
            <div className={'flex justify-center items-center py-8'}>
              <UserIcon width={40} height={40} />
              <div className={'ml-3'}>
                <p className={'text-center font-bold'}>{eventData.participantsCount}</p>
                <p className={'ml-3'}>weźmie udział</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EventLayout>
  );
};

export default EventDetailsPage;
