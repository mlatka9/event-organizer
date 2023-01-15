import avatarFallback from '../../assets/images/avatar-fallback.svg';
import dayjs from 'dayjs';
import React from 'react';
import { GroupMessageType } from '@event-organizer/shared-types';
import clsx from 'clsx';

interface ChatMessageItemProps {
  message: GroupMessageType;
  isCurrentUserAuthor: boolean;
}

const ChatMessageItem = ({ message, isCurrentUserAuthor }: ChatMessageItemProps) => (
  <div
    className={clsx(
      'w-full flex items-center bg-white rounded-md space-x-4 p-2 w-fit',
      isCurrentUserAuthor && 'flex-row-reverse space-x-reverse bg-blue-600 self-end'
    )}
    key={message.id}
  >
    <img
      src={message.author.image || avatarFallback}
      alt={message.author.name}
      className={'w-10 h-10 rounded-full object-cover mb-auto'}
    />
    <div>
      <div
        className={clsx(
          'flex items-center gap-x-2 space-x-reverse h-[40px]',
          isCurrentUserAuthor && 'flex-row-reverse'
        )}
      >
        <p className={clsx('text-sm font-semibold', isCurrentUserAuthor && 'text-white')}>{message.author.name}</p>
        <p className={clsx('text-xs text-gray-400', isCurrentUserAuthor && 'text-white/80')}>
          {dayjs(message.createdAt).format('D MMMM YYYY H:mm')}
        </p>
      </div>
      <p className={clsx(isCurrentUserAuthor && 'text-right text-white')}>{message.content}</p>
    </div>
  </div>
);

export default ChatMessageItem;
