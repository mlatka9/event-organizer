import Button from '../../../components/common/button';
import PlusIcon from '../../../components/icons/plus-icons';
import { GroupType } from '@event-organizer/shared-types';
import { useShareEventMutation } from '../../../hooks/mutation/groups';
import imageFallback from '../../../assets/images/image-fallback.svg';
import { toast } from 'react-toastify';

interface ShareEventItemProps {
  group: GroupType;
  eventId: string;
}

const ShareEventItem = ({ group, eventId }: ShareEventItemProps) => {
  const onSuccess = () => {
    toast('Wydarzenie pomyślnie udostępnione', {
      type: 'success',
    });
  };

  const { mutate: shareEvent, isLoading } = useShareEventMutation(onSuccess);

  const handleShareEvent = () => {
    shareEvent({
      eventId,
      groupId: group.id,
    });
  };

  return (
    <li key={group.id} className={'flex px-3 py-2 items-center'}>
      <img src={group.bannerImage || imageFallback} alt={group.name} className={'w-10 h-10 rounded-full mr-3'} />
      <p>{group.name}</p>
      <Button isSmall className={'flex items-center !px-3 ml-auto'} onClick={handleShareEvent} disabled={isLoading}>
        <PlusIcon className={'fill-white mr-2'} width={15} height={15} />
        Udostępnij
      </Button>
    </li>
  );
};

export default ShareEventItem;
