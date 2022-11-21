import { EventParticipantRole } from '@event-organizer/shared-types';
import AvatarFallback from '../../../assets/images/avatar-fallback.svg';

console.log('AvatarFallback', AvatarFallback);

interface UserCardProps {
  id: string;
  name: string;
  image: string | null;
  role: EventParticipantRole;
}

const EventParticipantCard = ({ id, image, name, role }: UserCardProps) => {
  return (
    <div className={'bg-white flex items-center'}>
      <img src={image || AvatarFallback} className={'block w-14 h-14 rounded-full '} />
      <p className={'ml-3 font-semibold text-sm'}>{name}</p>
      {role === 'ADMIN' && <div className={'bg-gray-500/10 rounded-md px-2 py-1 ml-auto text-sm'}>administrator</div>}
    </div>
  );
};

export default EventParticipantCard;
