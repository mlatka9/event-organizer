import UserImage from '../../../components/common/user-image';
import Button from '../../../components/common/button';
import ImageFallback from '../../../assets/images/image-fallback.svg';
import { useAcceptGroupInvitationMutation } from '../../../hooks/query/groups';

interface GroupInvitationToAcceptCardProps {
  image: string | null;
  name: string;
  groupId: string;
  invitationId: string;
}

const GroupInvitationToAcceptCard = ({ invitationId, groupId, image, name }: GroupInvitationToAcceptCardProps) => {
  const { mutate: acceptEventInvitation, isLoading } = useAcceptGroupInvitationMutation();

  const handleAcceptInvitation = () => {
    acceptEventInvitation({
      groupId,
      invitationId,
    });
  };

  return (
    <div className={'flex items-center'}>
      <UserImage imageUrl={image || ImageFallback} userName={name} />
      <p className={'font-semibold ml-3'}>{name}</p>
      <Button isSmall kind={'secondary'} onClick={handleAcceptInvitation} className={'ml-auto'} disabled={isLoading}>
        Zaakceptuj
      </Button>
    </div>
  );
};

export default GroupInvitationToAcceptCard;
