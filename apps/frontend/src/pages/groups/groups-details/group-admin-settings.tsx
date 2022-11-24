import { useState } from 'react';
import Button from '../../../components/common/button';
import GroupInviteModal from '../../events/event-details/group-invite-modal';
import GroupPendingInvitationsModal from './group-pending-invitation-modal';

interface GroupAdminSettingsProps {
  groupId: string;
}

const GroupAdminSettings = ({ groupId }: GroupAdminSettingsProps) => {
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleOpenPendingModal = () => {
    setIsPendingModalOpen(true);
    setIsInviteModalOpen(false);
  };

  const handleInviteModal = () => {
    setIsPendingModalOpen(false);
    setIsInviteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsPendingModalOpen(false);
    setIsInviteModalOpen(false);
  };

  return (
    <div>
      <div className={'space-x-2'}>
        <Button onClick={handleOpenPendingModal}>oczekujące</Button>
        <Button onClick={handleInviteModal}>zaproś</Button>
      </div>
      {isPendingModalOpen && <GroupPendingInvitationsModal groupId={groupId} handleCloseModal={handleCloseModals} />}
      {isInviteModalOpen && (
        <div>
          <GroupInviteModal groupId={groupId} handleCloseModal={handleCloseModals} />
        </div>
      )}
    </div>
  );
};

export default GroupAdminSettings;
