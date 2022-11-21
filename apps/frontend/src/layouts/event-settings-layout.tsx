import { Outlet, useParams } from 'react-router-dom';
import NavigationLink from '../components/common/navigation-link';

const EventSettingsLayout = () => {
  const params = useParams();
  const eventId = params['id'] as string;

  return (
    <div>
      <div className={'grid grid-cols-[300px_1fr] h-full items-start max-w-[1200px] mx-auto mt-20 gap-10'}>
        <nav className={'bg-white rounded-lg shadow flex flex-col relative'}>
          <ul>
            <li>
              <NavigationLink href={`/events/${eventId}/settings`} label={'Podstawowe dane'} />
            </li>
            <li>
              <NavigationLink href={`/events/${eventId}/settings/modules`} label={'Moduły'} />
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

export default EventSettingsLayout;
