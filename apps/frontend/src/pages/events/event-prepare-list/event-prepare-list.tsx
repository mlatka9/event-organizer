import { useGetEventPrepareListItemsQuery } from '../../../hooks/query/events';
import { useEventDetails } from '../../../layouts/events-layout';
import EventPrepareListItem from './event-prepare-list-item';
import EventModuleWrapper from '../event-details/event-module-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createEventPrepareItemInput,
  CreateEventPrepareItemInputType,
  EventPrepareItem,
} from '@event-organizer/shared-types';

import FormErrorMessage from '../../../components/form/form-error-message';
import Button from '../../../components/common/button';
import PlusIcon from '../../../components/icons/plus-icons';
import React, { useState } from 'react';
import { useCreateEventPrepareListItemsMutation } from '../../../hooks/mutation/events';
import FormSelect from '../../../components/form/form-select';
import { data } from 'autoprefixer';
import clsx from 'clsx';

type EventPrepareListFilterType = 'ALL' | 'DONE' | 'IN_PROGRESS';

const EventPrepareList = () => {
  const [selectedFilter, setSelectedFilter] = useState<EventPrepareListFilterType>('ALL');

  const { event } = useEventDetails();
  const { data: prepareItemsList, isSuccess } = useGetEventPrepareListItemsQuery({ eventId: event.id });
  const { mutate: createEventPrepareListItem, isLoading: isCreateItemSuccess } =
    useCreateEventPrepareListItemsMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventPrepareItemInputType>({
    resolver: zodResolver(createEventPrepareItemInput),
  });

  const onSubmit = (data: CreateEventPrepareItemInputType) => {
    createEventPrepareListItem({
      eventId: event.id,
      description: data.description,
      participantsLimit: data.participantsLimit,
    });
  };

  const participantsLimitOptions = [
    {
      value: '1',
      label: '1',
    },
    {
      value: '2',
      label: '2',
    },
    {
      value: '3',
      label: '3',
    },
    {
      value: '4',
      label: '4',
    },
    {
      value: '5',
      label: '5',
    },
    {
      value: '-1',
      label: 'dowolna',
    },
  ];

  const getFilteredItems = (prepareItemsList: EventPrepareItem[], filter: EventPrepareListFilterType) => {
    switch (filter) {
      case 'ALL':
        return prepareItemsList;
      case 'DONE':
        return prepareItemsList.filter((i) => i.isItemDone);
      case 'IN_PROGRESS':
        return prepareItemsList.filter((i) => !i.isItemDone);
    }
  };

  const filteredPrepareItemsList = isSuccess ? getFilteredItems(prepareItemsList, selectedFilter) : [];

  return (
    <EventModuleWrapper headerText={'Lista do przygotowania'}>
      <div className={'relative flex w-full max-w-[300px] mx-3 h-8 items-center mb-5'}>
        <div
          className={clsx(
            'absolute w-1/3 h-full bg-blue-100 top-0 left-0 rounded-md transition-transform',
            selectedFilter === 'IN_PROGRESS' && 'translate-x-full',
            selectedFilter === 'DONE' && 'translate-x-[200%]'
          )}
        />
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={clsx(
            'w-1/3 z-10 font-semibold text-neutral-600 text-sm text-center',
            selectedFilter === 'ALL' && 'text-blue-900'
          )}
        >
          Wszystkie
        </button>
        <button
          onClick={() => setSelectedFilter('IN_PROGRESS')}
          className={clsx(
            'w-1/3 z-10 font-semibold text-neutral-600 text-sm text-center',
            selectedFilter === 'IN_PROGRESS' && 'text-blue-900'
          )}
        >
          W trakcie
        </button>
        <button
          onClick={() => setSelectedFilter('DONE')}
          className={clsx(
            'w-1/3 z-10 font-semibold text-neutral-600 text-sm text-center',
            selectedFilter === 'DONE' && 'text-blue-900'
          )}
        >
          Gotowe
        </button>
      </div>
      {isSuccess && !filteredPrepareItemsList.length && (
        <div className={'flex h-20 items-center justify-center'}>Brak rzeczy do przygotowania...</div>
      )}
      {isSuccess ? (
        filteredPrepareItemsList.map((item) => <EventPrepareListItem item={item} key={item.id} />)
      ) : (
        <div className={'flex h-20 items-center justify-center'}>Ładowanie...</div>
      )}
      <hr className={'my-5'} />
      {event.isCurrentUserAdmin && (
        <form className={'px-3 pb-5'} onSubmit={handleSubmit(onSubmit)}>
          <div className={'grid grid-cols-2 gap-3 mb-2'}>
            <div className="relative w-full">
              <input
                id={'description'}
                {...register('description')}
                // value={'2022-11-22T16:00'}

                className="bg-primary-100 peer block w-full appearance-none rounded-lg border-2 border-gray-300 px-2 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-300"
              />
              <label
                htmlFor={'description'}
                className="absolute top-5 z-10 origin-[0] -translate-y-5 scale-75 transform px-2 text-sm text-gray-500 duration-300"
              >
                Opis
              </label>
              {errors.description && <FormErrorMessage message={errors.description.message} />}
            </div>
            <div className="relative w-full">
              <FormSelect
                label={'Ilość osób'}
                name={'participantsLimit'}
                register={register}
                options={participantsLimitOptions}
              />
              {errors.participantsLimit && <FormErrorMessage message={errors.participantsLimit.message} />}
            </div>
          </div>

          <Button
            type="submit"
            className={'flex !px-2 flex items-center'}
            kind={'secondary'}
            disabled={isCreateItemSuccess}
          >
            <PlusIcon className={'fill-blue-600'} /> <span className={'ml-2'}>Dodaj</span>
          </Button>
        </form>
      )}
    </EventModuleWrapper>
  );
};

export default EventPrepareList;
