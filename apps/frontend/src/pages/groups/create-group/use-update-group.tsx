import { useUpdateGroupMutation } from '../../../hooks/mutation/groups';
import { toast } from 'react-toastify';
import { UpdateGroupSchemaType } from '@event-organizer/shared-types';
import { useGroupDetails } from '../../../layouts/group-details-layout';

const useUpdateGroup = () => {
  const { groupData } = useGroupDetails();

  const onSuccess = () => {
    toast('Pomyślnie zaaktualizowano grupę', {
      type: 'success',
    });
  };

  const { mutate: updateGroup, isLoading } = useUpdateGroupMutation({ onSuccess });

  const onSubmit = (data: UpdateGroupSchemaType) => {
    console.log('data', data);
    updateGroup({
      name: data.name,
      description: data.description,
      bannerImage: data.bannerImage,
      categoryId: data.categoryId,
      groupVisibility: data.groupVisibility,
      groupId: groupData.id,
    });
  };

  return {
    onSubmit,
    isLoading,
  };
};

export default useUpdateGroup;
