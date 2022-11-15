import UserLayout from '../../../components/layouts/user-layout';
import { useUserEventsQuery, useUserQuery } from '../../../hooks/query/users';
import { useRouter } from 'next/router';
import EventCard from '../../../components/event/event-card';
import Link from 'next/link';

const UserEventsPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;

  const { isSuccess: isUserSuccess, data: user } = useUserQuery(userId, router.isReady);
  const { isSuccess: isEventsSuccess, data: userEvents } = useUserEventsQuery(userId, router.isReady);

  console.log('userEvents', userEvents);

  if (!isUserSuccess || !isEventsSuccess) return <UserLayout>{'loading'}</UserLayout>;

  return (
    <UserLayout>
      <h1 className={'text-xl font-semibold'}>Wydarzenia w których {user.name} bierze udział</h1>
      <div className={'flex mt-10'}>
        {userEvents.map((event) => (
          <Link href={`/events/${event.id}`} key={event.id} className={'block w-full'}>
            <EventCard event={event} />
          </Link>
        ))}
      </div>
    </UserLayout>
  );
};

export default UserEventsPage;
