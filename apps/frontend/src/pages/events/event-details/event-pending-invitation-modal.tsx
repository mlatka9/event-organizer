import ModalWrapper from '../../../components/common/modal-wrapper';
import InvitationToAcceptCard from './invitation-to-accept-card';
import SentInvitationCard from './sent-invitation-card';
import { useAllEventInvitationQuery } from '../../../hooks/query/events';

interface EventPendingInvitationsModalProps {
  handleCloseModal: () => void;
  eventId: string;
}

const EventPendingInvitationsModal = ({ handleCloseModal, eventId }: EventPendingInvitationsModalProps) => {
  const { data: invitations, isSuccess } = useAllEventInvitationQuery(eventId);

  if (!isSuccess) return <div>loading</div>;

  const invitationToAccept = invitations.filter((i) => !i.isAdminAccepted);
  const invitationSent = invitations.filter((i) => !i.isUserAccepted);

  // const handleAcceptInvitation = () => {};

  return (
    <ModalWrapper title={'Oczekujące zaproszenia'} handleCloseModal={handleCloseModal}>
      <div className={'grid grid-cols-2 gap-10 min-h-[500px]'}>
        <div>
          <p className={'font-semibold mb-5'}>Do akceptacji</p>
          <div className={'space-y-3'}>
            {invitationToAccept.map((i) => (
              <InvitationToAcceptCard
                key={i.id}
                image={i.user.image}
                name={i.user.name}
                eventId={eventId}
                invitationId={i.id}
              />
            ))}
          </div>
        </div>
        <div>
          <p className={'font-semibold mb-5'}>Wysłane</p>
          <div className={'space-y-3'}>
            {invitationSent.map((i) => (
              <SentInvitationCard
                key={i.id}
                image={i.user.image}
                name={i.user.name}
                eventId={i.event.id}
                invitationId={i.id}
              />
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default EventPendingInvitationsModal;
