import Header from '../components/common/header';
import { Outlet, useParams } from 'react-router-dom';
import NavigationLink from '../components/common/navigation-link';
import Heading from '../components/common/heading';

const UserLayout = () => {
  const params = useParams();
  const userId = params['id'] as string;

  return (
    <div className={'grid lg:grid-cols-[200px_1fr] xl:grid-cols-[260px_1fr] min-h-screen items-start'}>
      <Header />
      <div>
        <Heading className={'mt-5 lg:mt-10 px-5 text-right lg:text-left'}>Profil</Heading>
        <div className={'grid lg:grid-cols-[300px_1fr] items-start w-full mx-auto gap-10 px-5 pt-10'}>
          <nav className={'bg-white rounded-lg shadow flex flex-col relative'}>
            <ul>
              <li>
                <NavigationLink href={`/users/${userId}`} label={'Profil'} exact />
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
    </div>
  );
};

export default UserLayout;
