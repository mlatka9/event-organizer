import { GroupShowcaseType } from '@event-organizer/shared-types';
import imageFallback from '../../../assets/images/image-fallback.svg';
import Button from '../../../components/common/button';
import LockIcon from '../../../components/icons/lock-icon';
import { Link } from 'react-router-dom';

interface GroupCardProps {
  group: GroupShowcaseType;
}

const GroupCard = ({ group }: GroupCardProps) => {
  return (
    <article className={'flex flex-col rounded-md overflow-hidden shadow-md'}>
      <img className={'h-40 object-cover'} src={group.bannerImage || imageFallback} />
      <div className={'flex flex-col p-4'}>
        <div className={'flex justify-between'}>
          <h2 className={'text-lg font-semibold'}>{group.name}</h2>
          <div className={'px-3 py-2 bg-blue-100 rounded-md text-sm font-semibold text-blue-800'}>
            {group.category.name}
          </div>
        </div>
        <p className={'mb-10 text-neutral-700'}>{group.description}</p>
        <div className={'flex justify-between mb-5 text-sm text-neutral-700'}>
          <p className={'font-semibold'}>{group.membersCount} członków grupy</p>
          {group.groupVisibility === 'PUBLIC' && <div>grupa publiczna</div>}
          {group.groupVisibility === 'PRIVATE' && (
            <div className={'flex items-center'}>
              <span className={'mr-2'}>grupa prywatna</span>
              <LockIcon width={13} height={13} />
            </div>
          )}
        </div>
        <Link
          to={`/groups/${group.id}`}
          className={'flex items-center justify-center bg-blue-600 text-white font-semibold p-2 rounded-md'}
        >
          Wyświetl
        </Link>
      </div>
    </article>
  );
};

export default GroupCard;
