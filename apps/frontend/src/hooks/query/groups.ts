import { useInfiniteQuery } from '@tanstack/react-query';
import groupsAPI from '../../api/groups';
import { GetAllGroupsQueryParamsType } from '@event-organizer/shared-types';

export const useGroupsQuery = ({
  enabled,
  ...filters
}: Omit<GetAllGroupsQueryParamsType, 'cursor'> & { enabled?: boolean } = {}) => {
  return useInfiniteQuery(
    ['groups', filters],
    ({ pageParam }) => {
      return groupsAPI.getGroups({
        ...filters,
        cursor: pageParam,
      });
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      retry: false,
      keepPreviousData: true,
      enabled,
    }
  );
};
