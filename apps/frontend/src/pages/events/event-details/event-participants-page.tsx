import { useEventInfoQuery, useGetAllParticipantsQuery } from '../../../hooks/query/events';
import EventParticipantCard from './event-participant-card';
import { useParams } from 'react-router-dom';
import EventAdminSettings from './event-admin-settings';

const EventParticipantsPage = () => {
  const params = useParams();
  const eventId = params['id'] as string;

  const { data: participants, isSuccess: isParticipantsSuccess } = useGetAllParticipantsQuery(eventId);
  const { data: eventData, isSuccess: isEventSuccess } = useEventInfoQuery(eventId);

  if (!isParticipantsSuccess || !isEventSuccess) return <div>'participants loading...'</div>;

  return (
    <div className={'pb-20'}>
      <div className={'flex justify-between'}>
        <div className={'mb-10'}>
          <h2 className={'font-semibold text-lg'}>Uczestnicy wydarzenia</h2>
        </div>
        {eventData.isCurrentUserAdmin && <EventAdminSettings eventId={eventId} />}
      </div>
      <ul className={'px-10 py-5 flex flex-col space-y-3 bg-white rounded-md shadow-md'}>
        {isParticipantsSuccess &&
          participants.map((p) => (
            <EventParticipantCard key={p.id} id={p.id} name={p.name} image={p.image} role={p.role} />
          ))}
      </ul>
    </div>
  );
};

export default EventParticipantsPage;
