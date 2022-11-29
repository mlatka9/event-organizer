import EventForm from '../create-event/event-form';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth';
import { toast } from 'react-toastify';
import { useUpdateEventMutation } from '../../../hooks/mutation/events';
import { CreateEventFormType } from '../create-event/use-create-event';
import React from 'react';
import { useEventInfoQuery } from '../../../hooks/query/events';
const EventSettingsPage = () => {
  const params = useParams();
  const eventId = params['id'] as string;
  const { user, isLoading: isUserLoading } = useAuth();

  const onSuccess = () => {
    toast('Pomyślnie zaaktualizowano wydarzenie', {
      type: 'success',
    });
  };

  const { data: defaultValues, isSuccess: isEventInfoSuccess } = useEventInfoQuery(eventId);

  const { mutate: updateEvent, isLoading } = useUpdateEventMutation(onSuccess);

  const onSubmit = async (data: CreateEventFormType) => {
    updateEvent({
      eventId,
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      city: data.city,
      country: data.country,
      postCode: data.postCode,
      startDate:
        data.startDate && data.startDate !== defaultValues?.startDate
          ? new Date(data.startDate).toISOString()
          : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
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

  if (isUserLoading || !isEventInfoSuccess) {
    return <div>user is loading</div>;
  }

  if (!isUserLoading && !user) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div>
      <EventForm onSubmit={onSubmit} defaultValues={defaultValues} isUpdating={isLoading} />
    </div>
  );
};

export default EventSettingsPage;
