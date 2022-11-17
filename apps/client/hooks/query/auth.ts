import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import authAPI from '../../api/auth';
import { useRouter } from 'next/router';

interface UseMeQueryProps {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export const useMeQuery = ({ redirectTo, redirectIfFound }: UseMeQueryProps = {}) => {
  const router = useRouter();
  const me = useQuery(['me'], authAPI.me, {
    retry: false,
  });

  useEffect(() => {
    if (!redirectTo || !me.isFetched) return;
    if ((redirectTo && !redirectIfFound && !me.isSuccess) || (redirectIfFound && me.isSuccess)) {
      router.push(redirectTo);
    }
  }, [router, me.data, me.isFetched, redirectTo, redirectIfFound]);

  return me;
};
