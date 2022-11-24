import UserImage from '../../../components/common/user-image';
import Button from '../../../components/common/button';
import ImageFallback from '../../../assets/images/image-fallback.svg';
import { useDeclineGroupInvitationMutation } from '../../../hooks/query/groups';

interface GroupSentInvitationCardProps {
  image: string | null;
  name: string;
  groupId: string;
  invitationId: string;
}

const GroupSentInvitationCard = ({ name, image, invitationId, groupId }: GroupSentInvitationCardProps) => {
  const { mutate: declineGroupInvitation, isLoading } = useDeclineGroupInvitationMutation();

  const handleDeclineEventInvitation = () => {
    declineGroupInvitation({
      groupId,
      invitationId,
    });
  };

  return (
    <div className={'flex items-center'}>
      <UserImage imageUrl={image || ImageFallback} userName={name} />
      <p className={'font-semibold ml-3'}>{name}</p>
      <Button isSmall kind={'error'} onClick={handleDeclineEventInvitation} className={'ml-auto'} disabled={isLoading}>
        Anuluj
      </Button>
    </div>
  );
};

export default GroupSentInvitationCard;
