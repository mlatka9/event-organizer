import ModalWrapper from '../common/modal-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryType, UpdateUserInputType, updateUserSchema } from '@event-organizer/shared-types';
import FormInput from '../form/form-input';
import CategoryTile from '../categories/category-tile';
import { useCategoriesQuery } from '../../hooks/query/categories';
import Button from '../common/button';
import { useUpdateUserMutation } from '../../hooks/mutations/users';
import { useRouter } from 'next/router';

interface UpdateUserModalProps {
  handleCloseModal: () => void;
  userId: string;
  currentName: string;
  currentImage: string | null;
  currentFavouriteCategories: CategoryType[];
}

type UpdateUserFormType = UpdateUserInputType;

const UpdateUserModal = ({
  handleCloseModal,
  currentFavouriteCategories,
  currentName,
  currentImage,
  userId,
}: UpdateUserModalProps) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserFormType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      image: currentImage || undefined,
      name: currentName,
      favouriteCategories: currentFavouriteCategories.map((c) => c.name),
    },
  });

  const updateUser = useUpdateUserMutation({ userId, onSuccess: handleCloseModal });
  const { isSuccess, data: categories } = useCategoriesQuery();

  const onSubmit = async (data: UpdateUserFormType) => {
    updateUser({
      userId,
      favouriteCategories: data.favouriteCategories,
      name: data.name,
      image: data.image,
    });
  };

  const selectedCategories = watch('favouriteCategories') || [];

  const addCategory = (categoryName: string) => {
    setValue('favouriteCategories', [...selectedCategories, categoryName]);
  };

  const removeCategory = (categoryName: string) => {
    console.log('removeCategory', categoryName);
    setValue(
      'favouriteCategories',
      selectedCategories.filter((c) => c !== categoryName)
    );
  };

  return (
    <ModalWrapper title={'Edytuj profil'} handleCloseModal={handleCloseModal}>
      <form onSubmit={handleSubmit(onSubmit)} className={'p-5 space-y-3 flex flex-col'}>
        <FormInput label={'name'} name={'name'} register={register} error={errors.name} />
        <FormInput label={'image'} name={'image'} register={register} error={errors.image} />
        <div className={'!mt-10'}>
          <p className={'font-semibold mb-2'}>Ulubione kategorie</p>
          <div className={'flex flex-wrap space-x-2'}>
            {selectedCategories.map((c) => (
              <CategoryTile key={c} name={c} iconType={'REMOVE'} onButtonClick={() => removeCategory(c)} />
            ))}
          </div>
        </div>
        <div className={'!mt-10'}>
          <p className={'font-semibold mb-2'}>Dost??pne kategorie</p>
          <div className={'flex flex-wrap  gap-y-2'}>
            {isSuccess &&
              categories
                .filter((c) => !selectedCategories.includes(c.name))
                .map((c) => (
                  <CategoryTile key={c.name} name={c.name} iconType={'ADD'} onButtonClick={() => addCategory(c.name)} />
                ))}
          </div>
        </div>
        <Button className={'ml-auto !mt-20'}>Zatwierd??</Button>
      </form>
    </ModalWrapper>
  );
};

export default UpdateUserModal;
