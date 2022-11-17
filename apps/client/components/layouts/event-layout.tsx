import { ReactNode } from 'react';
import Header from '../common/header';
import Button from '../common/button';
import { useAddParticipantMutation, useRemoveParticipantMutation } from '../../hooks/mutations/events';
import { useEventInfoQuery } from '../../hooks/query/events';
import { useMeQuery } from '../../hooks/query/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from './main-layout';
import JoinEventRequestModal from '../event/join-event-request-modal';

interface MainLayoutProps {
  children?: ReactNode;
}

const EventLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const eventId = router.query.eventId as string;

  const { data: meData } = useMeQuery();
  const { data: eventData, isError, error } = useEventInfoQuery(eventId, router.isReady);

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

  if (isError && error?.response?.status === 401) {
    if (meData) {
      return (
        <MainLayout>
          <JoinEventRequestModal eventId={eventId} userId={meData.userId} />
        </MainLayout>
      );
    } else {
      return <MainLayout>{'Wydarzenie jest prywatne musisz się zalogowac'}</MainLayout>;
    }
  }

  if (isError && error?.response?.status === 400) {
    return <MainLayout>no event with id</MainLayout>;
  }

  if (eventData) {
    return (
      <div>
        <Header />
        <main className="mx-auto max-w-[1000px] pt-[80px]">
          <div className={'rounded-b-xl bg-white shadow-lg mb-10'}>
            {eventData.bannerImage && <img src={eventData.bannerImage} className={'w-full h-[300px] object-cover'} />}
            <div className={'px-10 py-5'}>
              <div className={'flex'}>
                <div>
                  <h1 className={'text-4xl font-semibold mb-3'}>{eventData.name}</h1>
                  <p className={'text-lg text-neutral-600'}>{eventData.description}</p>
                </div>
                <div className={'ml-auto'}>
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
              </div>
              <div className={'bg-white space-x-5 mt-10'}>
                <Link href={`/events/${eventId}`}>Strona główna</Link>
                <Link href={`/events/${eventId}/participants`}>Uczestnicy</Link>
                {eventData.isCurrentUserAdmin && <Link href={`/events/${eventId}/settings`}>Ustawienia</Link>}
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    );
  }

  return <MainLayout>Loading</MainLayout>;
};

export default EventLayout;
