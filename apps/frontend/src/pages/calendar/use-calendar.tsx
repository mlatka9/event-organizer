import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useUserEventsQuery } from '../../hooks/query/users';
import { useAuth } from '../../hooks/use-auth';

dayjs.extend(isoWeek);

export type CalendarDate = dayjs.Dayjs;

export interface VisibleMonthType {
  monthName: string;
  daysOffset: number;
  visibleDates: {
    events: { id: string; name: string }[];
    date: CalendarDate;
  }[];
}

export const useCalendar = () => {
  const [colors, setColors] = useState();
  const { user, isLoading } = useAuth();
  const [monthOffset, setMonthOffset] = useState(0);
  const currentMonth = dayjs().add(monthOffset, 'month');
  const firstDayOfMonth = currentMonth.startOf('month');
  const lastDayOfMonth = currentMonth.endOf('month');

  const {
    data,
    isSuccess,
    isFetching,
    isLoading: isEventsLoading,
  } = useUserEventsQuery({
    userId: user?.userId,
    enabled: !isLoading,
    startBound: firstDayOfMonth.toISOString(),
    endBound: lastDayOfMonth.toISOString(),
  });

  const calculateVisibleDates = () => {
    const firstMonthWeekday = firstDayOfMonth.isoWeekday();
    const daysOffset = firstMonthWeekday - 1;

    const monthDays = [];

    for (let i = 0; i < lastDayOfMonth.date(); i++) {
      monthDays.push(firstDayOfMonth.add(i, 'day'));
    }

    return {
      monthName: currentMonth.format('MMMM YYYY'),
      daysOffset,
      visibleDates: monthDays.map((date) => {
        const dayUpperBound = date.add(1, 'day').subtract(1, 'second');

        const events = isSuccess
          ? {
              date: date,
              events: data.filter(
                (event) =>
                  event.endDate &&
                  event.startDate &&
                  dayjs(event.endDate).isAfter(date) &&
                  dayjs(event.startDate).isBefore(dayUpperBound)
              ),
            }
          : {
              events: [],
              date: date,
            };

        const distinctEventsIds = events.events.map((event) => event.id);

        return events;
      }),
    };
  };

  const handlePrevMonthClick = (): void => {
    setMonthOffset(monthOffset - 1);
  };

  const handleNextMonthClick = (): void => {
    setMonthOffset(monthOffset + 1);
  };

  const visibleMonth = useMemo<VisibleMonthType>(() => {
    return calculateVisibleDates();
  }, [calculateVisibleDates]);

  return { visibleMonth, handlePrevMonthClick, handleNextMonthClick, monthOffset, isEventsLoading };
};
