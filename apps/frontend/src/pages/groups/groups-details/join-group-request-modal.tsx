import Button from '../../../components/common/button';
import { useUserGroupInvitationsQuery, useUserGroupPendingRequestsQuery } from '../../../hooks/query/users';
import { useNavigate } from 'react-router-dom';
import { useCreateGroupInvitationMutation } from '../../../hooks/query/groups';

interface JoinGroupRequestModalProps {
  groupId: string;
  userId: string;
}

const JoinGroupRequestModal = ({ groupId, userId }: JoinGroupRequestModalProps) => {
  const navigate = useNavigate();
  const { mutate: createGroupInvitation } = useCreateGroupInvitationMutation();
  const { data: userGroupInvitations, isSuccess } = useUserGroupPendingRequestsQuery({ userId });

  console.log('userGroupInvitations', userGroupInvitations);

  const createJoinGroupRequest = () => {
    console.log('createJoinEventRequest');
    createGroupInvitation({
      groupId,
      ids: [userId],
    });
  };

  if (!isSuccess) return <div>loading...</div>;

  const isRequestAlreadySent = userGroupInvitations.some((invitation) => invitation.group.id === groupId);

  return (
    <div className={'flex bg-white p-10 flex-col items-center mt-10'}>
      <h2 className={'text-xl font-semibold mb-3'}>Ta grupa jest prywatna.</h2>
      <p className={'mb-10'}>
        {isRequestAlreadySent ? 'Prośba o dołączenie została wysłana.' : 'Możesz wysłać prośbę o dodanie do grupy.'}
      </p>
      <div className={'flex space-x-3'}>
        {!isRequestAlreadySent && <Button onClick={createJoinGroupRequest}>Wyślij</Button>}
        <Button kind={'secondary'} onClick={() => navigate('/groups')}>
          Wróć do grup
        </Button>
      </div>
    </div>
  );
};

export default JoinGroupRequestModal;
