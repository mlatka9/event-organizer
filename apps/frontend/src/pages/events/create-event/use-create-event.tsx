import { CreateEventInputType, createEventSchema } from '@event-organizer/shared-types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCategoriesQuery } from '../../../hooks/query/categories';
import axios from 'axios';
import dayjs from 'dayjs';

import minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax);

const CreateEventFormSchema = createEventSchema
  .omit({ startDate: true, endDate: true })
  .extend({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
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
  })
  .refine((data) => (data.endDate ? data.startDate : true), {
    message: 'Data startu jest wymagane',
    path: ['startDate'],
  })
  .refine(
    (data) =>
      data.endDate ? data.startDate && new Date(data.endDate).valueOf() >= new Date(data.startDate).valueOf() : true,
    {
      message: 'Data końca musi być po dacie startu',
      path: ['endDate'],
    }
  );

export type CreateEventFormType = z.infer<typeof CreateEventFormSchema>;

interface UseCreateEventProps {
  defaultValues?: CreateEventInputType;
}

const useCreateEvent = ({ defaultValues }: UseCreateEventProps = {}) => {
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
      // bannerImage: defaultValues?.bannerImage,
      ...defaultValues,
      startDate: defaultValues?.startDate
        ? dayjs(new Date(defaultValues.startDate)).format('YYYY-MM-DD[T]HH:mm')
        : undefined,
      endDate:
        defaultValues?.endDate && defaultValues?.startDate && defaultValues.endDate !== defaultValues.startDate
          ? dayjs(new Date(defaultValues.endDate)).format('YYYY-MM-DD[T]HH:mm')
          : undefined,
    },
  });

  const addImage = (imageUrl: string) => {
    setValue('bannerImage', imageUrl);
  };

  const removeImage = () => {
    setValue('bannerImage', undefined);
  };

  const selectedImage = watch('bannerImage');

  const arr = [dayjs()];
  if (defaultValues?.startDate) {
    arr.push(dayjs(defaultValues?.startDate));
  }
  const minStartDate = dayjs.min(arr).format('YYYY-MM-DD[T]hh:mm');

  const { data, isSuccess } = useCategoriesQuery();

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

  const selectedLocationStatus = watch('eventLocationStatus');

  console.log('DATE', watch('startDate'));

  return {
    selectedLocationStatus,
    eventCategoryOptions,
    eventLocationStatusOptions,
    eventVisibilityStatusOptions,
    locationMarker,
    findGeologicalLocation,
    selectedTags,
    handleAddTag,
    handleRemoveTag,
    register,
    handleSubmit,
    errors,
    minStartDate,
    resetForm: reset,
    addImage,
    removeImage,
    selectedImage,
  };
};

export default useCreateEvent;
