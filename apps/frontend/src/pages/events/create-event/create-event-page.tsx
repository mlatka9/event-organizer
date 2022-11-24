import React from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/use-auth';
import Heading from '../../../components/common/heading';
import { useCreateEventMutation } from '../../../hooks/mutation/events';
import { Navigate, useNavigate } from 'react-router-dom';
import { CreateEventFormType } from './use-create-event';
import EventForm from './event-form';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useAuth();

  const onSuccess = (eventData: { eventId: string }) => {
    toast('Pomyślnie dodano wydarzenie', {
      type: 'success',
    });
    navigate(`/events/${eventData.eventId}`);
  };

  const { mutate: createEvent, isLoading } = useCreateEventMutation(onSuccess);

  const onSubmit = async (data: CreateEventFormType) => {
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

  if (isUserLoading) {
    return <div>user is loading</div>;
  }

  if (!isUserLoading && !user) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className={'mt-10 max-w-[800px] mx-auto'}>
      <Heading className={'mb-20'}>Stwórz nowe wydarzenie</Heading>
      <EventForm onSubmit={onSubmit} isUpdating={isLoading} />
    </div>
  );
};

export default CreateEventPage;
