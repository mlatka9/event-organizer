import { useGroupsQuery } from '../../../hooks/query/groups';
import React, { Fragment, useEffect } from 'react';
import GroupCard from './group-card';
import Heading from '../../../components/common/heading';
import GroupsFilters from './groups-filters';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useInView } from 'react-intersection-observer';
import Button from '../../../components/common/button';
import PlusIcon from '../../../components/icons/plus-icons';

const searchParamsSchema = z.object({
  visibility: z.enum(['PRIVATE', 'PUBLIC']).optional(),
  search: z.string().optional(),
});

type SearchParamsType = z.infer<typeof searchParamsSchema>;

const GroupsHomePage = () => {
  const { ref, inView } = useInView({});
  const [searchParams, setSearchParams] = useSearchParams();

  const currentParams = {} as Record<string, string | undefined>;
  searchParams.forEach((key, value) => {
    currentParams[value] = key;
  });

  const validation = searchParamsSchema.safeParse(currentParams);
  const validatedSearchParams: SearchParamsType = currentParams as any;

  const updateParam = (params: Record<string, string>) => {
    const currentParams = { ...validatedSearchParams };

    Object.keys(params).forEach((key) => {
      if (!params[key] || params[key] === 'all') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete currentParams[key];
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        currentParams[key] = params[key];
      }
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSearchParams(currentParams);
  };

  const selectedVisibility = validatedSearchParams.visibility;
  const searchValue = validatedSearchParams.search || '';

  const {
    data: groupsData,
    fetchNextPage,
    hasNextPage,
    isSuccess,
  } = useGroupsQuery({
    limit: 4,
    name: searchValue,
    enabled: validation.success,
    visibility: selectedVisibility,
  });

  useEffect(() => {
    if (hasNextPage && isSuccess && inView) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isSuccess, fetchNextPage]);

  if (!validation.success) {
    return <Navigate to={'/groups'} />;
  }

  const onChangeVisibility = (e: React.ChangeEvent<HTMLInputElement>) => updateParam({ visibility: e.target.value });
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => updateParam({ search: e.target.value });

  return (
    <div className={'pt-10'}>
      <div className={'flex items-baseline mb-20'}>
        <Heading>Grupy</Heading>
        <Link
          className={'flex items-center px-3 ml-5 text-sm bg-blue-600 text-white font-semibold py-2 rounded-md'}
          to={'/groups/create'}
        >
          <PlusIcon height={12} width={12} className={'fill-white'} />
          <span className={'ml-2'}>Utwórz nową</span>
        </Link>
      </div>
      <GroupsFilters
        onChangeSearch={onChangeSearch}
        onChangeVisibility={onChangeVisibility}
        searchValue={searchValue}
        selectedVisibility={selectedVisibility}
      />

      {isSuccess ? (
        <div className={'grid grid-cols md:grid-cols-2 lg:grid-cols-3 gap-10'}>
          {groupsData.pages.map((page, index) => (
            <Fragment key={index}>
              {page.groups.map((group) => (
                <GroupCard group={group} key={group.id} />
              ))}
            </Fragment>
          ))}
          <div ref={ref} className={'h-10 w-full bg-pink-500'} />
        </div>
      ) : (
        <div className={'h-[1000px] bg-pink-400'} />
      )}
    </div>
  );
};

export default GroupsHomePage;
