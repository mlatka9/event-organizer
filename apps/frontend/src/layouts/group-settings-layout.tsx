import { Navigate, Outlet, useParams } from 'react-router-dom';
import NavigationLink from '../components/common/navigation-link';
import React from 'react';
import { useGroupDetails } from './group-details-layout';

const GroupSettingsLayout = () => {
  // const params = useParams();
  // const groupId = params['id'] as string;

  const { groupData } = useGroupDetails();

  if (!groupData.isUserAdmin) {
    return <Navigate to={`/groups/${groupData.id}`} />;
  }

  return (
    <div>
      <div className={'grid lg:grid-cols-[260px_1fr] h-full items-start max-w-[1200px] mx-auto mt-20 gap-10'}>
        <nav className={'bg-white rounded-lg shadow flex flex-col relative'}>
          <ul>
            <li>
              <NavigationLink href={`/groups/${groupData.id}/settings`} label={'Podstawowe dane'} exact />
            </li>
          </ul>
        </nav>

        <main>
          <Outlet context={{ groupData }} />
        </main>
      </div>
    </div>
  );
};

export default GroupSettingsLayout;
