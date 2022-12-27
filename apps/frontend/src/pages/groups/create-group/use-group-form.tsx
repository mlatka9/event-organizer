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

  return {
    register,
    handleSubmit,
    setError,
    errors,
    handleSetError,
  };
};

export default useGroupForm;
