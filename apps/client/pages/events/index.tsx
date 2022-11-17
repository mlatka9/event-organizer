import { useRouter } from 'next/router';
import MainLayout from '../../components/layouts/main-layout';
import { useCategoriesQuery } from '../../hooks/query/categories';
import EventCard from '../../components/event/event-card';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import AsyncSelect from 'react-select/async';

import eventsAPI from '../../api/events';
import FiltersModal from '../../components/event/filters-modal';
import FilterTile from '../../components/event/filter-tile';
import FilterIcon from '../../components/icons/filter-icon';
import Link from 'next/link';
import Pagination from '../../components/common/pagination';
import { useEventsQuery } from '../../hooks/query/events';
import { GetAllEventsInputType, getAllEventsSchema } from '@event-organizer/shared-types';
import PlusIcon from '../../components/icons/plus-icons';
import { useMeQuery } from '../../hooks/query/auth';

const MapWithNoSSR = dynamic(() => import('../../components/map'), {
  ssr: false,
});

const filtersMap = {
  locationStatus: {
    STATIONARY: 'stacjonarnie',
    ONLINE: 'online',
  },
  timeRange: {
    TODAY: 'dziś',
    THISWEEK: 'ten tydzień',
    THISMONTH: 'ten miesiąc',
  },
};

const EventsPage = () => {
  const router = useRouter();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [focusedMarkerId, setFocusedMarkerId] = useState<undefined | string>(undefined);
  const { isSuccess: isMeSuccess, data: meData } = useMeQuery();

  const { data: categories, isSuccess: isCategoriesSuccess } = useCategoriesQuery();

  const updateParam = (key: string, value: string | undefined) => {
    const currentParams = { ...router.query };
    if (!value) {
      delete currentParams[key];
      router.replace({
        query: currentParams,
      });
    } else {
      router.replace({
        query: { ...router.query, [key]: value },
      });
    }
  };

  const validation = getAllEventsSchema.safeParse(router.query);

  const { page, timeRange, category, locationStatus, city }: GetAllEventsInputType = router.query;

  const { data: eventsData, isSuccess: isEventsSuccess } = useEventsQuery({
    page,
    city,
    category,
    locationStatus,
    timeRange,
    enabled: validation.success,
  });

  if (!validation.success) {
    router.push('/events');
    return;
  }

  const isMarkerType = (marker: {
    id: string;
    longitude: number | null;
    latitude: number | null;
  }): marker is { id: string; longitude: number; latitude: number } => !!marker.latitude && !!marker.latitude;

  const locationMarker = isEventsSuccess
    ? eventsData.events
        .map((event) => ({
          id: event.id,
          longitude: event.longitude,
          latitude: event.latitude,
        }))
        .filter(isMarkerType)
    : [];

  const loadOptions = async (inputValue: string) => {
    const normalizedCities = await eventsAPI.getNormalizedCities(inputValue);
    return normalizedCities.map((city) => ({
      value: city.name,
      label: city.name,
    }));
  };

  const selectedCategory =
    (category && isCategoriesSuccess && categories.find((c) => c.name === category)?.name) || 'all';

  if (!router.isReady || !isCategoriesSuccess || !isEventsSuccess) return <MainLayout />;

  return (
    <MainLayout>
      <div className={'mt-10'}>
        <div className={'flex items-center justify-between mb-20'}>
          <h1 className={'font-semibold text-3xl '}>Wydarzenia</h1>
          {meData && (
            <Link
              href={'/events/create'}
              className={'block flex bg-blue-600 text-white hover:bg-blue-500 items-center px-4 py-2 rounded-md'}
            >
              <PlusIcon width={14} height={14} className={'mr-3 fill-white'} />
              Utwórz nowe
            </Link>
          )}
        </div>

        <div className={'flex mb-10 w-full items-center flex-wrap'}>
          <div className={'z-1 w-[300px]'}>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadOptions}
              placeholder={'Miasto'}
              value={city ? { value: city, label: city } : null}
              onChange={(v) => updateParam('city', v ? v.value : undefined)}
              defaultValue={city ? { value: city, label: city } : null}
              isClearable
            />
          </div>
          <select
            className={'border-2 rounded px-3 py-[6px] ml-3 cursor-pointer'}
            value={selectedCategory}
            onChange={(v) => {
              updateParam('category', v.target.value === 'wszystkie kategorie' ? undefined : v.target.value);
            }}
          >
            <option>wszystkie kategorie</option>
            {categories.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
          <div className={'flex space-x-1 ml-2'}>
            {locationStatus && (
              <FilterTile
                label={filtersMap.locationStatus[locationStatus]}
                handleRemove={() => updateParam('locationStatus', undefined)}
              />
            )}
            {/*{visibilityStatus && (*/}
            {/*  <FilterTile*/}
            {/*    label={filtersMap.visibilityStatus[visibilityStatus]}*/}
            {/*    handleRemove={() => updateParam('visibilityStatus', undefined)}*/}
            {/*  />*/}
            {/*)}*/}
            {timeRange && (
              <FilterTile
                label={filtersMap.timeRange[timeRange]}
                handleRemove={() => updateParam('timeRange', undefined)}
              />
            )}
          </div>

          <button
            className={
              'flex items-center ml-auto ring-1 bg-white rounded-full ring-gray-300 px-5 text-gray-500 py-3 hover:ring-gray-300 hover:text-gray-900 transition-all'
            }
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FilterIcon width={15} height={15} /> <span className={'ml-2'}>więcej filtrów</span>
          </button>
          {isFilterModalOpen && (
            <FiltersModal
              defaultLocationStatus={locationStatus || 'all'}
              // defaultVisibilityStatus={visibilityStatus || 'all'}
              defaultTimeRange={timeRange || 'all'}
              handleCloseModal={() => setIsFilterModalOpen(false)}
            />
          )}
        </div>
        <div className={'grid grid-cols-2 gap-3'}>
          <div className={'space-y-3'}>
            {eventsData.events.map((event) => {
              return (
                <Link href={`/events/${event.id}`} key={event.id} className={'block'}>
                  <EventCard
                    event={event}
                    onMouseEnter={() => setFocusedMarkerId(event.id)}
                    onMouseLeave={() => setFocusedMarkerId(undefined)}
                  />
                </Link>
              );
            })}
          </div>
          <div className={'w-full h-[600px] sticky top-[100px]'}>
            <MapWithNoSSR markers={locationMarker} focusedMarkerId={focusedMarkerId} mapHeight={'100%'} />
          </div>
        </div>
        <Pagination
          pageCount={eventsData.pageCount}
          currentPage={eventsData.currentPage}
          changePage={(pageNumber) => updateParam('page', pageNumber === 1 ? undefined : `${pageNumber}`)}
        />
      </div>
    </MainLayout>
  );
};

export default EventsPage;
