import { PrivateEventType } from '@event-organizer/shared-types';

interface EventCardProps {
  event: PrivateEventType;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className={'flex shadow-md rounded-xl overflow-hidden bg-white w-full'}>
      <img src={event.bannerImage || '/images/image-fallback.png'} alt={event.name} className={'w-40 h-32'} />
      <div className={'flex flex-col px-5 py-3'}>
        <h2 className={'font-semibold '}>{event.name}</h2>
        <p>secret event</p>
      </div>
    </div>
  );
};

export default EventCard;
