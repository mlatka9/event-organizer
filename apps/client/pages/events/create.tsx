import axios from 'axios';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import FormTextarea from '../../components/form/form-textarea';
import FormInput from '../../components/form/form-input';
import FormTagPicker from '../../components/form/form-tag-picker';
import { useCreateEventMutation } from '../../hooks/mutations/events';
import Button from '../../components/common/button';
import dynamic from 'next/dynamic';
import MainLayout from '../../components/layouts/main-layout';
import FormSelect from '../../components/form/form-select';
import { createEventSchema } from '@event-organizer/shared-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategoriesQuery } from '../../hooks/query/categories';
import Heading from '../../components/common/heading';
import React from 'react';
import FileIcon from '../../components/icons/file-icon';
import CalendarIcon from '../../components/icons/calendar-icon';
import MapIcon from '../../components/icons/map-icon';

const CreateEventFormSchema = createEventSchema
  .omit({ startDate: true })
  .extend({
    startDate: z.string().optional(),
    mapZoomLevel: z.number(),
  })
  .refine((data) => (data.eventLocationStatus === 'STATIONARY' ? data.street?.length : true), {
    message: 'Ulica jest wymagana',
    path: ['street'],
  })
  .refine((data) => (data.eventLocationStatus === 'STATIONARY' ? data.city?.length : true), {
    message: 'Miasto jest wymagane',
    path: ['city'],
  })
  .refine((data) => (data.eventLocationStatus === 'STATIONARY' ? data.postCode?.length : true), {
    message: 'Kod pocztowy jest wymagany',
    path: ['postCode'],
  })
  .refine((data) => (data.eventLocationStatus === 'STATIONARY' ? data.country?.length : true), {
    message: 'Państwo jest wymagane',
    path: ['country'],
  });

type CreateEventFormType = z.infer<typeof CreateEventFormSchema>;

const MapWithNoSSR = dynamic(() => import('../../components/map'), {
  ssr: false,
});

const currentDate = dayjs().format('YYYY-MM-DD[T]hh:mm');

console.log('currentDate', currentDate);

