import { useGroupMessagesQuery } from '../../../../hooks/query/groups';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import GroupCard from '../../groups-home/group-card';
import { useInView } from 'react-intersection-observer';
import avatarFallback from '../../../../assets/images/avatar-fallback.svg';
import dayjs from 'dayjs';
import Button from '../../../../components/common/button';
import { useCreateGroupMessageMutation } from '../../../../hooks/mutation/groups';

interface GroupChatProps {
  groupId: string;
}

const GroupChat = ({ groupId }: GroupChatProps) => {
  const [inputValue, setInputValue] = useState('');

  const chatWrapper = useRef(null);

  const { ref, inView } = useInView({
    root: chatWrapper.current,
  });

  console.log('groupId', groupId);

  const onCreateMessageSuccess = () => {
    setInputValue('');
  };

  const { mutate: createGroupMessage, isLoading } = useCreateGroupMessageMutation(onCreateMessageSuccess);
  const { data: groupMessages, isSuccess, hasNextPage, fetchNextPage } = useGroupMessagesQuery({ groupId, limit: 3 });

  const handleCreateGroupMessage = () => {
    if (!inputValue.trim()) return;
    createGroupMessage({
      groupId: groupId,
      content: inputValue,
    });
  };

  useEffect(() => {
    if (hasNextPage && isSuccess && inView) {
      console.log('fetching new messages');
      fetchNextPage();
    }
  }, [inView, hasNextPage, isSuccess, fetchNextPage]);

  return (
    <div>
      <div className={'flex items-center mb-3'}>
        <input
          className={'ring w-full mr-3'}
          value={inputValue}
          onChange={({ target }) => setInputValue(target.value)}
        />
        <Button isSmall disabled={isLoading || !inputValue.length} onClick={handleCreateGroupMessage}>
          wyślij
        </Button>
      </div>

      <div ref={chatWrapper} className={'h-[300px] overflow-y-scroll'}>
        {isSuccess ? (
          <div className={'flex flex-col w-full gap-3 relative bottom-0'}>
            {groupMessages.pages.map((page, index) => (
              <Fragment key={index}>
                {page.messages.map((message) => (
                  <div className={'w-full flex items-center bg-white rounded-md p-2'} key={message.id}>
                    <img
                      src={message.author.image || avatarFallback}
                      alt={message.author.name}
                      className={'w-10 h-10 rounded-full object-cover mr-2'}
                    />
                    <div>
                      <div className={'flex items-baseline'}>
                        <p className={'text-sm font-semibold mr-1'}>{message.author.name}</p>
                        <p className={'text-xs text-gray-400'}>{dayjs(message.createdAt).format('D MMMM YYYY H:mm')}</p>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}
            <div ref={ref} className={'h-10 w-full bg-red-400'} />
          </div>
        ) : (
          <div className={'h-[1000px]'} />
        )}
      </div>
    </div>
  );
};

export default GroupChat;
