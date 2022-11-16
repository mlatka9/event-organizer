import { useState } from 'react';
import Index from './event-pending-invitation-modal';
import EventInviteModal from './event-invite-modal';
import Button from '../common/button';

interface EventAdminSettingsProps {
  eventId: string;
}

const EventAdminSettings = ({ eventId }: EventAdminSettingsProps) => {
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
      {isPendingModalOpen && <Index handleCloseModal={handleCloseModals} eventId={eventId} />}
      {isInviteModalOpen && <EventInviteModal handleCloseModal={handleCloseModals} eventId={eventId} />}
    </div>
  );
};

export default EventAdminSettings;
