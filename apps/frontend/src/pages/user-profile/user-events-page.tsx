import { Link, useParams } from 'react-router-dom';
import { useUserEventInvitationsQuery, useUserEventsQuery, useUserQuery } from '../../hooks/query/users';
import EventCard from '../events/events-home/event-card';
import UserProfileInvitationsSection from './user-profile-invitations-section';
import { useAuth } from '../../hooks/use-auth';

const UserEventsPage = () => {
  const params = useParams();
  const userId = params['id'] as string;
  const { user: currentUser } = useAuth();

  const { isSuccess: isUserSuccess, data: user } = useUserQuery(userId);
  const { isSuccess: isEventsSuccess, data: userEvents } = useUserEventsQuery(userId);

  const isCurrentUserPage = currentUser?.userId === userId;

  const {
    isSuccess: isUserInvitationsSuccess,
    data: userEventInvitations,
    isFetched,
  } = useUserEventInvitationsQuery(userId, isCurrentUserPage);

  if (!isUserSuccess || !isEventsSuccess || (isCurrentUserPage && !isFetched)) return <div>loading...</div>;

  return (
    <div className={'space-y-20'}>
      {isUserInvitationsSuccess && <UserProfileInvitationsSection userEventInvitations={userEventInvitations} />}
      {userEvents.length ? (
        <div>
          <h2 className={'text-xl font-semibold mb-10'}>Wydarzenia w których bierze udział</h2>
          <div className={'grid grid-cols-fluid space-y-10'}>
            {userEvents.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className={'h-[150px]'}>
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className={'text-xl font-semibold mb-10'}>
          {user.name.toUpperCase()} nie bierze udziału w żadnych wydarzeniach{' '}
        </p>
      )}
    </div>
  );
};

export default UserEventsPage;
