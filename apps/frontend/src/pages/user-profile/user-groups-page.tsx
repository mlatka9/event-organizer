import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import {
  useUserGroupInvitationsQuery,
  useUserGroupPendingRequestsQuery,
  useUserGroupsQuery,
  useUserQuery,
} from '../../hooks/query/users';
import GroupCard from '../groups/groups-home/group-card';

import UserProfileGroupsInvitationsSection from './user-profile-groups-invitation-section';
import clsx from 'clsx';

const UserGroupsPage = () => {
  const params = useParams();
  const userId = params['id'] as string;

  const { user: currentUser } = useAuth();
  const { data: groupsData, isSuccess: isGroupsSuccess } = useUserGroupsQuery(userId);
  const { data: userData, isSuccess: isUserSuccess } = useUserQuery(userId);

  const isCurrentUserPage = currentUser?.userId === userId;
  const { isSuccess: isUserInvitationsSuccess, data: userGroupsInvitations } = useUserGroupInvitationsQuery({
    userId,
    enabled: isCurrentUserPage,
  });

  const { isSuccess: isPendingRequestsSuccess, data: userGroupsPendingRequests } = useUserGroupPendingRequestsQuery({
    userId,
    enabled: isCurrentUserPage,
  });

  console.log(isGroupsSuccess, isUserInvitationsSuccess, isPendingRequestsSuccess, isUserSuccess);

  if (
    !isGroupsSuccess ||
    !isUserSuccess ||
    (isCurrentUserPage && (!isUserInvitationsSuccess || !isPendingRequestsSuccess))
  ) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        {isUserInvitationsSuccess && isPendingRequestsSuccess && (
          <div className={clsx((userGroupsInvitations.length || userGroupsPendingRequests.length) && 'mb-20')}>
            <UserProfileGroupsInvitationsSection
              userGroupInvitation={userGroupsInvitations}
              userGroupPendingRequests={userGroupsPendingRequests}
            />
          </div>
        )}
      </div>
      <h2 className={'text-xl font-semibold mb-3'}>
        {groupsData.length > 0 ? (
          <p>Grupy, których {userData?.name} jest członkiem</p>
        ) : (
          <>{userData?.name} nie dołączył jeszcze do żadnej grupy</>
        )}
      </h2>
      <div className={'flex flex-col space-y-3'}>
        {isGroupsSuccess &&
          groupsData.map((group) => (
            <Link to={`/groups/${group.id}`} key={group.id}>
              <GroupCard group={group} isHorizontal isSmall />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default UserGroupsPage;
