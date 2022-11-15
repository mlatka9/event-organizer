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

const MapWithNoSSR = dynamic(() => import('../../components/map'), {
  ssr: false,
});

const filtersMap: {
  locationStatus: Record<string, string>;
  visibilityStatus: Record<string, string>;
  timeRange: Record<string, string>;
} = {
  locationStatus: {
    STATIONARY: 'stacjonarnie',
    ONLINE: 'online',
  },
  visibilityStatus: {
    PUBLIC: 'publiczne',
    PRIVATE: 'prywatne',
  },
  timeRange: {
    TODAY: 'dziś',
    THISWEEK: 'ten tydzień',
    THISMONTH: 'ten miesiąc',
  },
};

const EventsPage = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const router = useRouter();
  const [focusedMarkerId, setFocusedMarkerId] = useState<undefined | string>(undefined);
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

  const page = typeof router.query.page === 'string' ? +router.query.page : undefined;
  const city = typeof router.query.city === 'string' ? router.query.city : undefined;
  const category = typeof router.query.category === 'string' ? router.query.category : undefined;
  const locationStatus = typeof router.query.locationStatus === 'string' ? router.query.locationStatus : undefined;
  const visibilityStatus =
    typeof router.query.visibilityStatus === 'string' ? router.query.visibilityStatus : undefined;
  const timeRange = typeof router.query.timeRange === 'string' ? router.query.timeRange : undefined;

  const { data: eventsData, isSuccess: isEventsSuccess } = useEventsQuery({
    page,
    city,
    category,
    locationStatus,
    visibilityStatus,
    timeRange,
    enabled: router.isReady,
  });

  if (!router.isReady || !isCategoriesSuccess || !isEventsSuccess) return <>loading ...</>;

  const selectedCategory = (category && categories.find((c) => c.name === category)?.name) || 'all';

  const selectedLocationStatus =
    (locationStatus && ['STATIONARY', 'ONLINE'].find((c) => c === locationStatus)) || 'all';

  const selectedVisibilityStatus =
    (visibilityStatus && ['PUBLIC', 'PRIVATE'].find((c) => c === visibilityStatus)) || 'all';

  const selectedTimeRange = (timeRange && ['TODAY', 'THISWEEK', 'THISMONTH'].find((c) => c === timeRange)) || 'all';

  const isMarkerType = (marker: {
    id: string;
    longitude: number | undefined;
    latitude: number | undefined;
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

  return (
    <MainLayout>
      <h1 className={'font-semibold text-3xl mb-10'}>Wydarzenia</h1>
      <div className={'flex mb-10 w-full items-center'}>
        <div className={'z-1 w-[300px]'}>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            placeholder={'Warszawa'}
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
            updateParam('category', v.target.value === 'wszytskie' ? undefined : v.target.value);
          }}
        >
          <option>wszytskie</option>
          {categories.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
        <div className={'flex space-x-1 ml-2'}>
          {selectedLocationStatus && selectedLocationStatus !== 'all' && (
            <FilterTile
              label={filtersMap.locationStatus[selectedLocationStatus]}
              handleRemove={() => updateParam('locationStatus', undefined)}
            />
          )}
          {selectedVisibilityStatus && selectedVisibilityStatus !== 'all' && (
            <FilterTile
              label={filtersMap.visibilityStatus[selectedVisibilityStatus]}
              handleRemove={() => updateParam('visibilityStatus', undefined)}
            />
          )}
          {selectedTimeRange && selectedTimeRange !== 'all' && (
            <FilterTile
              label={filtersMap.timeRange[selectedTimeRange]}
              handleRemove={() => updateParam('timeRange', undefined)}
            />
          )}
        </div>
        <button
          className={
            'flex items-center ml-auto ring-1 rounded-full ring-gray-300 px-5 text-gray-500 py-3 hover:ring-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all'
          }
          onClick={() => setIsFilterModalOpen(true)}
        >
          <FilterIcon width={15} height={15} /> <span className={'ml-2'}>więcej filtrów</span>
        </button>
        {isFilterModalOpen && (
          <FiltersModal
            defaultLocationStatus={locationStatus || 'all'}
            defaultVisibilityStatus={visibilityStatus || 'all'}
            defaultTimeRange={timeRange || 'all'}
            handleCloseModal={() => setIsFilterModalOpen(false)}
          />
        )}
      </div>

      <div className={'grid grid-cols-2 gap-3'}>
        <div className={'space-y-3'}>
          {eventsData.events.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id} className={'block'}>
              <EventCard
                event={event}
                onMouseEnter={() => setFocusedMarkerId(event.id)}
                onMouseLeave={() => setFocusedMarkerId(undefined)}
              />
            </Link>
          ))}
        </div>
        {/*<div className={'bg-green-300'}>*/}
        <div className={'w-full h-[600px] bg-pink-400 sticky top-[100px]'}>
          <MapWithNoSSR markers={locationMarker} focusedMarkerId={focusedMarkerId} mapHeight={'100%'} />
        </div>
      </div>
      <Pagination
        pageCount={eventsData.pageCount}
        currentPage={eventsData.currentPage}
        changePage={(pageNumber) => updateParam('page', pageNumber === 1 ? undefined : `${pageNumber}`)}
      />
    </MainLayout>
  );
};

export default EventsPage;
