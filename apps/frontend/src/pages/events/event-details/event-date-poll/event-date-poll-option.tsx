import { EventDatePollOptionType } from '@event-organizer/shared-types';
import ClockIcon from '../../../../components/icons/clock-icon';
import dayjs from 'dayjs';
import CheckboxEmptyIcon from '../../../../components/icons/checkbox-empty-icon';
import CheckboxFilledIcon from '../../../../components/icons/checkbox-filled-icon';
import avatarFallback from '../../../../assets/images/avatar-fallback.svg';
import { useToggleDatePollOptionMutation } from '../../../../hooks/mutation/events';
import clsx from 'clsx';

interface EventDatePollOptionProps {
  option: EventDatePollOptionType;
  datePollId: string;
  eventId: string;
}

const EventDatePollOption = ({ option, datePollId, eventId }: EventDatePollOptionProps) => {
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
        option.isSelected && 'bg-blue-50'
      )}
      onClick={handleToggleDatePollOption}
    >
      <div className={'mr-20'}>
        {option.isSelected ? (
          <CheckboxFilledIcon className={'fill-blue-400 animate-pop'} width={30} height={30} />
        ) : (
          <CheckboxEmptyIcon className={'fill-gray-400'} width={30} height={30} />
        )}
      </div>
      <div>
        <div className={'flex'}>
          <ClockIcon />
          <p className={'text ml-1 text-sm font-semibold'}>Start wydarzenia</p>
        </div>
        <p className={'flex flex-col ml-6 text-gray-600'}>
          <span className={'text-sm text-gray-600'}>{dayjs(new Date(option.startDate)).format('DD MMMM YYYY')}</span>
          <span className={'text-sm text-gray-600'}>{dayjs(new Date(option.startDate)).format('HH:mm')}</span>
        </p>
      </div>
      {option.endDate && (
        <div className={'ml-5'}>
          <div className={'flex'}>
            <ClockIcon />
            <p className={clsx('text ml-1 text-sm font-semibold')}>Koniec wydarzenia</p>
          </div>
          <p className={'flex flex-col ml-6 text-gray-600'}>
            <span className={'text-sm text-gray-600'}>{dayjs(new Date(option.startDate)).format('DD MMMM YYYY')}</span>
            <span className={'text-sm text-gray-600'}>{dayjs(new Date(option.startDate)).format('HH:mm')}</span>
          </p>
        </div>
      )}
      <div className={'flex flex-col mt-auto ml-auto items-end'}>
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
        <div>
          Osób wybrało ten termin: <span className={'font-semibold'}>{option.userCount}</span>
        </div>
      </div>
    </div>
  );
};

export default EventDatePollOption;
