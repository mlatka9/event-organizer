import CalendarBoard from './calendar-board';
import { useState } from 'react';
import CalendarEventsList from './calendar-events-list';
import clsx from 'clsx';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const unselectDate = () => setSelectedDate(undefined);

  return (
    <div className={'my-10'}>
      <h1 className={'font-semibold text-4xl text-neutral-800'}>Kalendarz</h1>
      <div className={clsx('mt-10 gap-10 transition-all duration-500 p-1 rounded-md')}>
        <CalendarBoard setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
        <div
          className={clsx(
            'fixed bg-white z-10 top-0 shadow-md h-full w-[500px] right-0 translate-x-full transition-transform duration-300 z-20',
            selectedDate && '!translate-x-0'
          )}
        >
          <CalendarEventsList selectedDate={selectedDate} unselectDate={unselectDate} />
        </div>
        {selectedDate && (
          <div className={'fixed bg-neutral-800/50 backdrop-blur-[2px] inset-0 z-10'} onClick={unselectDate} />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
