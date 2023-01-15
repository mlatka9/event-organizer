import React from 'react';
import { useGroupMessagesQuery } from '../../../../hooks/query/groups';
import ChatMessagesList from '../../../../components/chat/chat-messages-list';
import { useAuth } from '../../../../hooks/use-auth';
import { EventChatInput } from './index';
import { useEventChatMessagesQuery } from '../../../../hooks/query/events';
import EventModuleWrapper from '../event-module-wrapper';

interface EventChatProps {
  eventId: string;
}

const EventChat = ({ eventId }: EventChatProps) => {
  const { user } = useAuth();

  const {
    data: groupMessages,
    isSuccess,
    hasNextPage,
    fetchNextPage,
  } = useEventChatMessagesQuery({ eventId, limit: 3 });

  return (
    <EventModuleWrapper headerText={'Czat'}>
      {user && <EventChatInput eventId={eventId} />}
      <ChatMessagesList
        messages={groupMessages}
        isMessagesSuccess={isSuccess}
        isMoreMessages={Boolean(hasNextPage)}
        fetchMoreMessages={fetchNextPage}
      />
    </EventModuleWrapper>
  );
};

export default EventChat;
