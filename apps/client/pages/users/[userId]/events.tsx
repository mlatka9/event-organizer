import UserLayout from '../../../components/layouts/user-layout';
import { useUserEventInvitationsQuery, useUserEventsQuery, useUserQuery } from '../../../hooks/query/users';
import { useRouter } from 'next/router';
import EventCard from '../../../components/event/event-card';
import Link from 'next/link';
import UserProfileInvitationsSection from '../../../components/user/user-profile-invitations-section';

const UserEventsPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;

  const { isSuccess: isUserSuccess, data: user } = useUserQuery(userId, router.isReady);

  const { isSuccess: isEventsSuccess, data: userEvents } = useUserEventsQuery(userId, router.isReady);

  const {
    isSuccess: isUserInvitationsSuccess,
    data: userEventInvitations,
    isFetched,
  } = useUserEventInvitationsQuery(userId, router.isReady);

  if (!isUserSuccess || !isEventsSuccess || !isFetched) return <UserLayout>{'loading'}</UserLayout>;

  return (
    <UserLayout>
      <div className={'space-y-20'}>
        {isUserInvitationsSuccess && <UserProfileInvitationsSection userEventInvitations={userEventInvitations} />}
        {userEvents.length ? (
          <div>
            <h2 className={'text-xl font-semibold mb-10'}>Wydarzenia w których bierze udział</h2>
            <div className={'grid grid-cols-fluid gap-3'}>
              {userEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className={'h-[150px]'}>
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
    </UserLayout>
  );
};

export default UserEventsPage;
