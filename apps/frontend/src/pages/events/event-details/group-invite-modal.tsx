import { useState } from 'react';
import { UserType } from '@event-organizer/shared-types';
import ModalWrapper from '../../../components/common/modal-wrapper';
import Button from '../../../components/common/button';
import CloseIcon from '../../../components/icons/close-icon';
import { useCreateGroupInvitationMutation, useSearchUsersToGroupInviteQuery } from '../../../hooks/query/groups';
import { toast } from 'react-toastify';
import AvatarFallback from '../../../assets/images/avatar-fallback.svg';

interface GroupInviteModalProps {
  handleCloseModal: () => void;
  groupId: string;
}

const GroupInviteModal = ({ handleCloseModal, groupId }: GroupInviteModalProps) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);

  const { data, isSuccess } = useSearchUsersToGroupInviteQuery({
    groupId,
    phrase: inputValue,
  });

  const onMutationSuccess = () => {
    toast(selectedUsers.length > 1 ? 'Zaproszenia zostały wysłane' : 'Zaproszenie zostało wysłane', {
      type: 'success',
    });
    handleCloseModal();
  };

  const { mutate: createGroupInvitation, isLoading } = useCreateGroupInvitationMutation(onMutationSuccess);

  const handleSelectUser = (user: UserType) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleUnselectUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleInviteToGroup = () => {
    createGroupInvitation({
      ids: selectedUsers.map((user) => user.id),
      groupId,
    });
  };

  return (
    <ModalWrapper title={'Zaproś do wydarzenia'} handleCloseModal={handleCloseModal}>
      <div className={'grid grid-cols-[3fr_2fr] gap-5 min-h-[500px]'}>
        <div>
          <input
            value={inputValue}
            onChange={({ target }) => setInputValue(target.value)}
            className={'border w-full mb-3'}
          />
          <div className={'flex flex-col space-y-3'}>
            {isSuccess &&
              data.map((user) => {
                const isUserSelected = selectedUsers.some((u) => u.id === user.id);
                return (
                  <div key={user.id} className={'flex items-center'}>
                    <img src={user.image || AvatarFallback} className={'w-10 h-10 rounded-full'} />
                    <p className={'ml-3'}>{user.name}</p>
                    <Button
                      isSmall
                      kind={isUserSelected ? 'error' : undefined}
                      className={'ml-auto'}
                      onClick={isUserSelected ? () => handleUnselectUser(user.id) : () => handleSelectUser(user)}
                    >
                      {isUserSelected ? 'usuń' : 'dodaj'}
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
        <div>
          <p className={'mb-3'}>Wybrano {selectedUsers.length} osób</p>
          <div className={'flex flex-col space-y-3'}>
            {selectedUsers.map((user) => (
              <div key={user.id} className={'flex items-center'}>
                <img src={user.image || AvatarFallback} className={'w-10 h-10 rounded-full'} />
                <p className={'ml-3'}>{user.name}</p>
                <button onClick={() => handleUnselectUser(user.id)} className={'ml-auto'}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button kind={'secondary'} className={'mt-auto self-end'} onClick={handleInviteToGroup} disabled={isLoading}>
        Wyślij zaproszenia
      </Button>
    </ModalWrapper>
  );
};

export default GroupInviteModal;
