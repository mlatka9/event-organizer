import { useGroupDetails } from '../../../layouts/group-details-layout';
import AvatarFallback from '../../../assets/images/avatar-fallback.svg';
import { GroupChat } from './group-chat';

const GroupsDetailsPage = () => {
  const { groupData } = useGroupDetails();
  return (
    <div className={'grid lg:grid-cols-[3fr_2fr] grid-row gap-5 mb-20'}>
      <div className={'rounded-2xl shadow-md bg-white'}>
        <div className={'p-3'}>
          <h2 className={'text-lg font-semibold '}>Czat grupowy</h2>
        </div>
        <hr />
        <GroupChat groupId={groupData.id} />
      </div>

      <div className={'rounded-2xl shadow-md bg-white'}>
        <div className={'p-3'}>
          <h2 className={'text-lg font-semibold '}>Członkowie ({groupData.membersCount})</h2>
        </div>
        <hr />
        <div className={'flex justify-center items-center py-6 px-3 flex flex-wrap gap-5'}>
          {groupData.showcaseMembers.map((member) => (
            <img
              key={member.id}
              src={member.image || AvatarFallback}
              alt={member.name}
              className={'w-14 h-14 rounded-full block'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupsDetailsPage;
