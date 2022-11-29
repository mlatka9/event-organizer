import { Link } from 'react-router-dom';
import EventCard from '../events/events-home/event-card';
import { EventShowcaseType } from '@event-organizer/shared-types';
import useBreakpoint from 'use-breakpoint';
import { BREAKPOINTS } from '../../constants/breakboints';

interface EventListProps {
  events: EventShowcaseType[];
}

const EventList = ({ events }: EventListProps) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  const isMobileBreakpoint = breakpoint === 'sm';
  return (
    <>
      {events.length ? (
        events.map((event) => (
          <Link to={`/events/${event.id}`} key={event.id}>
            <EventCard event={event} isSmall isHorizontal={isMobileBreakpoint} />
          </Link>
        ))
      ) : (
        <div>Nie masz zaplanowanych żadnych wydarzeń tego dnia</div>
      )}
    </>
  );
};

export default EventList;
