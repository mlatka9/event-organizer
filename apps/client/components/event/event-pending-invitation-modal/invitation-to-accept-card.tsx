import UserImage from '../../common/user-image';
import Button from '../../common/button';
import { useAcceptEventInvitationMutation } from '../../../hooks/mutations/events';

interface UserToAcceptCardProps {
  image: string | null;
  name: string;
  eventId: string;
  invitationId: string;
}

const InvitationToAcceptCard = ({ name, image, invitationId, eventId }: UserToAcceptCardProps) => {
  const { mutate: acceptEventInvitation, isLoading } = useAcceptEventInvitationMutation();

  const handleAcceptInvitation = () => {
    acceptEventInvitation({
      eventId,
      invitationId,
    });
  };

  return (
    <div className={'flex items-center'}>
      <UserImage imageUrl={image} userName={name} />
      <p className={'font-semibold ml-3'}>{name}</p>
      <Button isSmall kind={'secondary'} onClick={handleAcceptInvitation} className={'ml-auto'} disabled={isLoading}>
        Zaakceptuj
      </Button>
    </div>
  );
};

export default InvitationToAcceptCard;
