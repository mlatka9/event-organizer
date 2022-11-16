import UserImage from '../../common/user-image';
import Button from '../../common/button';
import { useAcceptEventInvitationMutation, useDeclineEventInvitationMutation } from '../../../hooks/mutations/events';

interface UserToAcceptCardProps {
  image: string | null;
  userName: string;
  eventId: string;
  invitationId: string;
}

const SentInvitationCard = ({ userName, image, invitationId, eventId }: UserToAcceptCardProps) => {
  const { mutate: declineEventInvitation, isLoading } = useDeclineEventInvitationMutation({ eventId });

  const handleDeclineEventInvitation = () => {
    declineEventInvitation({
      eventId,
      invitationId,
    });
  };

  return (
    <div className={'flex items-center'}>
      <UserImage imageUrl={image} userName={userName} />
      <p className={'font-semibold ml-3'}>{userName}</p>
      <Button isSmall kind={'error'} onClick={handleDeclineEventInvitation} className={'ml-auto'} disabled={isLoading}>
        Anuluj
      </Button>
    </div>
  );
};

export default SentInvitationCard;
