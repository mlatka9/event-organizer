import UserLayout from '../../../components/layouts/user-layout';
import { useUserQuery } from '../../../hooks/query/users';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Button from '../../../components/common/button';
import { useState } from 'react';
import UpdateUserModal from '../../../components/user/update-user-modal';

const UserProfilePage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const { data: user, isSuccess } = useUserQuery(userId, router.isReady);

  if (!isSuccess) return <UserLayout />;

  const toggleIsModalOpen = () => setIsUpdateModalOpen(!isUpdateModalOpen);

  return (
    <UserLayout>
      {isUpdateModalOpen && (
        <UpdateUserModal
          userId={user.id}
          handleCloseModal={() => setIsUpdateModalOpen(false)}
          currentFavouriteCategories={user.favouriteCategories}
          currentImage={user.image}
          currentName={user.name}
        />
      )}
      <div className={'flex justify-center mb-20'}>
        <img
          src={user.image || '/images/avatar-fallback.svg'}
          className={'block w-72 h-72 rounded-full object-cover'}
        />
        <div className={'flex flex-col justify-center ml-5'}>
          <h1 className={'text-5xl font-semibold mb-5'}>{user.name}</h1>
          <p className={'text-xl font-semibold mb-5'}>Dołączył {dayjs(user.joinedAt).format('DD.MM.YYYY')}</p>
          {user.isMe && <Button onClick={toggleIsModalOpen}>Edytuj profil</Button>}
        </div>
      </div>
      <h2 className={'font-semibold text-xl mb-5'}>Ulubione kategorie</h2>
      <div className={'flex space-x-2 flex-wrap'}>
        {user.favouriteCategories.map((category) => (
          <div className={'bg-white rounded-full px-4 py-2 text-lg'} key={category.id}>
            {category.name}
          </div>
        ))}
      </div>
    </UserLayout>
  );
};

export default UserProfilePage;
