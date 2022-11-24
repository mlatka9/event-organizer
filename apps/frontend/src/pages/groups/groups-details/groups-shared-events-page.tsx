import { useAllGroupSharedEventsQuery } from '../../../hooks/query/groups';
import { Link, useParams } from 'react-router-dom';
import Heading from '../../../components/common/heading';
import SharedEventCard from './shared-event-card';

const GroupsSharedEventsPage = () => {
  const params = useParams();
  const groupId = params['groupId'] as string;

  const { data, isSuccess } = useAllGroupSharedEventsQuery(groupId);
  console.log(data);
  return (
    <div className={'pb-20'}>
      <h2 className={'font-semibold text-lg mb-10'}>Udostępnione wydarzenia</h2>
      <div className={'flex flex-col space-y-5'}>
        {isSuccess &&
          data.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id}>
              <SharedEventCard event={event} />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default GroupsSharedEventsPage;
