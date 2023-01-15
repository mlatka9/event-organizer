import ClockIcon from '../../../../components/icons/clock-icon';
import CheckboxEmptyIcon from '../../../../components/icons/checkbox-empty-icon';
import CheckboxFilledIcon from '../../../../components/icons/checkbox-filled-icon';
import avatarFallback from '../../../../assets/images/avatar-fallback.svg';
import EllipsisIcon from '../../../../components/icons/ellipsis-icon';
import EventDatePollSettings from './event-date-poll-settings';

import { useToggleDatePollOptionMutation } from '../../../../hooks/mutation/events';
import { useEventDetails } from '../../../../layouts/events-layout';

import { EventDatePollOptionType } from '@event-organizer/shared-types';
import dayjs from 'dayjs';
import clsx from 'clsx';

interface EventDatePollOptionProps {
  option: EventDatePollOptionType;
  datePollId: string;
  eventId: string;
  isCurrentlySelected: boolean;
  isSettingsModalOpen: boolean;
  handleToggleOpenedSettingsModal: (id: string) => void;
}

const EventDatePollOption = ({
  option,
  datePollId,
  eventId,
  isCurrentlySelected,
  isSettingsModalOpen,
  handleToggleOpenedSettingsModal,
}: EventDatePollOptionProps) => {
  const { event } = useEventDetails();
  const { mutate: toggleDatePollOption, isLoading } = useToggleDatePollOptionMutation({
    optionId: option.id,
  });

  const handleToggleDatePollOption = () => {
    if (isLoading) return;
    toggleDatePollOption({
      datePollId,
      eventId,
      optionId: option.id,
    });
  };

  return (
    <div
      className={clsx(
        'p-3 flex items-center rounded-md transition-colors mb-2 cursor-pointer',
        option.isSelected && 'bg-blue-50',
        isCurrentlySelected && '!bg-blue-600'
      )}
      onClick={handleToggleDatePollOption}
    >
      <div className={'mr-20'}>
        {option.isSelected ? (
          <CheckboxFilledIcon
            className={clsx('fill-blue-400 animate-pop', isCurrentlySelected && '!fill-white')}
            width={30}
            height={30}
          />
        ) : (
          <CheckboxEmptyIcon
            className={clsx('fill-gray-400', isCurrentlySelected && '!fill-white')}
            width={30}
            height={30}
          />
        )}
      </div>
      <div>
        <div className={'flex'}>
          <ClockIcon className={clsx(isCurrentlySelected && 'fill-white')} />
          <p className={clsx('text ml-1 text-sm font-semibold', isCurrentlySelected && 'text-white')}>Start</p>
        </div>
        <p className={'flex flex-col ml-6 text-gray-600'}>
          <span className={clsx('text-sm text-gray-600', isCurrentlySelected && '!text-white')}>
            {dayjs(new Date(option.startDate)).format('DD MMMM YYYY')}
          </span>
          <span className={clsx('text-sm text-gray-600', isCurrentlySelected && '!text-white')}>
            {dayjs(new Date(option.startDate)).format('HH:mm')}
          </span>
        </p>
      </div>
      {option.endDate && option.startDate !== option.endDate && (
        <div className={'ml-5'}>
          <div className={'flex'}>
            <ClockIcon className={clsx(isCurrentlySelected && 'fill-white')} />
            <p className={clsx('text ml-1 text-sm font-semibold', isCurrentlySelected && 'text-white')}>Koniec</p>
          </div>
          <p className={'flex flex-col ml-6 text-gray-600'}>
            <span className={clsx('text-sm text-gray-600', isCurrentlySelected && '!text-white')}>
              {dayjs(new Date(option.endDate)).format('DD MMMM YYYY')}
            </span>
            <span className={clsx('text-sm text-gray-600', isCurrentlySelected && '!text-white')}>
              {dayjs(new Date(option.endDate)).format('HH:mm')}
            </span>
          </p>
        </div>
      )}
      <div className={'flex flex-col mt-auto ml-auto items-end gap-2'}>
        {event.isCurrentUserAdmin && (
          <div className={'relative'}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleOpenedSettingsModal(option.id);
              }}
            >
              <EllipsisIcon className={clsx(isCurrentlySelected && 'fill-white')} />
            </button>
            {isSettingsModalOpen && (
              <EventDatePollSettings
                option={option}
                eventDatePollId={datePollId}
                closeSettingsModal={() => handleToggleOpenedSettingsModal(option.id)}
                isCurrentlySelected={isCurrentlySelected}
              />
            )}
          </div>
        )}
        <div className={'flex'}>
          {option.showCaseUsers.map((user) => (
            <img key={user.id} src={user.image || avatarFallback} alt={user.name} className={'rounded-full w-8 h-8'} />
          ))}
          {option.showCaseUsers.length < option.userCount && (
            <div className={'w-8 h-8 bg-gray-800 text-white'}>
              {`+ ${option.userCount - option.showCaseUsers.length}`}
            </div>
          )}
        </div>
        <div className={clsx(isCurrentlySelected && 'text-white')}>
          Osób wybrało ten termin: <span className={'font-semibold'}>{option.userCount}</span>
        </div>
      </div>
    </div>
  );
};

export default EventDatePollOption;
