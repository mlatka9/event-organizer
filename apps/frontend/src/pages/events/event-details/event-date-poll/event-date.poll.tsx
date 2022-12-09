import { useGetEventDatePoll } from '../../../../hooks/query/events';
import EventDatePollOption from './event-date-poll-option';
import React, { useState } from 'react';
import Button from '../../../../components/common/button';
import PlusIcon from '../../../../components/icons/plus-icons';
import { useForm } from 'react-hook-form';
import { CreateDatePollOptionInputType } from '@event-organizer/shared-types';
import FormErrorMessage from '../../../../components/form/form-error-message';
import dayjs from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateDatePollOptionMutation } from '../../../../hooks/mutation/events';

interface EventDatePollProps {
  eventId: string;
}

export const createDatePollOptionFormSchema = z
  .object({
    startDate: z.string().min(1, { message: 'Data rozpoczęcia jest wymagana' }),
    // .refine((date) => (date ? isISODate(date) : true), { message: 'Nieprawidłowy format daty 1' }),
    endDate: z
      .string()
      // .refine((date) => (date ? isISODate(date) : true), { message: 'Nieprawidłowy format daty' })
      .optional(),
  })
  .refine(
    (data) =>
      data.endDate ? data.startDate && new Date(data.endDate).valueOf() >= new Date(data.startDate).valueOf() : true,
    {
      message: 'Data końca musi być po dacie startu',
      path: ['endDate'],
    }
  );

type createDatePollOptionFormType = z.infer<typeof createDatePollOptionFormSchema>;

const EventDatePoll = ({ eventId }: EventDatePollProps) => {
  const { data: eventDatePoll, isSuccess } = useGetEventDatePoll({ eventId });
  const { mutate: createDatePollOption } = useCreateDatePollOptionMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createDatePollOptionFormType>({
    resolver: zodResolver(createDatePollOptionFormSchema),
  });

  const onSubmit = (data: CreateDatePollOptionInputType) => {
    if (!isSuccess) return;

    createDatePollOption({
      eventId,
      datePollId: eventDatePoll.id,
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    });
  };
  if (!isSuccess) return null;

  const minStartDate = dayjs(new Date()).format('YYYY-MM-DD[T]hh:mm');

  return (
    <div className={'bg-white rounded-lg shadow-md'}>
      <div className={'flex justify-between px-5 py-3 '}>
        <p className={'font-semibold text-lg'}>Wybór terminu</p>
      </div>
      <hr />
      <div className={'p-5'}>
        {eventDatePoll.options.map((option) => (
          <EventDatePollOption key={option.id} option={option} datePollId={eventDatePoll.id} eventId={eventId} />
        ))}
      </div>
      <hr />
      <form
        className={'grid grid-cols-[1fr_auto] w-full px-5 py-5 gap-10 items-center'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={'grid grid-cols-2 gap-3'}>
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
        <Button type="submit" className={'flex !px-2 flex items-center'} kind={'secondary'}>
          <PlusIcon className={'fill-blue-600'} /> <span className={'ml-2'}>Dodaj nowy termin</span>
        </Button>
      </form>
    </div>
  );
};

export default EventDatePoll;
