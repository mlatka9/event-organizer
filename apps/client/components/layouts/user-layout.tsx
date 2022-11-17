import Header from '../common/header';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import UserIcon from '../icons/user-icon';
import clsx from 'clsx';

interface UserLayoutProps {
  children?: ReactNode;
}

const routesMap: Record<string, 'profile' | 'events' | 'groups'> = {
  '[userId]': 'profile',
  events: 'events',
  groups: 'groups',
};

const UserLayout = ({ children }: UserLayoutProps) => {
  const router = useRouter();

  const userId = router.query.userId as string | undefined;
  const currentPathName = router.pathname.split('/').pop() as string;
  const currentRoute = routesMap[currentPathName];

  console.log(currentRoute);

  return (
    <div className={'min-h-screen pt-[80px]'}>
      <Header />

      <div className={'grid grid-cols-[300px_1fr] h-full items-start max-w-[1200px] mx-auto mt-20 gap-10'}>
        <nav className={'bg-white rounded-lg shadow flex flex-col relative'}>
          <ul>
            <li className={'p-5'}>
              <Link href={`/users/${userId}`} className={'flex'}>
                <UserIcon />
                <p className={'ml-2'}>Profil</p>
              </Link>
            </li>
            <li className={'p-5'}>
              <Link href={`/users/${userId}/events`} className={'flex'}>
                <UserIcon />
                <p className={'ml-2'}>Wydarzenia</p>
              </Link>
            </li>
            <li className={'p-5'}>
              <Link href={`/users/${userId}/groups`} className={'flex'}>
                <UserIcon />
                <p className={'ml-2'}>Grupy</p>
              </Link>
            </li>
          </ul>
          <div
            className={clsx(
              'w-1 h-1/3 absolute transition-all ',
              currentRoute === 'events' && 'translate-y-full',
              currentRoute === 'groups' && 'translate-y-[200%]'
            )}
          >
            <div className={'w-full h-[45px] top-1/2 relative -translate-y-1/2 bg-blue-500 rounded-r'} />
          </div>
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
