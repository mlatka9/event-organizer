import { useForm } from 'react-hook-form';
import { CreateGroupInputType, createGroupSchema } from '@event-organizer/shared-types';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';

interface useGroupFormProps {
  defaultValues?: CreateGroupInputType;
}

const useGroupForm = ({ defaultValues }: useGroupFormProps = {}) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateGroupInputType>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      groupVisibility: 'PUBLIC',
      ...defaultValues,
    },
  });

  const handleSetError = (name: keyof CreateGroupInputType, message: string) => {
    setError(name, { message }, { shouldFocus: true });
  };

  const addImage = (imageUrl: string) => {
    setValue('bannerImage', imageUrl);
  };

  const removeImage = () => {
    setValue('bannerImage', undefined);
  };

  const selectedImage = watch('bannerImage') || null;

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

export default useGroupForm;
