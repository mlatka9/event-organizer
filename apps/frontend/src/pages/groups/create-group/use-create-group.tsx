import { useCreateGroupMutation } from '../../../hooks/mutation/groups';
import { CreateGroupInputType } from '@event-organizer/shared-types';
import { toast } from 'react-toastify';
import { APIError } from '../../../libs/api/types';
import { useNavigate } from 'react-router-dom';

interface UseCreateGroupProps {
  setError: (name: keyof CreateGroupInputType, message: string) => void;
}

const useCreateGroup = ({ setError }: UseCreateGroupProps) => {
  const navigate = useNavigate();

  const onSuccess = (data: { id: string }) => {
    toast('Pomyślnie utworzono grupę', {
      type: 'success',
    });
    navigate(`/groups/${data.id}`);
  };

  const onError = (error: APIError) => {
    if (error.response?.status === 409) {
      setError('name', 'Grupa o podanej nazwie już istnieje');
    }
  };

  const { mutate: createGroup, isLoading } = useCreateGroupMutation({ onSuccess, onError });

  const onSubmit = (data: CreateGroupInputType) => {
    createGroup({
      name: data.name,
      description: data.description,
      bannerImage: data.bannerImage,
      categoryId: data.categoryId,
      groupVisibility: data.groupVisibility,
    });
  };

  return {
    onSubmit,
    isLoading,
  };
};

export default useCreateGroup;
