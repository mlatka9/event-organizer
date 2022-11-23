import { Link, NavLink, Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useEventInfoQuery } from '../hooks/query/events';
import { useAddParticipantMutation, useRemoveParticipantMutation } from '../hooks/mutation/events';
import JoinEventRequestModal from '../pages/events/event-details/join-event-request-modal';
import Button from '../components/common/button';
import Header from '../components/common/header';
import { EventDetailsType } from '@event-organizer/shared-types';

const EventLayout = () => {
  const params = useParams();
  const { user } = useAuth();

  const eventId = params['id'] as string;

  const { data: event, isError, error, isSuccess: isEventSuccess } = useEventInfoQuery(eventId);

  const addParticipant = useAddParticipantMutation(eventId);
  const removeParticipant = useRemoveParticipantMutation(eventId);

  const handleAddParticipant = () => {
    if (!user?.userId) return;
    addParticipant({ userId: user.userId, eventId });
  };

  const handleRemoveParticipant = () => {
    if (!user?.userId) return;
    removeParticipant({ userId: user.userId, eventId });
  };

  if (isError && error?.response?.status === 401) {
    if (user) {
      return <JoinEventRequestModal eventId={eventId} userId={user.userId} />;
    } else {
      return <div>Wydarzenie jest prywatne musisz się zalogowac</div>;
    }
  }

  if (isError && error?.response?.status === 400) {
    return <div>Błąd! Wydarzenie nie istnieje</div>;
  }

  if (!isEventSuccess) return <div>'loading ...'</div>;

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-[1000px] pt-[80px]">
        <div className={'rounded-b-xl bg-white shadow-md mb-10'}>
          {event.bannerImage && <img src={event.bannerImage} className={'w-full h-[300px] object-cover'} />}
          <div className={'px-10 py-5'}>
            <div className={'flex w-full items-center mb-3'}>
              {event.tags.length > 0 && (
                <div className={'flex space-x-3'}>
                  {event.tags.map((tag) => (
                    <div className={'text-sm bg-neutral-100 px-2 py-1 rounded-md'} key={tag}>
                      {tag}
                    </div>
                  ))}
                </div>
              )}
              <div className={'ml-auto text-blue-800 bg-blue-100 px-4 py-2 rounded-md font-semibold'}>
                {event.categoryName}
              </div>
            </div>
            <div className={'flex'}>
              <div>
                <h1 className={'text-4xl font-semibold mb-3'}>{event.name}</h1>
                <p className={'text-lg text-neutral-600'}>{event.description}</p>
              </div>
              <div className={'ml-auto'}>
                {event.isCurrentUserParticipant && !event.isCurrentUserAdmin && (
                  <Button className={'ml-auto'} onClick={handleRemoveParticipant}>
                    Opuść wydarzenie
                  </Button>
                )}
                {!event.isCurrentUserParticipant && (
                  <Button onClick={handleAddParticipant} className={'ml-auto'}>
                    Dołącz
                  </Button>
                )}
              </div>
            </div>
            <div className={'bg-white space-x-10 mt-20 font-semibold text-gray-700'}>
              <NavLink to={`/events/${eventId}`} className={({ isActive }) => (isActive ? 'text-blue-500' : '')} end>
                Strona główna
              </NavLink>
              <NavLink
                to={`/events/${eventId}/participants`}
                className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
                end
              >
                Uczestnicy
              </NavLink>
              {event.isCurrentUserAdmin && (
                <NavLink
                  to={`/events/${eventId}/settings`}
                  className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
                  end
                >
                  Ustawienia
                </NavLink>
              )}
            </div>
          </div>
        </div>
        <Outlet context={{ event }} />
      </main>
    </div>
  );
};

type ContextType = { event: EventDetailsType };

export const useEventDetails = () => {
  return useOutletContext<ContextType>();
};

export default EventLayout;
