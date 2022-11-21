import { EventShowcaseType } from '@event-organizer/shared-types';
import { MouseEventHandler } from 'react';
import dayjs from 'dayjs';
import ImageFallback from '../../../assets/images/image-fallback.svg';

// console.log(ImageFallback);

interface EventCardProps {
  event: EventShowcaseType;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

const EventCard = ({ event, onMouseEnter, onMouseLeave }: EventCardProps) => {
  return (
    <div
      className={'flex shadow-md rounded-lg overflow-hidden bg-white w-full h-[170px]'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img src={event.bannerImage || ImageFallback} alt={event.name} className={'w-40 object-cover'} />
      <div className={'flex flex-col px-5 py-3'}>
        <p className={'text-sm text-gray-500'}>
          {event.startDate ? dayjs(event.startDate).format('D-MM-YYYY H:mm') : 'termin nieogłoszony'}
        </p>
        <h2 className={'font-semibold '}>{event.name}</h2>
        <p className={'text-sm'}>{event.displayAddress}</p>
        <p className={'text-sm mt-auto'}>bierze udział: {event.participantsCount}</p>
      </div>
    </div>
  );
};

export default EventCard;
