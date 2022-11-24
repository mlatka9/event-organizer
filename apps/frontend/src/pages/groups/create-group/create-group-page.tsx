import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { useCategoriesQuery } from '../../../hooks/query/categories';
import { CreateGroupInputType, createGroupSchema } from '@event-organizer/shared-types';
import FileIcon from '../../../components/icons/file-icon';
import FormInput from '../../../components/form/form-input';
import FormTextarea from '../../../components/form/form-textarea';
import FormSelect from '../../../components/form/form-select';
import React from 'react';
import Heading from '../../../components/common/heading';
import Button from '../../../components/common/button';
import { useCreateGroupMutation } from '../../../hooks/mutation/groups';
import { APIError } from '../../../libs/api/types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const groupVisibilityOptions = [
  { label: 'publiczny', value: 'PUBLIC' },
  { label: 'prywatny', value: 'PRIVATE' },
];

const CreateGroupPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateGroupInputType>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      groupVisibility: 'PUBLIC',
    },
  });

  const onSuccess = (data: { id: string }) => {
    toast('Pomyślnie utworzono grupę', {
      type: 'success',
    });
    navigate(`/groups/${data.id}`);
  };

  const onError = (error: APIError) => {
    console.log(error);
    if (error.response?.status === 409) {
      setError('name', { message: 'Grupa o podanej nazwie już istnieje' }, { shouldFocus: true });
    }
  };

  const { mutate: createGroup, isLoading } = useCreateGroupMutation({ onSuccess, onError });
  const { data, isSuccess } = useCategoriesQuery();

  const eventCategoryOptions = isSuccess
    ? data.map((category) => ({
        label: category.name,
        value: category.id,
      }))
    : [];

  const onSubmit = (data: CreateGroupInputType) => {
    createGroup({
      name: data.name,
      description: data.description,
      bannerImage: data.bannerImage,
      categoryId: data.categoryId,
      groupVisibility: data.groupVisibility,
    });
  };

  return (
    <div className={'pt-10 w-full w-[1000px]'}>
      <Heading className={'mb-10'}>Utwórz grupę</Heading>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mb-20 flex flex-col">
        <div className={'flex'}>
          <FileIcon width={50} height={50} />
          <div className={'ml-5'}>
            <h2 className={'text-2xl font-semibold text-neutral-800'}>Podstawowe informacje</h2>
            <p className={'text-gray-600'}>
              Nazwij swoją grupę, zachęć innych do uczestnictwa i opisz czym twoja grupa się wyróżnia
            </p>
          </div>
        </div>
        <div className={'space-y-5 ml-[70px] mt-10 mb-20'}>
          <FormInput label="nazwa" register={register} name="name" error={errors.name} />
          <FormTextarea label="description" register={register} name="description" error={errors.description} />
          <FormInput label="obrazek" register={register} name="bannerImage" error={errors.bannerImage} />
          <div className={'grid grid-cols-2 gap-3'}>
            <FormSelect
              label={'widoczność'}
              name={'groupVisibility'}
              register={register}
              options={groupVisibilityOptions}
              error={errors.groupVisibility}
            />
            <FormSelect
              label={'kategoria'}
              name={'categoryId'}
              register={register}
              options={eventCategoryOptions}
              error={errors.categoryId}
            />
          </div>
        </div>
        <Button type={'submit'} className={'ml-auto'} disabled={isLoading}>
          Utwórz
        </Button>
      </form>
    </div>
  );
};

export default CreateGroupPage;
