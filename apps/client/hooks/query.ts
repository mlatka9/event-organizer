import { useQuery } from '@tanstack/react-query';
import authAPI from '../api/user';

export const useMeQuery = () => {
  return useQuery(['me'], authAPI.me, {
    retry: false,
  });
};
