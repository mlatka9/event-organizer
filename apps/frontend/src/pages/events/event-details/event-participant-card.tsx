import { EventParticipantRole } from '@event-organizer/shared-types';
import AvatarFallback from '../../../assets/images/avatar-fallback.svg';
import { Link } from 'react-router-dom';

interface UserCardProps {
  id: string;
  name: string;
  image: string | null;
  role: EventParticipantRole;
}

const EventParticipantCard = ({ id, image, name, role }: UserCardProps) => {
  return (
    <div className={'bg-white flex items-center'}>
      <Link to={`/users/${id}`} className={'rounded-full'}>
        <img src={image || AvatarFallback} className={'block w-14 h-14 rounded-full '} />
      </Link>
      <Link to={`/users/${id}`} className={'hover:underline'}>
        <p className={'ml-3 font-semibold text-sm'}>{name}</p>
      </Link>
      {role === 'ADMIN' && <div className={'bg-gray-500/10 rounded-md px-2 py-1 ml-auto text-sm'}>administrator</div>}
    </div>
  );
};

export default EventParticipantCard;
