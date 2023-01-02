import React, { Fragment, useEffect, useRef } from 'react';
import { InfiniteData } from '@tanstack/react-query';
import { GetGroupMessagesReturnType } from '@event-organizer/shared-types';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../../hooks/use-auth';
import ChatMessageItem from './chat-message-item';

interface ChatMessagesListProps {
  messages: InfiniteData<GetGroupMessagesReturnType> | undefined;
  isMessagesSuccess: boolean;
  isMoreMessages: boolean;
  fetchMoreMessages: () => void;
}

const ChatMessagesList = ({
  messages,
  isMessagesSuccess,
  isMoreMessages,
  fetchMoreMessages,
}: ChatMessagesListProps) => {
  const { user } = useAuth();

  const chatWrapper = useRef(null);

  const { ref, inView } = useInView({
    root: chatWrapper.current,
  });

  useEffect(() => {
    if (isMoreMessages && isMessagesSuccess && inView) {
      console.log('fetching new messages');
      fetchMoreMessages();
    }
  }, [inView, fetchMoreMessages, isMoreMessages, isMessagesSuccess]);

  return (
    <div ref={chatWrapper} className={'h-[600px] overflow-y-scroll'}>
      {messages ? (
        <div className={'flex flex-col w-full gap-3 relative bottom-0'}>
          {messages.pages.map((page, index) => (
            <Fragment key={index}>
              {page.messages.map((message) => (
                <ChatMessageItem
                  message={message}
                  isCurrentUserAuthor={message.author.id === user?.userId}
                  key={message.id}
                />
              ))}
            </Fragment>
          ))}
          <div ref={ref} className={'h-1 w-full'} />
        </div>
      ) : (
        <div className={'h-[1000px]'} />
      )}
    </div>
  );
};

export default ChatMessagesList;