const CreateEventPage = () => {
  const {
    reset,
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateEventFormType>({
    resolver: zodResolver(CreateEventFormSchema),
    defaultValues: {
      tags: [],
      eventVisibilityStatus: 'PUBLIC',
      eventLocationStatus: 'STATIONARY',
      mapZoomLevel: 1,
      normalizedCity: undefined,
    },
  });

  console.log(errors);

  console.log('form data', watch());

  const { data, isSuccess } = useCategoriesQuery();

  const date = watch('startDate');
  console.log('date', date);
  console.log('iso date', date && new Date(date).toISOString());

  const resetForm = () => {
    reset();
  };

  const createEvent = useCreateEventMutation(resetForm);

  const onSubmit = async (data: CreateEventFormType) => {
    console.log(data);

    createEvent({
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      city: data.city,
      country: data.country,
      postCode: data.postCode,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      street: data.street,
      tags: data.tags,
      latitude: data.latitude,
      longitude: data.longitude,
      eventVisibilityStatus: data.eventVisibilityStatus,
      normalizedCity: data.normalizedCity,
      bannerImage: data.bannerImage,
      eventLocationStatus: data.eventLocationStatus,
    });
  };

  const handleAddTag = (newTag: string) => {
    setValue('tags', [...getValues('tags'), newTag]);
  };

  const handleRemoveTag = (tag: string) => {
    setValue(
      'tags',
      getValues('tags').filter((t) => t !== tag)
    );
  };

  const selectedTags = watch('tags');

  const findGeologicalLocation = async () => {
    // const [street, city, postCode, country] = getValues(['street', 'city', 'postCode', 'country']);
    const addressValues = getValues(['street', 'city', 'postCode', 'country']);

    const query = addressValues.filter((value) => value).join(', ');
    if (!query) return;
    try {
      const { data } = await axios.get('https://eu1.locationiq.com/v1/search', {
        params: {
          key: 'pk.856777750d34edcfa4f287028d5907fb',
          format: 'json',
          addressdetails: 1,
          normalizeaddress: 1,
          'accept-language': 'pl',
          // street: street,
          // city: city,
          // country: country,
          // postalcode: postCode,
          q: query,
        },
      });
      const newMatchingLocation = data[0];
      if (!newMatchingLocation) return;
      console.log('newMatchingLocation', newMatchingLocation);
      setValue('normalizedCity', newMatchingLocation.address.city);
      setValue('latitude', +newMatchingLocation.lat);
      setValue('longitude', +newMatchingLocation.lon);
    } catch (err) {
      console.log('Cant find location');
      setValue('longitude', undefined);
      setValue('latitude', undefined);
      setValue('mapZoomLevel', 1);
      return;
    }
  };

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  const locationMarker =
    latitude && longitude
      ? [
          {
            latitude,
            longitude,
            id: '1',
          },
        ]
      : [];

  const eventVisibilityStatusOptions = [
    { label: 'publiczny', value: 'PUBLIC' },
    { label: 'prywatny', value: 'PRIVATE' },
  ];

  const eventLocationStatusOptions = [
    { label: 'stacjonarnie', value: 'STATIONARY' },
    { label: 'online', value: 'ONLINE' },
  ];

  const eventCategoryOptions = isSuccess
    ? data.map((category) => ({
        label: category.name,
        value: category.id,
      }))
    : [];

  const locationStatus = watch('eventLocationStatus');

  return (
    <MainLayout>
      <Heading className={'mb-20'}>Stwórz nowe wydarzenie</Heading>
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
        <div className={'space-y-5 ml-[70px] mt-10 mb-20'}>
          <FormInput
            label="name"
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
            label={'status'}
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
              label={'status'}
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
        {locationStatus === 'STATIONARY' && (
          <>
            <div className={'flex'}>
              <MapIcon width={50} height={50} />
              <div className={'ml-5'}>
                <h2 className={'mb-5 text-2xl mb-0 font-semibold text-neutral-800'}>Lokalizacja</h2>
                <p className={'text-gray-600'}>Pomóż innym odnaleźć twoje wydarzenie</p>
              </div>
            </div>
            <div className={'space-y-5 ml-[70px] mt-10 mb-20'}>
              <MapWithNoSSR markers={locationMarker} />
              <div className={'grid grid-cols-2 gap-3'}>
                <FormInput
                  label="street"
                  register={register}
                  name="street"
                  onBlur={findGeologicalLocation}
                  error={errors.street}
                />
                <FormInput
                  label="city"
                  register={register}
                  name="city"
                  onBlur={findGeologicalLocation}
                  error={errors.city}
                />
              </div>
              <div className={'grid grid-cols-2 gap-3'}>
                <FormInput
                  label="post code"
                  register={register}
                  name="postCode"
                  onBlur={findGeologicalLocation}
                  error={errors.postCode}
                />
                <FormInput
                  label="country"
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
              Powiadom innych kiedy odbywa się wydarzenie, aby wiedzieli kiedy mają uczestniczyć{' '}
            </p>
          </div>
        </div>
        <div className={'space-y-5 ml-[70px] mt-10 mb-20'}>
          <div className="relative w-1/2">
            <input
              id={'startDate'}
              type="datetime-local"
              {...register('startDate')}
              min={currentDate}
              className="bg-primary-100 peer block w-full appearance-none rounded-lg border-2 border-gray-300 px-2 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-300"
            />
            <label
              htmlFor={'startDate'}
              className="absolute top-5 z-10 origin-[0] -translate-y-5 scale-75 transform px-2 text-sm text-gray-500 duration-300"
            >
              data rozpoczęcia
            </label>
          </div>
        </div>

        <Button type="submit" className={'ml-auto'}>
          Submit
        </Button>
      </form>
    </MainLayout>
  );
};

export default CreateEventPage;
