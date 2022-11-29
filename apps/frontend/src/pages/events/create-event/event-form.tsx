import FileIcon from '../../../components/icons/file-icon';
import FormInput from '../../../components/form/form-input';
import FormTextarea from '../../../components/form/form-textarea';
import FormSelect from '../../../components/form/form-select';
import FormTagPicker from '../../../components/form/form-tag-picker';
import MapIcon from '../../../components/icons/map-icon';
import Map from '../../../components/map';
import CalendarIcon from '../../../components/icons/calendar-icon';
import Button from '../../../components/common/button';
import React from 'react';
import useCreateEvent, { CreateEventFormType } from './use-create-event';
import dayjs from 'dayjs';
import { CreateEventInputType } from '@event-organizer/shared-types';
import FormErrorMessage from '../../../components/form/form-error-message';
import clsx from 'clsx';

interface EventFormProps {
  onSubmit: (data: CreateEventFormType) => void;
  defaultValues?: CreateEventInputType;
  isUpdating?: boolean;
}

const EventForm = ({ onSubmit, defaultValues, isUpdating }: EventFormProps) => {
  const {
    errors,
    locationMarker,
    findGeologicalLocation,
    eventLocationStatusOptions,
    eventVisibilityStatusOptions,
    eventCategoryOptions,
    selectedLocationStatus,
    selectedTags,
    register,
    handleSubmit,
    handleAddTag,
    handleRemoveTag,
    minStartDate,
  } = useCreateEvent({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mb-20 flex flex-col">
      <div className={'flex'}>
        <FileIcon width={50} height={50} />
        <div className={'ml-5'}>
          <h2 className={'text-2xl font-semibold text-neutral-800'}>Podstawowe informacje</h2>
          <p className={'text-gray-600'}>
            Nazwij swoje wydarzenie, zachęć innych do uczestnictwa i opisz czym twoje wydarzenie się wyróżnia
          </p>
        </div>
      </div>
      <div className={clsx('space-y-5 lg:ml-[70px] mt-10 mb-20 ')}>
        <FormInput
          label="nazwa"
          register={register}
          name="name"
          rules={{
            required: {
              value: true,
              message: 'name is required',
            },
          }}
          error={errors.name}
        />
        <FormTextarea label="description" register={register} name="description" error={errors.description} />
        <FormSelect
          label={'widoczność'}
          name={'eventVisibilityStatus'}
          register={register}
          options={eventVisibilityStatusOptions}
          error={errors.eventVisibilityStatus}
        />
        <FormInput
          label="obrazek"
          register={register}
          name="bannerImage"
          onBlur={findGeologicalLocation}
          error={errors.bannerImage}
        />
        <div className={'grid grid-cols-2 gap-3'}>
          <FormSelect
            label={'lokalizacja'}
            name={'eventLocationStatus'}
            register={register}
            options={eventLocationStatusOptions}
            error={errors.eventLocationStatus}
          />
          <FormSelect
            label={'kategoria'}
            name={'categoryId'}
            register={register}
            options={eventCategoryOptions}
            error={errors.categoryId}
          />
        </div>
        <FormTagPicker addTag={handleAddTag} removeTag={handleRemoveTag} selectedTags={selectedTags} />
      </div>
      {selectedLocationStatus === 'STATIONARY' && (
        <>
          <div className={'flex'}>
            <MapIcon width={50} height={50} />
            <div className={'ml-5'}>
              <h2 className={'mb-5 text-2xl mb-0 font-semibold text-neutral-800'}>Lokalizacja</h2>
              <p className={'text-gray-600'}>Pomóż innym odnaleźć twoje wydarzenie</p>
            </div>
          </div>
          <div className={'space-y-5 lg:ml-[70px] mt-10 mb-20'}>
            <Map markers={locationMarker} />
            <div className={'grid grid-cols-2 gap-3'}>
              <FormInput
                label="ulica"
                register={register}
                name="street"
                onBlur={findGeologicalLocation}
                error={errors.street}
              />
              <FormInput
                label="miasto"
                register={register}
                name="city"
                onBlur={findGeologicalLocation}
                error={errors.city}
              />
            </div>
            <div className={'grid grid-cols-2 gap-3'}>
              <FormInput
                label="kod pocztowy"
                register={register}
                name="postCode"
                onBlur={findGeologicalLocation}
                error={errors.postCode}
              />
              <FormInput
                label="kraj"
                register={register}
                name="country"
                onBlur={findGeologicalLocation}
                error={errors.country}
              />
            </div>
          </div>
        </>
      )}
      <div className={'flex'}>
        <CalendarIcon width={50} height={50} />
        <div className={'ml-5'}>
          <h2 className={'mb-5 text-2xl mb-0 font-semibold text-neutral-800'}>Czas</h2>
          <p className={'text-gray-600'}>
            Powiadom innych kiedy odbywa się wydarzenie, aby wiedzieli kiedy mają uczestniczyć
          </p>
        </div>
      </div>
      <div className={'grid grid-cols-2 lg:ml-[70px] mt-10 mb-20 gap-3'}>
        <div className="relative w-full">
          <input
            id={'startDate'}
            type="datetime-local"
            {...register('startDate')}
            // value={'2022-11-22T16:00'}
            min={minStartDate}
            className="bg-primary-100 peer block w-full appearance-none rounded-lg border-2 border-gray-300 px-2 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-300"
          />
          <label
            htmlFor={'startDate'}
            className="absolute top-5 z-10 origin-[0] -translate-y-5 scale-75 transform px-2 text-sm text-gray-500 duration-300"
          >
            data rozpoczęcia
          </label>
          {errors.startDate && <FormErrorMessage message={errors.startDate.message} />}
        </div>
        <div className="relative w-full">
          <input
            id={'endDate'}
            type="datetime-local"
            {...register('endDate')}
            // value={'2022-11-22T16:00'}
            min={minStartDate}
            className="bg-primary-100 peer block w-full appearance-none rounded-lg border-2 border-gray-300 px-2 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-300"
          />
          <label
            htmlFor={'endDate'}
            className="absolute top-5 z-10 origin-[0] -translate-y-5 scale-75 transform px-2 text-sm text-gray-500 duration-300"
          >
            data końca
          </label>
          {errors.endDate && <FormErrorMessage message={errors.endDate.message} />}
        </div>
      </div>

      <Button type="submit" className={'ml-auto'} disabled={isUpdating}>
        Submit
      </Button>
    </form>
  );
};

export default EventForm;
