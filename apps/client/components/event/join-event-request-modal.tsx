import { useCreateEventInvitationMutation } from '../../hooks/mutations/events';
import Button from '../common/button';
import { useRouter } from 'next/router';
import { useUserEventInvitationsQuery } from '../../hooks/query/users';

interface JoinEventRequestModalProps {
  eventId: string;
  userId: string;
}

const JoinEventRequestModal = ({ eventId, userId }: JoinEventRequestModalProps) => {
  const router = useRouter();
  const { mutate: createEventInvitation } = useCreateEventInvitationMutation();
  const { data: userEventInvitations, isSuccess } = useUserEventInvitationsQuery(userId);

  const createJoinEventRequest = () => {
    console.log('createJoinEventRequest');
    createEventInvitation({
      eventId,
      ids: [userId],
    });
  };

  if (!isSuccess) return <div>loading...</div>;

  const isRequestAlreadySent = userEventInvitations.some((invitation) => invitation.event.id === eventId);

  return (
    <div className={'flex bg-white p-10 flex-col items-center mt-10'}>
      <h2 className={'text-xl font-semibold mb-3'}>To wydarzenie jest prywatne.</h2>
      <p className={'mb-10'}>
        {isRequestAlreadySent
          ? 'Prośba o dołączenie została wysłana.'
          : 'Możesz wysłać prośbę o dodanie do wydarzenia.'}
      </p>
      <div className={'flex space-x-3'}>
        {!isRequestAlreadySent && <Button onClick={createJoinEventRequest}>Wyślij</Button>}
        <Button kind={'secondary'} onClick={() => router.replace('/events')}>
          Wróć do wydarzeń
        </Button>
      </div>
    </div>
  );
};

export default JoinEventRequestModal;
