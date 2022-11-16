import { useRouter } from 'next/router';

import EventSettingLayout from '../../../../components/layouts/event-setting-layout';
import { useEventInfoQuery } from '../../../../hooks/query/events';

const EventSettingsDetailPage = () => {
  const router = useRouter();
  const eventId = router.query.eventId as string;

  const { data: eventData, isSuccess, isError, error } = useEventInfoQuery(eventId, router.isReady);

  if (!isSuccess) return <>loading...</>;

  return <EventSettingLayout>primary</EventSettingLayout>;
};

export default EventSettingsDetailPage;
