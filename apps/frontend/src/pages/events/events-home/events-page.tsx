import { useState } from 'react';
import { useAuth } from '../../../hooks/use-auth';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { GetAllEventsInputType, getAllEventsSchema } from '@event-organizer/shared-types';
import { useEventsQuery } from '../../../hooks/query/events';
import { useCategoriesQuery } from '../../../hooks/query/categories';
import PlusIcon from '../../../components/icons/plus-icons';
import AsyncSelect from 'react-select/async';
import Pagination from '../../../components/common/pagination';
import Map from '../../../components/map';
import EventCard from './event-card';
import FiltersModal from './filters-modal';
import FilterIcon from '../../../components/icons/filter-icon';
import FilterTile from './filter-tile';
import eventsAPI from '../../../api/events';

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [focusedMarkerId, setFocusedMarkerId] = useState<undefined | string>(undefined);
  const { data: categories, isSuccess: isCategoriesSuccess } = useCategoriesQuery();

  const currentParams = {} as Record<string, string | undefined>;
  searchParams.forEach((key, value) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    currentParams[value] = key;
  });

  const updateParam = (key: string, value: string | undefined) => {
    if (!value) {
      delete currentParams[key];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setSearchParams(currentParams);
    } else {
      currentParams[key] = value;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setSearchParams(currentParams);
    }
  };

  console.log('currentParams', currentParams);
  const validation = getAllEventsSchema.safeParse(currentParams);

  const { page, timeRange, category, locationStatus, city }: GetAllEventsInputType = currentParams as any;

  const { data: eventsData, isSuccess: isEventsSuccess } = useEventsQuery({
    page,
    city,
    category,
    locationStatus,
    timeRange,
    enabled: validation.success,
  });

  if (!validation.success) {
    navigate('/events');
    return <div>error</div>;
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
  //
  if (!isCategoriesSuccess || !isEventsSuccess) return <div>Loading..</div>;

  return (
    <div className={'mt-5 lg:mt-10'}>
      <div className={'flex items-center flex-row-reverse gap-3 lg:flex-row mb-20'}>
        <h1 className={'font-semibold text-3xl'} data-cy="events-page-header">
          Wydarzenia
        </h1>
        {user && (
          <Link
            data-cy={'new-event-link'}
            to={'/events/create'}
            className={'flex items-center px-3 ml-5 text-sm bg-blue-600 text-white font-semibold py-2 rounded-md'}
          >
            <PlusIcon width={14} height={14} className={'mr-3 fill-white'} />
            Utwórz nowe
          </Link>
        )}
      </div>

      <div className={'flex flex-col lg:flex-row lg:items-center mb-10 w-full flex-wrap space-y-2 lg:space-y-0'}>
        <div className={'z-1 lg:w-[300px]'}>
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
          className={'border-2 rounded px-3 py-[7px] cursor-pointer lg:ml-2'}
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
        <div className={'flex items-center lg:flex-row-reverse lg:ml-auto'}>
          <button
            className={
              'lg:ml-2 flex items-center mr-auto lg:ml-auto ring-1 bg-white rounded-full ring-gray-300 px-5 text-gray-500 py-3 hover:ring-gray-300 hover:text-gray-900 transition-all'
            }
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FilterIcon width={15} height={15} /> <span className={'ml-2'}>więcej filtrów</span>
          </button>
          <div className={'flex space-x-1 ml-2'}>
            {locationStatus && (
              <FilterTile
                label={filtersMap.locationStatus[locationStatus]}
                handleRemove={() => updateParam('locationStatus', undefined)}
              />
            )}
            {timeRange && (
              <FilterTile
                label={filtersMap.timeRange[timeRange]}
                handleRemove={() => updateParam('timeRange', undefined)}
              />
            )}
          </div>
        </div>
        {isFilterModalOpen && (
          <FiltersModal
            defaultLocationStatus={locationStatus || 'all'}
            defaultTimeRange={timeRange || 'all'}
            handleCloseModal={() => setIsFilterModalOpen(false)}
          />
        )}
      </div>
      <div className={'grid lg:grid-cols-2 gap-3'}>
        <div className={'space-y-3'}>
          {eventsData.events.map((event) => {
            return (
              <Link to={`/events/${event.id}`} key={event.id} className={'block'}>
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
          <Map markers={locationMarker} focusedMarkerId={focusedMarkerId} mapHeight={'100%'} />
        </div>
      </div>
      <Pagination
        pageCount={eventsData.pageCount}
        currentPage={eventsData.currentPage}
        changePage={(pageNumber) => updateParam('page', pageNumber === 1 ? undefined : `${pageNumber}`)}
      />
    </div>
  );
};

export default EventsPage;
