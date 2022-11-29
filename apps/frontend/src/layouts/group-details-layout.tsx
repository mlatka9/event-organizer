import Header from '../components/common/header';
import Button from '../components/common/button';
import { NavLink, Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useGroupDetailsQuery } from '../hooks/query/groups';
import { useAuth } from '../hooks/use-auth';
import { GroupDetailsType } from '@event-organizer/shared-types';
import { useJoinGroupMutation, useLeaveGroupMutation } from '../hooks/mutation/groups';
import JoinGroupRequestModal from '../pages/groups/groups-details/join-group-request-modal';

const GroupDetailsLayout = () => {
  const { user } = useAuth();
  const params = useParams();
  const groupId = params['groupId'] as string;

  const { data: groupData, isError, error, isSuccess } = useGroupDetailsQuery({ groupId });
  const { mutate: joinGroup, isLoading: isJoinGroupLoading } = useJoinGroupMutation();
  const { mutate: leaveGroup, isLoading: isLeaveGroupLoading } = useLeaveGroupMutation();

  const handleJoinGroup = () => {
    if (!user?.userId) return;
    joinGroup({
      groupId: groupId,
      userId: user?.userId,
    });
  };
  const handleLeaveGroup = () => {
    if (!user?.userId) return;
    leaveGroup({
      groupId: groupId,
      userId: user?.userId,
    });
  };

  if (isError && error.response?.status === 401) {
    return (
      <div>
        <Header />
        <div className={'pt-20 max-w-[1000px] mx-auto rounded-md'}>
          {user ? (
            <JoinGroupRequestModal groupId={groupId} userId={user.userId} />
          ) : (
            <div>Wydarzenie jest prywatne musisz się zalogowac</div>
          )}
        </div>
      </div>
    );
  }

  if (isError && error.response?.status === 400) {
    return (
      <div>
        <Header />
        <div className={'pt-20 max-w-[1000px] mx-auto rounded-md'}>Błąd! Grupa nie istnieje</div>
      </div>
    );
  }

  if (!isSuccess)
    return (
      <div>
        <Header />
        <div className={'mt-40 mx-auto w-full'}>loading... 123123</div>
      </div>
    );

  return (
    <div className={'grid lg:grid-cols-[200px_1fr] xl:grid-cols-[260px_1fr] min-h-screen'}>
      <Header />
      <main className="mx-auto max-w-[1200px] w-full px-5">
        <div className={'rounded-b-xl bg-white shadow-md mb-10'}>
          {groupData.bannerImage && (
            <img src={groupData.bannerImage} className={'w-full h-[200px] lg:h-[300px] object-cover'} />
          )}
          <div className={'px-5 lg:px-10 py-5 flex flex-col'}>
            <div className={'flex'}>
              <div className={'flex flex-col'}>
                <h1 className={'text-xl lg:text-4xl font-semibold mb-3'}>{groupData.name}</h1>
                <p className={'text-md lg:text-lg text-neutral-600 mb-5'}>{groupData.description}</p>
                <div className={'text-blue-800 bg-blue-100 px-4 py-2 rounded-full font-semibold mr-auto'}>
                  {groupData.category.name}
                </div>
              </div>
              <div className={'ml-auto'}>
                {user && groupData.isUserMember && !groupData.isUserAdmin && (
                  <Button className={'ml-auto'} onClick={handleLeaveGroup} disabled={isLeaveGroupLoading}>
                    Opuść wydarzenie
                  </Button>
                )}
                {user && !groupData.isUserMember && (
                  <Button onClick={handleJoinGroup} className={'ml-auto'} disabled={isJoinGroupLoading}>
                    Dołącz
                  </Button>
                )}
              </div>
            </div>
            <div
              className={'bg-white gap-1 lg:gap-5 mt-10 lg:mt-20 font-semibold text-gray-700 flex flex-col lg:flex-row'}
            >
              <NavLink to={`/groups/${groupId}`} className={({ isActive }) => (isActive ? 'text-blue-500' : '')} end>
                Strona główna
              </NavLink>

              <NavLink
                to={`/groups/${groupId}/members`}
                className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
                end
              >
                Uczestnicy
              </NavLink>
              <NavLink
                to={`/groups/${groupId}/shared-events`}
                className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
                end
              >
                Udostępnione wydarzenia
              </NavLink>
              {groupData.isUserAdmin && (
                <NavLink
                  to={`/groups/${groupId}/settings`}
                  className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
                  end
                >
                  Ustawienia
                </NavLink>
              )}
            </div>
          </div>
        </div>
        <Outlet context={{ groupData }} />
      </main>
    </div>
  );
};

type ContextType = { groupData: GroupDetailsType };

export const useGroupDetails = () => {
  return useOutletContext<ContextType>();
};

export default GroupDetailsLayout;
