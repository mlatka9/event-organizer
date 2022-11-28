import { Link } from 'react-router-dom';
import EventCard from '../events/events-home/event-card';
import { EventShowcaseType } from '@event-organizer/shared-types';

interface EventListProps {
  events: EventShowcaseType[];
}

const EventList = ({ events }: EventListProps) => {
  return (
    <>
      {events.length ? (
        events.map((event) => (
          <Link to={`/events/${event.id}`} key={event.id}>
            <EventCard event={event} isSmall />
          </Link>
        ))
      ) : (
        <div>Nie masz zaplanowanych żadnych wydarzeń tego dnia</div>
      )}
    </>
  );
};

export default EventList;
