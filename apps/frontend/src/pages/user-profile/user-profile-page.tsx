import dayjs from 'dayjs';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserQuery } from '../../hooks/query/users';
import UpdateUserModal from './update-user-modal';
import Button from '../../components/common/button';
import AvatarFallback from '../../assets/images/avatar-fallback.svg';
import useBreakpoint from 'use-breakpoint';
import { BREAKPOINTS } from '../../constants/breakboints';

const UserProfilePage = () => {
  const params = useParams();
  const userId = params['id'] as string;

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { data: user, isSuccess, isError } = useUserQuery(userId);
  const toggleIsModalOpen = () => setIsUpdateModalOpen(!isUpdateModalOpen);

  if (isError) return <div>Błąd! Użytkownik nie istnieje</div>;
  if (!isSuccess) return <div>Loading</div>;

  return (
    <>
      {isUpdateModalOpen && (
        <UpdateUserModal
          userId={user.id}
          handleCloseModal={() => setIsUpdateModalOpen(false)}
          currentFavouriteCategories={user.favouriteCategories}
          currentImage={user.image}
          currentName={user.name}
        />
      )}
      <div className={'flex flex-col items-center lg:flex-row justify-center mb-20'}>
        <img src={user.image || AvatarFallback} className={'block w-72 h-72 rounded-full object-cover'} />
        <div className={'flex flex-col justify-center ml-5 items-center'}>
          <h1 className={'text-3xl lg:text-5xl font-semibold mb-5'}>{user.name}</h1>
          <p className={'text-md lg:text-xl font-semibold mb-5'}>
            Dołączył {dayjs(user.joinedAt).format('DD.MM.YYYY')}
          </p>
          {user.isMe && (
            <Button onClick={toggleIsModalOpen} data-cy="edit-profile-button">
              Edytuj profil
            </Button>
          )}
        </div>
      </div>
      {user.favouriteCategories.length > 0 && (
        <>
          <h2 className={'font-semibold text-xl mb-5'}>Ulubione kategorie</h2>
          <div className={'flex space-x-2 flex-wrap'}>
            {user.favouriteCategories.map((category) => (
              <div className={'bg-white rounded-full px-4 py-2 text-lg shadow-sm'} key={category.id}>
                {category.name}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default UserProfilePage;
