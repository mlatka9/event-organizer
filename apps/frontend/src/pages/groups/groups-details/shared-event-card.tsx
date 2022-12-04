import ImageFallback from '../../../assets/images/image-fallback.svg';
import dayjs from 'dayjs';
import { SharedEventType } from '@event-organizer/shared-types';

interface SharedEventCardProps {
  event: SharedEventType;
}

const SharedEventCard = ({ event }: SharedEventCardProps) => {
  return (
    <div className={'grid grid-cols-[200px_1fr] shadow-md rounded-lg overflow-hidden w-full h-[200px] w-full bg-white'}>
      <img src={event.bannerImage || ImageFallback} alt={event.name} className={'w-[200px] h-[200px] object-cover'} />
      <div className={'flex flex-col px-5 py-3'}>
        <p className={'text-sm text-gray-500'}>
          {event.startDate ? dayjs(event.startDate).format('D MMMM YYYY H:mm') : 'termin nieogłoszony'}
        </p>
        <h2 className={'font-semibold '}>{event.name}</h2>
        <p className={'text-sm'}>{event.displayAddress}</p>
        <div className={'lg:flex justify-between mt-auto'}>
          <p className={'text-sm '}>bierze udział: {event.participantsCount}</p>
          <div className={'flex items-center gap-x-1 text-sm flex-wrap'}>
            <span>Udostępnił: </span>
            {event.sharedBy.slice(0, 2).map((user) => (
              <div className={'flex items-center'} key={user.id}>
                <img src={user.image || ImageFallback} alt={user.name} className={'w-6 h-6 rounded-full'} />
              </div>
            ))}
            {event.sharedBy.length > 2 && (
              <span className={'w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center'}>
                +{event.sharedBy.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedEventCard;
