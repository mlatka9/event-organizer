import ModalWrapper from '../../../components/common/modal-wrapper';
import GroupSentInvitationCard from './group-sent-invitation-card';
import GroupInvitationToAcceptCard from './group-invitation-to-accept-card';
import { useAllGroupInvitationQuery } from '../../../hooks/query/groups';

interface EventPendingInvitationsModalProps {
  handleCloseModal: () => void;
  groupId: string;
}

const GroupPendingInvitationsModal = ({ handleCloseModal, groupId }: EventPendingInvitationsModalProps) => {
  const { data: invitations, isSuccess } = useAllGroupInvitationQuery(groupId);

  // if (!isSuccess) return <div>loading</div>;

  const invitationToAccept = isSuccess ? invitations.filter((i) => !i.isAdminAccepted) : [];
  const invitationSent = isSuccess ? invitations.filter((i) => !i.isUserAccepted) : [];

  return (
    <ModalWrapper title={'Oczekujące zaproszenia'} handleCloseModal={handleCloseModal}>
      <div className={'grid grid-cols-2 gap-10 min-h-[500px]'}>
        <div>
          <p className={'font-semibold mb-5'}>Do akceptacji</p>
          <div className={'space-y-3'}>
            {invitationToAccept.map((i) => (
              <GroupInvitationToAcceptCard
                key={i.id}
                image={i.user.image}
                name={i.user.name}
                groupId={i.group.id}
                invitationId={i.id}
              />
            ))}
          </div>
        </div>
        <div>
          <p className={'font-semibold mb-5'}>Wysłane</p>
          <div className={'space-y-3'}>
            {invitationSent.map((i) => (
              <GroupSentInvitationCard
                key={i.id}
                image={i.user.image}
                name={i.user.name}
                groupId={i.group.id}
                invitationId={i.id}
              />
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default GroupPendingInvitationsModal;
