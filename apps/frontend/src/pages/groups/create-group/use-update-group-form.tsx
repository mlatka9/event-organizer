import { useForm } from 'react-hook-form';
import {
  CreateGroupInputType,
  createGroupSchema,
  updateGroupSchema,
  UpdateGroupSchemaType,
} from '@event-organizer/shared-types';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';

interface useGroupFormProps {
  defaultValues?: UpdateGroupSchemaType;
}

const useUpdateGroupForm = ({ defaultValues }: useGroupFormProps = {}) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateGroupSchemaType>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      groupVisibility: 'PUBLIC',
      ...defaultValues,
    },
  });

  console.log('errors', errors);

  const handleSetError = (name: keyof CreateGroupInputType, message: string) => {
    setError(name, { message }, { shouldFocus: true });
  };

  const addImage = (imageUrl: string) => {
    setValue('bannerImage', imageUrl);
  };

  const removeImage = () => {
    setValue('bannerImage', null);
  };

  const selectedImage = watch('bannerImage');

  console.log('selectedImage', selectedImage);

  return {
    register,
    handleSubmit,
    setError,
    errors,
    handleSetError,
    addImage,
    removeImage,
    selectedImage,
  };
};

export default useUpdateGroupForm;
