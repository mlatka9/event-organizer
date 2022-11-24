import { useParams } from 'react-router-dom';
import { useEventInfoQuery, useGetAllParticipantsQuery } from '../../../hooks/query/events';
import EventAdminSettings from '../../events/event-details/event-admin-settings';
import EventParticipantCard from '../../events/event-details/event-participant-card';
import { useGroupMembersQuery } from '../../../hooks/query/groups';
import { useGroupDetails } from '../../../layouts/group-details-layout';
import GroupAdminSettings from './group-admin-settings';

const GroupsMembersPage = () => {
  const params = useParams();
  const groupId = params['groupId'] as string;

  const { groupData } = useGroupDetails();

  const { data: members, isSuccess: isMembersSuccess } = useGroupMembersQuery({ groupId });

  if (!isMembersSuccess) return <div>'members loading...'</div>;

  return (
    <>
      <div className={'flex justify-between'}>
        <div className={'mb-10'}>
          <h2 className={'font-semibold text-lg'}>Uczestnicy wydarzenia</h2>
        </div>
        {groupData.isUserAdmin && <GroupAdminSettings groupId={groupId} />}
      </div>
      <ul className={'px-10 py-5 flex flex-col space-y-3 bg-white rounded-md shadow-md'}>
        {isMembersSuccess &&
          members.map((p) => <EventParticipantCard key={p.id} id={p.id} name={p.name} image={p.image} role={p.role} />)}
      </ul>
    </>
  );
};

export default GroupsMembersPage;
