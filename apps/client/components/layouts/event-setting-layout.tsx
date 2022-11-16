import { ReactNode } from 'react';
import Header from '../common/header';
import { useRouter } from 'next/router';
import { useEventInfoQuery } from '../../hooks/query/events';
import Link from 'next/link';
import UserIcon from '../icons/user-icon';
import clsx from 'clsx';

interface EventSettingLayoutProps {
  children: ReactNode;
}

const routesMap: Record<string, 'settings' | 'memebrs'> = {
  settings: 'settings',
  members: 'memebrs',
};

const EventSettingLayout = ({ children }: EventSettingLayoutProps) => {
  const router = useRouter();
  const eventId = router.query.eventId as string;
  const currentPathName = router.pathname.split('/').pop() as string;
  const currentRoute = routesMap[currentPathName];

  const { data: eventData, isSuccess } = useEventInfoQuery(eventId, router.isReady);

  if (!isSuccess) return <div>{'loading'}</div>;

  return (
    <div className={'mt-[80px]'}>
      <Header />
      <div className={'mb-5 flex items-start shadow-lg p-10 rounded-b-xl bg-white max-w-[1200px] mx-auto'}>
        <div>
          <h1 className={'text-4xl font-semibold'}>{eventData.name}</h1>
          <p className={'text-lg text-neutral-600'}>{eventData.description}</p>
        </div>
      </div>
      <div className={'grid grid-cols-[300px_1fr] h-full items-start max-w-[1200px] mx-auto mt-20 gap-10'}>
        <nav className={'bg-white rounded-lg shadow flex flex-col relative'}>
          <ul>
            <li className={'p-5'}>
              <Link href={`/events/${eventId}/settings`} className={'flex'}>
                <UserIcon />
                <p className={'ml-2'}>Ogólne</p>
              </Link>
            </li>
            <li className={'p-5'}>
              <Link href={`/events/${eventId}/settings/members`} className={'flex'}>
                <UserIcon />
                <p className={'ml-2'}>Członkowie</p>
              </Link>
            </li>
          </ul>
          <div className={clsx('w-1 h-1/2 absolute transition-all ', currentRoute === 'memebrs' && 'translate-y-full')}>
            <div className={'w-full h-[45px] top-1/2 relative -translate-y-1/2 bg-blue-500 rounded-r'} />
          </div>
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
};

export default EventSettingLayout;
