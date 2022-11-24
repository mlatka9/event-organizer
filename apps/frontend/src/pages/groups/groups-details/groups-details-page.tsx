import { useGroupDetails } from '../../../layouts/group-details-layout';
import AvatarFallback from '../../../assets/images/avatar-fallback.svg';

const GroupsDetailsPage = () => {
  const { groupData } = useGroupDetails();
  return (
    <div className={'grid grid-cols-[3fr_2fr]'}>
      <div>content</div>
      <div>
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
    </div>
  );
};

export default GroupsDetailsPage;
