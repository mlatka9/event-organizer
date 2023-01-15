import { GroupShowcaseType } from '@event-organizer/shared-types';
import imageFallback from '../../../assets/images/image-fallback.svg';
import Button from '../../../components/common/button';
import LockIcon from '../../../components/icons/lock-icon';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface GroupCardProps {
  group: GroupShowcaseType;
  isHorizontal?: boolean;
  isSmall?: boolean;
}

const GroupCard = ({ group, isHorizontal = false, isSmall }: GroupCardProps) => {
  return (
    <article
      className={clsx(
        'flex flex-col rounded-md overflow-hidden shadow-md h-96',
        isHorizontal && 'grid grid-cols-[160px_1fr] h-44'
      )}
    >
      <img
        className={clsx('h-40 object-cover block', isHorizontal && '!h-44 w-[160px]')}
        src={group.bannerImage || imageFallback}
      />
      <div className={clsx('flex flex-col p-4', isSmall && 'p-2')}>
        <div className={'flex justify-between items-start'}>
          <h2 className={clsx('text-lg font-semibold', isSmall && '!text-sm')}>{group.name}</h2>
          <div
            className={clsx(
              'px-3 py-2 bg-blue-100 rounded-md text-sm font-semibold text-blue-800',
              isSmall && '!text-sm !py-1 !px-2 !text-xs'
            )}
          >
            {group.category.name}
          </div>
        </div>
        <p className={clsx('mb-10 text-neutral-700', isHorizontal && '!mb-0', isSmall && '!text-sm')}>
          {group.description}
        </p>
        <div
          className={clsx(
            'flex justify-between mb-5 text-sm text-neutral-700 mt-auto',
            isHorizontal && '!mb-0',
            isSmall && 'flex-col'
          )}
        >
          <p className={'font-semibold'}>{group.membersCount} członków grupy</p>
          {group.groupVisibility === 'PUBLIC' && <div>grupa publiczna</div>}
          {group.groupVisibility === 'PRIVATE' && (
            <div className={'flex items-center'}>
              <span className={'mr-2'}>grupa prywatna</span>
              <LockIcon width={13} height={13} />
            </div>
          )}
        </div>
        {!isHorizontal && (
          <Link
            to={`/groups/${group.id}`}
            className={clsx('flex items-center justify-center bg-blue-600 text-white font-semibold p-2 rounded-md')}
          >
            Wyświetl
          </Link>
        )}
      </div>
    </article>
  );
};

export default GroupCard;
