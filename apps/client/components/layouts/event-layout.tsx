import { ReactNode } from 'react';
import Header from '../common/header';
import Button from '../common/button';
import { useAddParticipantMutation, useRemoveParticipantMutation } from '../../hooks/mutations/events';
import { useEventInfoQuery } from '../../hooks/query/events';
import { useMeQuery } from '../../hooks/query/auth';
import { useRouter } from 'next/router';

interface MainLayoutProps {
  children: ReactNode;
}

const EventLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const eventId = router.query.eventId as string;

  const { data: eventData, isSuccess, isError, error } = useEventInfoQuery(eventId, router.isReady);
  const { data: meData, isFetched: isMeFetched } = useMeQuery();

  const addParticipant = useAddParticipantMutation(eventId);
  const removeParticipant = useRemoveParticipantMutation(eventId);

  const handleAddParticipant = () => {
    if (!meData) return;
    addParticipant({ userId: meData.userId, eventId });
  };

  const handleRemoveParticipant = () => {
    if (!meData) return;
    removeParticipant({ userId: meData.userId, eventId });
  };

  if (!isSuccess || !isMeFetched) return <>loading...</>;

  return (
    <div>
      <Header />

      <main className="mx-auto max-w-[1000px] pt-[80px]">
        {eventData.bannerImage && <img src={eventData.bannerImage} className={'w-full h-[300px] object-cover'} />}
        <div className={'mb-5 flex items-start shadow-lg p-10 rounded-b-xl bg-white'}>
          <div>
            <h1 className={'text-4xl font-semibold'}>{eventData.name}</h1>
            <p className={'text-lg text-neutral-600'}>{eventData.description}</p>
          </div>
          {eventData.isCurrentUserAdmin && (
            <Button className={'ml-auto'} onClick={() => router.push(`/events/${eventId}/settings`)}>
              Ustawienia
            </Button>
          )}
          {eventData.isCurrentUserParticipant && !eventData.isCurrentUserAdmin && (
            <Button className={'ml-auto'} onClick={handleRemoveParticipant}>
              Opuść wydarzenie
            </Button>
          )}
          {!eventData.isCurrentUserParticipant && (
            <Button onClick={handleAddParticipant} className={'ml-auto'}>
              Dołącz
            </Button>
          )}
        </div>
        {children}
      </main>
    </div>
  );
};

export default EventLayout;
