import EventLayout from '../../../components/layouts/event-layout';
import { useEventInfoQuery, useGetAllParticipantsQuery } from '../../../hooks/query/events';
import { useRouter } from 'next/router';
import EventParticipantCard from '../../../components/user/event-participant-card';
import EventAdminSettings from '../../../components/event/event-admin-settings';

const EventParticipantsPage = () => {
  const router = useRouter();
  const eventId = router.query.eventId as string;
  const { data: participants, isSuccess: isParticipantsSuccess } = useGetAllParticipantsQuery(eventId, router.isReady);
  const { data: eventData, isSuccess: isEventSuccess } = useEventInfoQuery(eventId, router.isReady);

  if (!isParticipantsSuccess || !isEventSuccess) return <EventLayout>loading</EventLayout>;

  return (
    <EventLayout>
      <div className={'flex justify-between'}>
        <div className={'mb-10'}>
          <h2 className={'font-semibold text-lg'}>Uczestnicy wydarzenia</h2>
        </div>
        {eventData.isCurrentUserAdmin && <EventAdminSettings eventId={eventId} />}
      </div>
      <ul className={'px-10 py-5 flex flex-col space-y-3 bg-white rounded-md shadow-md'}>
        {isParticipantsSuccess &&
          participants.map((p) => (
            <EventParticipantCard
              key={p.id}
              id={p.id}
              name={p.name}
              image={p.image || '/images/avatar-fallback.svg'}
              role={p.role}
            />
          ))}
        <li></li>
      </ul>
    </EventLayout>
  );
};

export default EventParticipantsPage;
