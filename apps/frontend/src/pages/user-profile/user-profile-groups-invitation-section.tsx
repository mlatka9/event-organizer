import { GroupInvitationType } from '@event-organizer/shared-types';
import GroupInvitationToAcceptCard from '../groups/groups-details/group-invitation-to-accept-card';
import GroupSentInvitationCard from '../groups/groups-details/group-sent-invitation-card';

interface UserProfileInvitationsSectionProps {
  userGroupInvitation: GroupInvitationType[];
  userGroupPendingRequests: GroupInvitationType[];
}

const UserProfileGroupsInvitationsSection = ({
  userGroupInvitation,
  userGroupPendingRequests,
}: UserProfileInvitationsSectionProps) => {
  return (
    <>
      {userGroupInvitation.length > 0 && (
        <div className={'mb-10'}>
          <h2 className={'text-xl font-semibold mb-3'}>Do akceptacji</h2>
          {userGroupInvitation.map((i) => (
            <div className={'bg-white p-5 rounded-md shadow'} key={i.id}>
              <GroupInvitationToAcceptCard
                key={i.id}
                image={i.group.bannerImage}
                name={i.group.name}
                groupId={i.group.id}
                invitationId={i.id}
              />
            </div>
          ))}
        </div>
      )}
      {userGroupPendingRequests.length > 0 && (
        <div className={'mb-10'}>
          <h2 className={'text-xl font-semibold mb-3'}>Wysłane prośby o dodanie</h2>
          {userGroupPendingRequests.map((i) => (
            <div className={'bg-white p-5 rounded-md shadow'} key={i.id}>
              <GroupSentInvitationCard
                key={i.id}
                image={i.group.bannerImage}
                name={i.group.name}
                groupId={i.group.id}
                invitationId={i.id}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserProfileGroupsInvitationsSection;
