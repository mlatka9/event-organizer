import ChevronDownIcon from '../../components/icons/chevron-down-icon';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useCalendar } from './use-calendar';
import useBreakpoint from 'use-breakpoint';

const BREAKPOINTS = { sm: 0, md: 768, lg: 1024, xl: 1280 };

interface CalendarBoardProps {
  setSelectedDate: (date: string | undefined) => void;
  selectedDate: string | undefined;
}

const WEEKDAYS_NAMES = ['pn', 'wt', 'śr', 'cz', 'pt', 'so', 'nd'];

const CalendarBoard = ({ setSelectedDate, selectedDate }: CalendarBoardProps) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  console.log('CURRENT BREAK POINT ', breakpoint);
  const { visibleMonth, handlePrevMonthClick, handleNextMonthClick, isEventsLoading } = useCalendar();

  const currentDate = dayjs();

  const shorthandText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim();
  };

  const offsetArray = Array(visibleMonth.daysOffset).fill(0);

  const isMobileBreakpoint = breakpoint === 'sm';

  return (
    <div className={'bg-white rounded-md shadow-md'}>
      <div className={'py-5 flex justify-between px-2 lg:px-8 items-center'}>
        <div className={'font-semibold text-xl'}>{visibleMonth.monthName}</div>
        <div className={'space-x-3'}>
          <button
            onClick={handlePrevMonthClick}
            className={'p-3 rounded-full transition-colors bg-gray-100 hover:bg-gray-200'}
          >
            <ChevronDownIcon
              className={'rotate-90 fill-gray-600 transition-colors hover:fill-gray-700'}
              width={16}
              height={16}
            />
          </button>
          <button
            onClick={handleNextMonthClick}
            className={'p-3 rounded-full transition-colors bg-gray-100 hover:bg-gray-200'}
          >
            <ChevronDownIcon
              className={'-rotate-90 fill-gray-600 transition-colors hover:fill-gray-700'}
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>

      <div className={'grid grid-cols-7 relative'}>
        {WEEKDAYS_NAMES.map((day) => (
          <div
            className={'border-y border-r [&:nth-child(7n)]:border-r-0 border-neutral-100  bg-blue-200 text-blue-800'}
            key={day}
          >
            <div className={'flex justify-center'}>{day}</div>
          </div>
        ))}
        {offsetArray.map((el, index) => (
          <div key={index} className={'border-b border-r [&:nth-child(7n)]:border-r-0 border-neutral-100'} />
        ))}
        {visibleMonth.visibleDates.map((date) => {
          const isPastDate = date.date.isBefore(currentDate, 'day');
          const isCurrentDate = date.date.isSame(currentDate, 'day');
          const isSelectedDate = selectedDate ? date.date.isSame(dayjs(selectedDate), 'day') : false;

          return (
            <div
              key={date.date.date()}
              className={clsx(
                'cursor-pointer w-full h-[100px] md:h-[150px] flex text-xl flex-col border-b border-r [&:nth-child(7n)]:border-r-0 border-neutral-100',
                isPastDate && 'text-gray-300',
                isSelectedDate && 'outline outline-2 bg-indigo-50 !text-indigo-900 outline-indigo-500 z-10'
              )}
              onClick={() => (isSelectedDate ? setSelectedDate(undefined) : setSelectedDate(date.date.toISOString()))}
            >
              <div
                className={clsx(
                  ' rounded-full p-3 w-10 h-10 m-1 flex items-center justify-center',
                  isCurrentDate && 'bg-blue-500 text-white'
                )}
              >
                {date.date.date()}
              </div>
              <div className={'mt-auto'}>
                {date.events.slice(0, isMobileBreakpoint ? 0 : 2).map((event) => (
                  <div
                    key={event.id}
                    className={clsx(
                      'text-xs rounded-sm bg-indigo-50 text-indigo-500 font-semibold p-1 pl-2 m-1 relative overflow-hidden',
                      isSelectedDate && '!text-indigo-600 !bg-indigo-100'
                    )}
                  >
                    {shorthandText(event.name, 12)}
                    <div
                      className={clsx(
                        'absolute w-[2px] h-full left-0 top-0 bg-indigo-300',
                        isSelectedDate && '!bg-indigo-600'
                      )}
                    ></div>
                  </div>
                ))}
                {date.events.length > (isMobileBreakpoint ? 0 : 2) && (
                  <div
                    className={clsx(
                      'text-xs rounded-sm bg-red-50 text-red-500 font-semibold p-1 pl-2 m-1 relative overflow-hidden'
                    )}
                  >
                    {date.events.length - (isMobileBreakpoint ? 0 : 2)} {!isMobileBreakpoint && 'wiecej'}
                    <div className={'absolute w-[2px] h-full left-0 top-0 bg-red-300'}></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isEventsLoading && (
          <div
            className={
              'absolute bg-neutral-200/20 backdrop-blur-sm inset-0 top-6 flex items-center justify-center text-xl text-neutral-500'
            }
          >
            Ładowanie...
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarBoard;
