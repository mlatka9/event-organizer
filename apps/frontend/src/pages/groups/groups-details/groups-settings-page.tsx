import FileIcon from '../../../components/icons/file-icon';
import FormInput from '../../../components/form/form-input';
import FormTextarea from '../../../components/form/form-textarea';
import FormSelect from '../../../components/form/form-select';
import Button from '../../../components/common/button';
import React from 'react';
import { useCategoriesQuery } from '../../../hooks/query/categories';
import useGroupForm from '../create-group/use-group-form';
import useUpdateGroup from '../create-group/use-update-group';
import { useGroupDetails } from '../../../layouts/group-details-layout';
import useUpdateGroupForm from '../create-group/use-update-group-form';
import FormImageUploader from '../../../components/form/form-image-uploader';

const groupVisibilityOptions = [
  { label: 'publiczny', value: 'PUBLIC' },
  { label: 'prywatny', value: 'PRIVATE' },
];

const GroupsSettingsPage = () => {
  const { groupData } = useGroupDetails();
  const { register, handleSubmit, errors, selectedImage, removeImage, addImage } = useUpdateGroupForm({
    defaultValues: {
      groupVisibility: groupData.groupVisibility,
      name: groupData.name,
      bannerImage: groupData.bannerImage || null,
      categoryId: groupData.category.id,
      description: groupData.description,
    },
  });
  const { onSubmit, isLoading } = useUpdateGroup();

  const { data, isSuccess } = useCategoriesQuery();

  const eventCategoryOptions = isSuccess
    ? data.map((category) => ({
        label: category.name,
        value: category.id,
      }))
    : [];

  return (
    <div>
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

          {/*<FormInput label="obrazek" register={register} name="bannerImage" error={errors.bannerImage} />*/}
          <FormImageUploader addImage={addImage} removeImage={removeImage} selectedImage={selectedImage} />
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

export default GroupsSettingsPage;
