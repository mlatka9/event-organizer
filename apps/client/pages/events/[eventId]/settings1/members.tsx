import { useRouter } from 'next/router';

import EventSettingLayout from '../../../../components/layouts/event-setting-layout';
import { useAllEventInvitationQuery, useEventInfoQuery } from '../../../../hooks/query/events';

const EventSettingsMembersPage = () => {
  const router = useRouter();
  const eventId = router.query.eventId as string;

  const { data: eventData, isSuccess, isError, error } = useEventInfoQuery(eventId, router.isReady);

  const { data: eventInvitations, isSuccess: isEventInvitationsStatus } = useAllEventInvitationQuery(
    eventId,
    router.isReady
  );

  console.log(eventInvitations);

  if (!isSuccess) return <>loading...</>;

  return <EventSettingLayout>members</EventSettingLayout>;
};

export default EventSettingsMembersPage;
