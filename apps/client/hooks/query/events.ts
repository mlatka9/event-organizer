import { useQuery } from '@tanstack/react-query';
import eventsAPI from '../../api/events';
import { EventDetailsType } from '@event-organizer/shared-types';
import { APIError } from '../../api/types';

interface UseEventsQueryProps {
  page?: number;
  enabled?: boolean;
  city?: string;
  category?: string;
  locationStatus?: string;
  visibilityStatus?: string;
  timeRange?: string;
}

export const useEventsQuery = ({
  enabled = true,
  page,
  city,
  category,
  locationStatus,
  visibilityStatus,
  timeRange,
}: UseEventsQueryProps) => {
  // console.log('call useEventsQuery', enabled, city);
  return useQuery(
    ['events', page, city, locationStatus, visibilityStatus, timeRange, category],
    () => eventsAPI.getEvents({ page, city, locationStatus, visibilityStatus, timeRange, category }),
    {
      enabled,
      keepPreviousData: true,
    }
  );
};

export const useEventInfoQuery = (id: string, enabled = true) => {
  return useQuery<EventDetailsType, APIError>(['event', id], () => eventsAPI.getEventInfo(id), {
    enabled,
    retry: false,
  });
};
