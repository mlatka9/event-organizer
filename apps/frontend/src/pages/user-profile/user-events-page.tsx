import { Link, useParams } from 'react-router-dom';
import {
  useUserEventInvitationsQuery,
  useUserEventPendingRequestsQuery,
  useUserEventsQuery,
  useUserQuery,
} from '../../hooks/query/users';
import EventCard from '../events/events-home/event-card';
import UserProfileInvitationsSection from './user-profile-invitations-section';
import { useAuth } from '../../hooks/use-auth';
import clsx from 'clsx';

const UserEventsPage = () => {
  const params = useParams();
  const userId = params['id'] as string;
  const { user: currentUser } = useAuth();

  const { isSuccess: isUserSuccess, data: user } = useUserQuery(userId);
  const { isSuccess: isEventsSuccess, data: userEvents } = useUserEventsQuery(userId);

  const isCurrentUserPage = currentUser?.userId === userId;

  const { isSuccess: isUserInvitationsSuccess, data: userEventInvitations } = useUserEventInvitationsQuery({
    userId,
    limit: 1,
    enabled: isCurrentUserPage,
  });

  const { isSuccess: isPendingRequestsSuccess, data: userEventPendingRequests } = useUserEventPendingRequestsQuery({
    userId,
    limit: 1,
    enabled: isCurrentUserPage,
  });

  if (
    !isUserSuccess ||
    !isEventsSuccess ||
    (isCurrentUserPage && !(isUserInvitationsSuccess || isPendingRequestsSuccess))
  )
    return <div>loading...</div>;

  return (
    <div className={'grid grid-cols-1'}>
      <div>
        {isUserInvitationsSuccess && isPendingRequestsSuccess && (
          <div className={clsx((userEventInvitations.length || userEventPendingRequests.length) && 'mb-20')}>
            <UserProfileInvitationsSection
              userEventInvitations={userEventInvitations}
              userEventPendingRequests={userEventPendingRequests}
            />
          </div>
        )}
      </div>
      <div>
        {userEvents.length ? (
          <div>
            <h2 className={'text-xl font-semibold mb-3'}>
              Wydarzenia {!isCurrentUserPage && 'publiczne'} w których bierze udział
            </h2>
            <div className={'grid grid-cols-fluid space-y-10'}>
              {userEvents.map((event) => (
                <Link to={`/events/${event.id}`} key={event.id} className={'h-[150px]'}>
                  <EventCard event={event} />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className={'text-xl font-semibold mb-10'}>{user.name} nie bierze udziału w żadnych wydarzeniach </p>
        )}
      </div>
    </div>
  );
};

export default UserEventsPage;
