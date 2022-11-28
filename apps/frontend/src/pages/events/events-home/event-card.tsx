import { EventShowcaseType } from '@event-organizer/shared-types';
import { MouseEventHandler } from 'react';
import dayjs from 'dayjs';
import ImageFallback from '../../../assets/images/image-fallback.svg';
import UserIcon from '../../../components/icons/user-icon';
import clsx from 'clsx';

// console.log(ImageFallback);

interface EventCardProps {
  event: EventShowcaseType;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  isSmall?: boolean;
}

const EventCard = ({ event, onMouseEnter, onMouseLeave, isSmall }: EventCardProps) => {
  const formattedDate = event.startDate
    ? [
        dayjs(event.startDate).format('D MMMM YYYY H:mm'),
        event.endDate &&
          !dayjs(event.startDate).isSame(dayjs(event.endDate)) &&
          dayjs(event.endDate).format('D MMMM YYYY H:mm'),
      ]
        .filter((d) => d)
        .join(' - ')
    : 'Termin nieogłoszony';

  const smallFormattedDate = event.startDate
    ? [
        dayjs(event.startDate).format('D MMM YY'),
        event.endDate &&
          !dayjs(event.startDate).isSame(dayjs(event.endDate)) &&
          dayjs(event.endDate).format('D MMM YYYY'),
      ]
        .filter((d) => d)
        .join(' - ')
    : 'Termin nieogłoszony';

  return (
    <div
      className={clsx('flex shadow-md rounded-lg overflow-hidden bg-white w-full h-[170px]', isSmall && '!h-[150px]')}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img
        src={event.bannerImage || ImageFallback}
        alt={event.name}
        className={clsx('w-40 object-cover', isSmall && 'w-36')}
      />
      <div className={'flex flex-col px-5 py-3'}>
        <p className={'text-sm text-gray-500'}>{isSmall ? smallFormattedDate : formattedDate}</p>
        <h2 className={clsx('font-semibold mt-1', isSmall && 'text-sm')}>{event.name}</h2>
        <p className={clsx('text-sm', isSmall && 'hidden')}>{event.displayAddress}</p>
        <div className={'flex items-baseline mt-auto'}>
          <UserIcon width={12} height={12} />
          <p className={clsx('text-sm ml-1', isSmall && 'text-xs')}>{event.participantsCount} uczestników</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
