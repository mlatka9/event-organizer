import ModalWrapper from '../common/modal-wrapper';
import { useState } from 'react';
import { UserType } from '@event-organizer/shared-types';
import { useSearchUsersToInviteQuery } from '../../hooks/query/events';
import Button from '../common/button';
import CloseIcon from '../icons/close-icon';
import { useCreateEventInvitationMutation } from '../../hooks/mutations/events';

interface EventInviteModalProps {
  handleCloseModal: () => void;
  eventId: string;
}

const EventInviteModal = ({ handleCloseModal, eventId }: EventInviteModalProps) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);

  const { data, isSuccess } = useSearchUsersToInviteQuery({
    eventId,
    phrase: inputValue,
  });

  const onMutationSuccess = () => {
    handleCloseModal();
  };

  const { mutate: createEventInvitation, isLoading } = useCreateEventInvitationMutation(onMutationSuccess);

  const handleSelectUser = (user: UserType) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleUnselectUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleInviteToEvent = () => {
    createEventInvitation({
      ids: selectedUsers.map((user) => user.id),
      eventId,
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
          <div>
            {isSuccess &&
              data.map((user) => {
                const isUserSelected = selectedUsers.some((u) => u.id === user.id);
                return (
                  <div key={user.id} className={'flex items-center'}>
                    <img src={user.image || '/images/avatar-fallback.svg'} className={'w-10 h-10 rounded-full'} />
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
          <div>
            {selectedUsers.map((user) => (
              <div key={user.id} className={'flex items-center'}>
                <img src={user.image || '/images/avatar-fallback.svg'} className={'w-10 h-10 rounded-full'} />
                <p className={'ml-3'}>{user.name}</p>
                <button onClick={() => handleUnselectUser(user.id)} className={'ml-auto'}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button kind={'secondary'} className={'mt-auto self-end'} onClick={handleInviteToEvent} disabled={isLoading}>
        Wyślij zaproszenia
      </Button>
    </ModalWrapper>
  );
};

export default EventInviteModal;
