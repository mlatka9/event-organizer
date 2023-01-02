import React from 'react';
import { useGroupMessagesQuery } from '../../../../hooks/query/groups';
import ChatMessagesList from '../../../../components/chat/chat-messages-list';
import GroupChatInput from './group-chat-input';
import { useAuth } from '../../../../hooks/use-auth';

interface GroupChatProps {
  groupId: string;
}

const GroupChat = ({ groupId }: GroupChatProps) => {
  const { user } = useAuth();
  const { data: groupMessages, isSuccess, hasNextPage, fetchNextPage } = useGroupMessagesQuery({ groupId, limit: 3 });

  return (
    <div className={'bg-white'}>
      {user && <GroupChatInput groupId={groupId} />}
      <ChatMessagesList
        messages={groupMessages}
        isMessagesSuccess={isSuccess}
        isMoreMessages={Boolean(hasNextPage)}
        fetchMoreMessages={fetchNextPage}
      />
    </div>
  );
};

export default GroupChat;
