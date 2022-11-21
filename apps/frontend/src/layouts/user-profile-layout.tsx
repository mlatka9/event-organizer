import Header from '../components/common/header';
import { Outlet, useParams } from 'react-router-dom';
import NavigationLink from '../components/common/navigation-link';
import { useUserQuery } from '../hooks/query/users';

const UserLayout = () => {
  const params = useParams();
  const userId = params['id'] as string;

  return (
    <div className={'min-h-screen pt-[80px]'}>
      <Header />
      <div className={'grid grid-cols-[300px_1fr] h-full items-start max-w-[1200px] mx-auto mt-20 gap-10'}>
        <nav className={'bg-white rounded-lg shadow flex flex-col relative'}>
          <ul>
            <li>
              <NavigationLink href={`/users/${userId}`} label={'Profil'} />
            </li>
            <li>
              <NavigationLink href={`/users/${userId}/events`} label={'Wydarzenia'} />
            </li>
            <li>
              <NavigationLink href={`/users/${userId}/groups`} label={'Grupy'} />
            </li>
          </ul>
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;