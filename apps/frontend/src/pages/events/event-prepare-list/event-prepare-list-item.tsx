import { EventPrepareItem } from '@event-organizer/shared-types';
import FallbackAvatar from '../../../assets/images/avatar-fallback.svg';
import clsx from 'clsx';
import { useAuth } from '../../../hooks/use-auth';
import { useEventDetails } from '../../../layouts/events-layout';
import PlusIcon from '../../../components/icons/plus-icons';
import { useToggleIsItemDoneMutation, useToggleParticipantDeclarationMutation } from '../../../hooks/mutation/events';
import Button from '../../../components/common/button';
import CheckboxFilledIcon from '../../../components/icons/checkbox-filled-icon';
import CheckboxEmptyIcon from '../../../components/icons/checkbox-empty-icon';
import { useState } from 'react';
import EllipsisIcon from '../../../components/icons/ellipsis-icon';
import EventPrepareListItemSettings from './event-prepare-list-item-settings';

interface EventPrepareListItemProps {
  item: EventPrepareItem;
}

const EventPrepareListItem = ({ item }: EventPrepareListItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { event } = useEventDetails();

  const { mutate: toggleDeclaration, isLoading: isToggleDeclarationSuccess } =
    useToggleParticipantDeclarationMutation();

  const { mutate: toggleIsDone, isLoading: isToggleIsDoneLoading } = useToggleIsItemDoneMutation();

  const handleToggleDeclaration = () => {
    toggleDeclaration({
      eventId: event.id,
      itemId: item.id,
    });
  };

  const handleToggleIsDone = () => {
    if (!user) return;
    toggleIsDone({
      eventId: event.id,
      itemId: item.id,
      participantId: user?.userId,
    });
  };

  const isCurrentUserDeclared = !!user && item.declaredParticipants.some((p) => p.id === user.userId);
  const isCurrentUserCanDeclare =
    !!user && (item.participantsLimit === -1 || item.participantsLimit > item.declaredParticipants.length);

  const isCurrentUserDone = !!item.declaredParticipants.find((p) => p.id === user?.userId)?.isDone;

  const doneCunt = item.declaredParticipants.reduce((sum, p) => (p.isDone ? sum + 1 : sum), 0);

  return (
    <div className={'bg-white p-3 mx-3 flex flex-col mb-6 bg-blue-50 rounded-md'}>
      <div className={'flex justify-between'}>
        <p className={'font-semibold text-neutral-800 mb-2 text-blue-900'}>{item.description}</p>
        <div className={'flex items-center relative gap-3'}>
          {isCurrentUserDeclared && (
            <button onClick={handleToggleIsDone} disabled={isToggleIsDoneLoading}>
              {isCurrentUserDone ? (
                <CheckboxFilledIcon width={30} height={30} className={'fill-blue-600'} />
              ) : (
                <CheckboxEmptyIcon width={30} height={30} />
              )}
            </button>
          )}
          <button onClick={() => setIsModalOpen(!isModalOpen)}>
            <EllipsisIcon />
          </button>
          {isModalOpen && (
            <EventPrepareListItemSettings itemId={item.id} closeSettingsModal={() => setIsModalOpen(false)} />
          )}
        </div>
      </div>
      <div
        className={clsx(
          'text-sm rounded-sm font-semibold px-1 py-[2px] mr-auto mb-10',
          item.isItemDone ? 'text-green-900 bg-green-100' : 'text-red-900 bg-red-100'
        )}
      >
        {item.isItemDone ? 'Gotowe' : 'W trakcie'} {doneCunt} / {item.declaredParticipants.length}
      </div>
      <div className={'flex items-center'}>
        {isCurrentUserCanDeclare && (
          <Button
            className={'!px-2 !py-1 mr-2'}
            disabled={isToggleDeclarationSuccess}
            isSmall
            onClick={handleToggleDeclaration}
          >
            {isCurrentUserDeclared ? 'Opuść' : 'Dołącz'}
          </Button>
        )}

        <p className={'text-sm'}>
          Zadeklarowani użytkownicy:{' '}
          {item.participantsLimit === -1
            ? item.declaredParticipants.length
            : `${item.declaredParticipants.length} / ${item.participantsLimit}`}
        </p>
        <div className={'flex ml-auto'}>
          {item.declaredParticipants.map((p) => (
            <div
              key={p.id}
              className={clsx('rounded-full overflow-hidden ring', item.isItemDone ? 'ring-green-500' : 'ring-red-500')}
            >
              <img className={'w-8 h-8'} src={p.image || FallbackAvatar} alt={p.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventPrepareListItem;
